import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from './content.js';

gsap.registerPlugin(ScrollTrigger);

let matchMediaCtx = null;
let resizeObserver = null;
let refreshTimer = null;

const EASE = 'power2.inOut';
const DURATION = 0.55;
/** Viewport-heights of scroll each beat occupies. Same on every breakpoint. */
const SCROLL_PER_STEP = 0.45;
/** Fraction of a beat you must recross before the story steps backward. */
const STEP_HYSTERESIS = 0.12;

/**
 * Resting state of the stage at each story step, in step order.
 *
 * Every beat is a complete description of the stage, and transitions are produced by
 * tweening straight to the target beat. That means a step can be added or removed here
 * without re-chaining anything, and reverse-scrolling or jumping across several steps
 * lands on exactly the same state as stepping through them one at a time.
 *
 * `panel` names a measured height (see `measurePanel`); `card` carries the full
 * transform, which GSAP owns outright — the CSS deliberately sets none.
 *
 * `align: 'center'` means "centre horizontally in the panel". That can't be expressed
 * as a fixed `xPercent`, because the card is anchored by a percentage `right` that
 * scales with the panel while the card's own width does not; the offset is measured
 * instead (see `measureCard`) and applied as a pixel `x`.
 */
const BEATS = [
  {
    // Card only peeks in from the bottom-right corner, clear of the hero copy.
    panel: 'resting',
    hero: true,
    header: true,
    chrome: true,
    banner: false,
    card: {
      desktop: { xPercent: 25, yPercent: 18, rotate: 10, scale: 1, autoAlpha: 1 },
      mobile: { xPercent: 22, yPercent: 22, rotate: 10, scale: 1, autoAlpha: 1 },
    },
  },
  {
    // Card turns on its side and holds the right half; the intro copy has the left.
    panel: 'expanded',
    hero: false,
    header: false,
    chrome: true,
    banner: false,
    card: {
      desktop: { xPercent: -10, yPercent: -35, rotate: 90, scale: 1, autoAlpha: 1 },
      mobile: { align: 'center', yPercent: -55, rotate: 0, scale: 1.2, autoAlpha: 1 },
    },
  },
  {
    // Card front-on and lifted, leaving the bottom of the panel to the big text.
    panel: 'expanded',
    hero: false,
    header: false,
    chrome: true,
    banner: false,
    card: {
      desktop: { align: 'center', yPercent: -45, rotate: 0, scale: 1.3, autoAlpha: 1 },
      mobile: { align: 'center', yPercent: -75, rotate: 0, scale: 1.35, autoAlpha: 1 },
    },
  },
  {
    panel: 'collapsed',
    hero: false,
    header: false,
    chrome: false,
    banner: true,
    card: {
      desktop: { align: 'center', yPercent: -200, rotate: 0, scale: 1.3, autoAlpha: 1 },
      mobile: { align: 'center', yPercent: -200, rotate: 0, scale: 1.35, autoAlpha: 0 },
    },
  },
];

// Stage state, rebuilt on every matchMedia pass.
let stage = {};
let panelHeights = { resting: 0, expanded: 0, collapsed: 0 };
let cardCenterX = 0;
let bigTextSteps = new Set();
let stepCount = BEATS.length;
let cardVariant = 'desktop';
let currentStep = 0;

function debounceRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 150);
}

function bindRefreshListeners() {
  window.addEventListener('resize', debounceRefresh, { passive: true });
  window.addEventListener('orientationchange', debounceRefresh, {
    passive: true,
  });

  const stageEl = document.querySelector('.scroll-story__stage');
  if (stageEl && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(debounceRefresh);
    resizeObserver.observe(stageEl);
  }
}

function unbindRefreshListeners() {
  window.removeEventListener('resize', debounceRefresh);
  window.removeEventListener('orientationchange', debounceRefresh);
  resizeObserver?.disconnect();
  resizeObserver = null;
  clearTimeout(refreshTimer);
  refreshTimer = null;
}

/**
 * The `.display` panel animates its height, which reflows every frame, so the three
 * target heights are measured once per build/refresh instead of per tween.
 */
function measurePanel() {
  const stageEl = document.querySelector('.scroll-story__stage');
  const styles = stageEl ? getComputedStyle(stageEl) : null;
  const padY = styles
    ? parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    : 32;
  const stageH = stageEl?.clientHeight || window.innerHeight;

  panelHeights = {
    resting: Math.max(160, stageH * 0.38),
    expanded: Math.max(200, stageH - padY),
    collapsed: Math.min(340, Math.max(200, stageH * 0.34)),
  };
}

/**
 * Pixel shift that takes the card from its CSS anchor to the panel's horizontal
 * centre. `offsetLeft`/`offsetWidth` are layout values, so this reads the anchored
 * box without having to unwind whatever transform GSAP currently has applied.
 */
function measureCard() {
  const card = document.querySelector('.card');
  const canvas = card?.offsetParent;
  if (!card || !canvas) return;

  const anchoredCenter = card.offsetLeft + card.offsetWidth / 2;
  cardCenterX = canvas.clientWidth / 2 - anchoredCenter;
}

function cardVarsFor(beat) {
  const { align, ...vars } = beat.card[cardVariant];
  return align === 'center'
    ? { ...vars, x: cardCenterX, xPercent: 0 }
    : { ...vars, x: 0 };
}

function setupReducedMotion() {
  const stageEl = document.querySelector('.scroll-story__stage');

  // The static layout is entirely CSS-driven, so drop any inline state that the
  // animated mode may have left on these elements.
  gsap.set(
    [
      '.hero',
      '.display',
      '.section-info',
      '.intro',
      '.big-text',
      '.partner-banner',
      '.card',
      '.scroll-info',
      '.progress-bar-wrapper',
      '.header',
    ],
    { clearProps: 'all' },
  );

  stageEl?.classList.add('is-reduced-motion');
}

function stepsWithBigText() {
  const set = new Set();
  (content.storySteps ?? []).forEach((step, index) => {
    if (step.showBigText) set.add(index);
  });
  return set;
}

function beatAt(index) {
  return BEATS[Math.min(index, BEATS.length - 1)];
}

function apply(targets, vars, animate) {
  if (!targets || (Array.isArray(targets) && !targets.length)) return;

  const { duration, ...rest } = vars;
  if (animate) {
    gsap.to(targets, {
      ...rest,
      duration: duration ?? DURATION,
      ease: EASE,
      overwrite: 'auto',
    });
  } else {
    gsap.set(targets, { ...rest, overwrite: 'auto' });
  }
}

function goToStep(next, { animate = true } = {}) {
  const target = gsap.utils.clamp(0, stepCount - 1, next);
  if (animate && target === currentStep) return;

  currentStep = target;

  const beat = beatAt(target);
  const showBigText = bigTextSteps.has(target);

  // Lets the CSS invert the panel copy for beats that sit on the red partner banner.
  stage.canvas?.classList.toggle('is-banner', Boolean(beat.banner));

  apply(
    stage.hero,
    { autoAlpha: beat.hero ? 1 : 0, y: beat.hero ? 0 : -24 },
    animate,
  );
  apply(
    stage.header,
    { autoAlpha: beat.header ? 1 : 0, y: beat.header ? 0 : -20, duration: 0.35 },
    animate,
  );
  apply(
    stage.scrollInfo,
    { autoAlpha: beat.chrome ? 1 : 0, duration: 0.35 },
    animate,
  );
  apply(
    stage.progressWrap,
    { autoAlpha: beat.chrome ? 1 : 0, duration: 0.35 },
    animate,
  );
  apply(stage.display, { height: panelHeights[beat.panel] }, animate);
  apply(stage.card, cardVarsFor(beat), animate);
  apply(stage.banner, { autoAlpha: beat.banner ? 1 : 0 }, animate);
  apply(
    stage.bigText,
    { autoAlpha: showBigText ? 1 : 0, y: showBigText ? 0 : 12 },
    animate,
  );
  apply(
    stage.progress,
    { scaleY: stepCount <= 1 ? 1 : target / (stepCount - 1) },
    animate,
  );

  // Steps already behind us exit upward, steps still ahead wait below, so the
  // target-state tweens keep a sense of scroll direction.
  stage.labels.forEach((label, index) => {
    const active = index === target;
    apply(
      label,
      {
        autoAlpha: active ? 1 : 0,
        y: active ? 0 : index < target ? -8 : 8,
        duration: 0.35,
      },
      animate,
    );
  });

  stage.intros.forEach((intro) => {
    const index = Number(intro.dataset.stepIndex);
    const active = index === target;
    apply(
      intro,
      {
        autoAlpha: active ? 1 : 0,
        y: active ? 0 : index < target ? -16 : 16,
        duration: active ? 0.45 : 0.3,
      },
      animate,
    );
  });
}

function pinEnd() {
  return `+=${Math.round(window.innerHeight * SCROLL_PER_STEP * stepCount)}`;
}

function stepFromProgress(progress) {
  const last = stepCount - 1;
  if (last <= 0) return 0;
  if (progress >= 0.999) return last;

  const scaled = progress * stepCount;
  if (scaled >= currentStep + 1) {
    return Math.min(last, Math.floor(scaled));
  }
  if (scaled <= currentStep - STEP_HYSTERESIS) {
    return Math.max(0, Math.floor(scaled));
  }
  return currentStep;
}

/**
 * Discrete step story: the pin creates the scroll runway, and crossing a progress
 * threshold moves the stage to the next beat (no scrub).
 */
function buildStepStory({ variant }) {
  const story = document.querySelector('.scroll-story');

  stage = {
    display: document.querySelector('.display'),
    canvas: document.querySelector('.canvas'),
    hero: document.querySelector('.hero'),
    header: document.querySelector('.header'),
    scrollInfo: document.querySelector('.scroll-info'),
    progress: document.querySelector('.progress'),
    progressWrap: document.querySelector('.progress-bar-wrapper'),
    card: document.querySelector('.card'),
    bigText: document.querySelector('.big-text'),
    banner: document.querySelector('.partner-banner'),
    labels: gsap.utils.toArray('.section-info'),
    intros: gsap.utils.toArray('.intro'),
  };

  cardVariant = variant;
  bigTextSteps = stepsWithBigText();
  stepCount = Math.max(2, stage.labels.length || BEATS.length);
  currentStep = 0;

  measurePanel();
  measureCard();
  gsap.set(stage.progress, { transformOrigin: 'top center' });
  gsap.set(stage.card, { transformOrigin: 'center center' });
  goToStep(0, { animate: false });

  ScrollTrigger.create({
    trigger: story,
    start: 'top top',
    end: pinEnd,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate(self) {
      goToStep(stepFromProgress(self.progress));
    },
    onRefresh(self) {
      // Viewport changed: re-measure, then re-apply the current beat without
      // animating so the panel and card snap to the new geometry.
      measurePanel();
      measureCard();
      goToStep(stepFromProgress(self.progress), { animate: false });
    },
  });
}

export function createScrollStory() {
  destroyScrollStory();

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  bindRefreshListeners();

  matchMediaCtx = gsap.matchMedia();

  matchMediaCtx.add(
    {
      isDesktop: '(min-width: 1025px)',
      isMobile: '(max-width: 1024px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, reduceMotion } = context.conditions;

      document
        .querySelector('.scroll-story__stage')
        ?.classList.remove('is-reduced-motion');

      if (reduceMotion) {
        setupReducedMotion();
        return;
      }

      buildStepStory({
        variant: isDesktop ? 'desktop' : 'mobile',
      });
    },
  );
}

export function destroyScrollStory() {
  unbindRefreshListeners();
  matchMediaCtx?.revert();
  matchMediaCtx = null;
}
