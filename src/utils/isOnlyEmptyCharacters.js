function isOnlyEmptyCharacters(input) {
  if (
    typeof input !== 'string' ||
    !input.replace(/\s+/, '').length ||
    input.startsWith(' ') ||
    input.slice(-1) === ' '
  ) {
    return true;
  }
  return false;
}

module.exports = isOnlyEmptyCharacters;
