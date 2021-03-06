import Scraper from "./Scraper";

export default new Scraper("mangareader", "http://www.mangareader.net", {
  chapterPage: {
    path: ":mangaalias/:chapteralias/:pagenum",
    selectors: {
      pageCount: "#pageMenu option",
      img: "#imgholder img",
    },
  },
  chapterList: {
    path: ":mangaalias",
    selectors: {
      container: "#chapterlist",
      row: "tr:not(.table_head)",
      link: "a",
    },
    regex: {
      title: /.* : (.*).*/,
      date: /.*(\d{2}\/\d{2}\/\d{4})/,
      chapteralias: /\/.+\/((\d|\.)+)/,
    },
    dateFormat: "MM/DD/YYYY",
  },
  list: {
    path: "alphabetical",
    selectors: {
      container: ".content_bloc2",
      row: ".series_col li a",
    },
    regex: {
      mangaalias: /\/(.+)/,
    },
  },
  releases: {
    path: "latest",
    dateFormat: "DD MMM YYYY",
    selectors: {
      container: ".updates",
      row: "tr.c2",
      date: ".c1",
      title: ".chapter",
      chapters: ".chaptersrec",
    },
    regex: {
      chapternum: /.+ ((\d|\.)+)$/,
      date: /(.*)/,
    },
  },
});
