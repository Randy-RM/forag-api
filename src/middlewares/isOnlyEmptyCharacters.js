function isOnlyEmptyCharacters(stringInput) {
  stringInput = toString(stringInput);
  if (!stringInput.replace(/\s+/, '').length) {
    return true;
  }
  return false;
}

module.exports = isOnlyEmptyCharacters;
