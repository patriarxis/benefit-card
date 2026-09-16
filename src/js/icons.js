/**
 * Phosphor Icons helpers.
 * Prefer fill for decorative/category icons; bold for close/status actions.
 */

export function createIcon(name, { weight = 'fill', className = '' } = {}) {
  const icon = document.createElement('i');
  const weightClass = weight === 'bold' ? 'ph-bold' : 'ph-fill';
  icon.className = [weightClass, `ph-${name}`, className].filter(Boolean).join(' ');
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

export function replaceWithIcon(element, name, options) {
  if (!element) return null;
  const icon = createIcon(name, options);
  element.replaceWith(icon);
  return icon;
}
