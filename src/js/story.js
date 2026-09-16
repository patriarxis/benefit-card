import { content } from './content.js';

/**
 * Render story step labels + intro panels from content.storySteps.
 */
export function renderStorySteps() {
  const steps = content.storySteps;
  if (!Array.isArray(steps) || !steps.length) return;

  const labelsRoot = document.querySelector('[data-story-labels]');
  const introsRoot = document.querySelector('[data-story-intros]');
  if (!labelsRoot || !introsRoot) return;

  labelsRoot.innerHTML = '';
  introsRoot.innerHTML = '';

  steps.forEach((step, index) => {
    const label = document.createElement('div');
    label.className = `section-info section-info-${index + 1}`;
    label.dataset.stepIndex = String(index);

    const number = document.createElement('p');
    number.className = 'section-number';
    number.textContent = step.id;

    const title = document.createElement('p');
    title.className = 'section-title';
    title.textContent = step.label;

    label.appendChild(number);
    label.appendChild(title);
    labelsRoot.appendChild(label);

    if (step.title || step.body) {
      const intro = document.createElement('div');
      intro.className = `intro intro-${index}`;
      intro.dataset.stepIndex = String(index);

      if (step.title) {
        const heading = document.createElement('h2');
        heading.className = 'intro-title';
        heading.textContent = step.title;
        intro.appendChild(heading);
      }

      if (step.body) {
        const body = document.createElement('p');
        body.className = 'intro-description';
        body.textContent = step.body;
        intro.appendChild(body);
      }

      introsRoot.appendChild(intro);
    }
  });
}
