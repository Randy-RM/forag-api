/**
 * --------------------------
 * Method that checks if
 * a string starts or ends
 * with empty characters
 * or if it is totally empty.
 * --------------------------
 */
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
