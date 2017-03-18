const getItem = require("./getItem");

module.exports = function (query) {
  let index = parseInt(query.index);
  index = !isNaN(index) ? index : 1;
  let length = parseInt(query.length);
  length = !isNaN(length) ? length : 25;

  const result = {
    index,
    length,
    items: [],
  };

  const itemRequests = new Array(length)
    .fill(0)
    .map((x, i) => getItem({ mangaid: index + i, delay: i * 100 }));

  result.items = await Promise.all(itemRequests);

  return result;
};
