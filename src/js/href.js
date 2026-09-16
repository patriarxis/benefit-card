export function isPlaceholderHref(url) {
  return !url || url === '#';
}

export function bindHref(anchor, url) {
  if (isPlaceholderHref(url)) {
    anchor.href = '#';
    anchor.addEventListener('click', (event) => event.preventDefault());
    return;
  }

  anchor.href = url;
}
