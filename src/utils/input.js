export function handleBlurOnEscape(event) {
  if (event.key === 'Esc' || event.key === 'Escape') {
    event.target.blur();
  }
}
