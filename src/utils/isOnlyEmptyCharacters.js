function isOnlyEmptyCharacters(input) {
  const stringInput = toString(input);
  if (!stringInput.replace(/\s+/, '').length) {
    return true;
  }
  return false;
}

module.exports = isOnlyEmptyCharacters;
