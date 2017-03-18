const prefixObj = require("./utils/prefixObj");

module.exports = class Handler {
  constructor(name, scraper) {
    this.name = name;
    this.scraper = scraper;

    this.chapter = this.chapter.bind(this);
    this.chapterList = this.chapterList.bind(this);
    this.list = this.list.bind(this);
    this.releases = this.releases.bind(this);
  }
  success(data, cb) {
    cb(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  }
  failure(err, cb) {
    cb(null, {
      statusCode: 400,
      body: err,
    });
  }
  chapter(event, context, cb) {
    const { mangaalias, chapteralias } = event.pathParameters;
    if (!mangaalias || !chapteralias) {
      this.failure("mangaalias & chapteralias required", cb);
      return;
    }

    this.scraper
      .getChapter(mangaalias, chapteralias)
      .then((items = []) => {
        const result = { mangaalias, chapteralias, items };
        this.success(result, cb);
      })
      .catch(() => {
        this.failure("chapter not found", cb);
      });
  }
  chapterList(event, context, cb) {
    const { mangaalias } = event.pathParameters;
    if (!mangaalias) {
      this.failure("mangaalias required", cb);
      return;
    }

    this.scraper
      .getChapterList(mangaalias)
      .then((items = []) => {
        const result = {
          mangaalias,
          items,
        };
        this.success(result, cb);
      })
      .catch(() => {
        this.failure("manga not found", cb);
      });
  }
  list(event, context, cb) {
    this.scraper
      .getList()
      .then((items = []) => {
        const result = { items };
        this.success(result, cb);
      })
      .catch(() => {
        this.failure("list not found", cb);
      });
  }

  releases(event, context, cb) {
    this.scraper
      .getReleases()
      .then((items = []) => {
        const result = { items };
        this.success(result, cb);
      })
      .catch(() => {
        this.failure("releases not found", cb);
      });
  }
  getPrefixedFuncs() {
    return prefixObj(`${this.name}-`, {
      releases: this.releases,
      list: this.list,
      chapter: this.chapter,
      chapterList: this.chapterList,
    });
  }
};
