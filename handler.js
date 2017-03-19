const updateMangas = require("./lib/updater/mangas");
const updateMangasources = require("./lib/updater/mangasources");
const updateReleases = require("./lib/updater/releases");

const handlerFactory = f =>
  (e, ctx, cb) => {
    f()
      .then(() => {
        cb();
      })
      .catch((err) => {
        cb(err);
      });
  };

module.exports = {
  updateMangas: handlerFactory(updateMangas),
  updateMangasources: handlerFactory(updateMangasources),
  updateReleases: handlerFactory(updateReleases),
};
