module.exports = function prefixObj(prefix, obj) {
  const obj2 = {};
  Object.keys(obj).forEach((key) => {
    obj2[prefix + key] = obj[key];
  });
  return obj2;
};
