function isOnlyEmptyCharacters(string) {
  string = toString(string);
  if (!string.replace(/\s+/, "").length) {
    return true;
  }
  return false;
}

module.exports = isOnlyEmptyCharacters;
