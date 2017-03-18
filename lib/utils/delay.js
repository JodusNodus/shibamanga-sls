const Promise = require("bluebird");

module.exports = ms =>
  new Promise((res) => {
    setTimeout(res, ms);
  });
