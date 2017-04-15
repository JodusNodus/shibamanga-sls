export default function prefixObj(prefix:string, obj:object):object {
  const obj2 = {};
  Object.keys(obj).forEach((key) => {
    obj2[prefix + key] = obj[key];
  });
  return obj2;
};
