const checkParams = (item, params) => {
  for (const param of params) {
    if (!item[param]) {
      return { isPassed: false, missingParam: param };
    }
  }
  return { isPassed: true, missingParam: null };
};

module.exports = { checkParams };
