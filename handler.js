const Handler = require("./lib/Handler");
const MangaPanda = require("./lib/sources/MangaPanda");
const MangaReader = require("./lib/sources/MangaReader");
const MangaEden = require("./lib/sources/MangaEden");
const MangaUpdates = require("./lib/sources/MangaUpdates");

const handlers = [
  new Handler("mangapanda", new MangaPanda()),
  new Handler("mangareader", new MangaReader()),
  new Handler("mangaeden", new MangaEden()),
];

const mangaupdates = new MangaUpdates();

module.exports = {
  "mangaupdates-list": mangaupdates.list,
};

handlers.forEach((handler) => {
  Object.assign(module.exports, handler.getPrefixedFuncs());
});
