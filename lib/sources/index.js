const MangaUpdates = require("./MangaUpdates");
const MangaEden = require("./MangaEden");
const MangaPanda = require("./MangaPanda");
const MangaReader = require("./MangaReader");

module.exports = {
  mangas: MangaUpdates,
  sourceSlugs: ["mangapanda", "mangaeden", "mangareader"],
  mangasources: [MangaPanda, MangaEden, MangaReader],
};
