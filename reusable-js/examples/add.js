module.exports = function(a, b) {
  function _invoke(c) {
    return a + c;
  }

  return typeof b == 'number' ? _invoke(b) : _invoke;
};
