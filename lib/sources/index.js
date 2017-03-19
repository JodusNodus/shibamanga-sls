const MangaUpdates = require("./MangaUpdates");
const MangaEden = require("./MangaEden");
const MangaPanda = require("./MangaPanda");
const MangaReader = require("./MangaReader");

module.exports = {
  mangas: MangaUpdates,
  mangasources: [MangaPanda, MangaEden, MangaReader],
};
