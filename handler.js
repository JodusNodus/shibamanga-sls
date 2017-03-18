const Handler = require("./lib/Handler");
const MangaPanda = require("./lib/sources/MangaPanda");
const MangaReader = require("./lib/sources/MangaReader");
const MangaEden = require("./lib/sources/MangaEden");

const handlers = [
  new Handler("mangapanda", new MangaPanda()),
  new Handler("mangareader", new MangaReader()),
  new Handler("mangaeden", new MangaEden()),
];

module.exports = {};

handlers.forEach((handler) => {
  Object.assign(module.exports, handler.getPrefixedFuncs());
});
