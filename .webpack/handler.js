(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _assign = __webpack_require__(1);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (!global._babelPolyfill) {
	  __webpack_require__(2);
	}

	var Handler = __webpack_require__(3);
	var MangaPanda = __webpack_require__(9);
	var MangaReader = __webpack_require__(21);
	var MangaEden = __webpack_require__(22);

	var handlers = [new Handler("mangapanda", new MangaPanda()), new Handler("mangareader", new MangaReader()), new Handler("mangaeden", new MangaEden())];

	module.exports = {};

	handlers.forEach(function (handler) {
	  (0, _assign2.default)(module.exports, handler.getPrefixedFuncs());
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/assign");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _stringify = __webpack_require__(4);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(5);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(6);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var prefixObj = __webpack_require__(7);

	module.exports = function () {
	  function Handler(name, scraper) {
	    (0, _classCallCheck3.default)(this, Handler);

	    this.name = name;
	    this.scraper = scraper;

	    this.chapter = this.chapter.bind(this);
	    this.chapterList = this.chapterList.bind(this);
	    this.list = this.list.bind(this);
	    this.releases = this.releases.bind(this);
	  }

	  (0, _createClass3.default)(Handler, [{
	    key: "success",
	    value: function success(data, cb) {
	      cb(null, {
	        statusCode: 200,
	        body: (0, _stringify2.default)(data)
	      });
	    }
	  }, {
	    key: "failure",
	    value: function failure(err, cb) {
	      console.error(err);
	      cb(null, {
	        statusCode: 400,
	        body: err
	      });
	    }
	  }, {
	    key: "chapter",
	    value: function chapter(event, context, cb) {
	      var _this = this;

	      var _event$pathParameters = event.pathParameters,
	          mangaalias = _event$pathParameters.mangaalias,
	          chapteralias = _event$pathParameters.chapteralias;

	      if (!mangaalias || !chapteralias) {
	        this.failure("mangaalias & chapteralias required", cb);
	        return;
	      }

	      this.scraper.getChapter(mangaalias, chapteralias).then(function () {
	        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	        var result = { mangaalias: mangaalias, chapteralias: chapteralias, items: items };
	        _this.success(result, cb);
	      }).catch(function (err) {
	        _this.failure(err, cb);
	      });
	    }
	  }, {
	    key: "chapterList",
	    value: function chapterList(event, context, cb) {
	      var _this2 = this;

	      var mangaalias = event.pathParameters.mangaalias;

	      if (!mangaalias) {
	        this.failure("mangaalias required", cb);
	        return;
	      }

	      this.scraper.getChapterList(mangaalias).then(function () {
	        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	        var result = {
	          mangaalias: mangaalias,
	          items: items
	        };
	        _this2.success(result, cb);
	      }).catch(function (err) {
	        _this2.failure(err, cb);
	      });
	    }
	  }, {
	    key: "list",
	    value: function list(event, context, cb) {
	      var _this3 = this;

	      this.scraper.getList().then(function () {
	        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	        var result = { items: items };
	        _this3.success(result, cb);
	      }).catch(function (err) {
	        _this3.failure(err, cb);
	      });
	    }
	  }, {
	    key: "releases",
	    value: function releases(event, context, cb) {
	      var _this4 = this;

	      this.scraper.getReleases().then(function () {
	        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	        var result = { items: items };
	        _this4.success(result, cb);
	      }).catch(function (err) {
	        _this4.failure(err, cb);
	      });
	    }
	  }, {
	    key: "getPrefixedFuncs",
	    value: function getPrefixedFuncs() {
	      return prefixObj(this.name + "-", {
	        releases: this.releases,
	        list: this.list,
	        chapter: this.chapter,
	        chapterList: this.chapterList
	      });
	    }
	  }]);
	  return Handler;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/json/stringify");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/createClass");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _keys = __webpack_require__(8);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = function prefixObj(prefix, obj) {
	  var obj2 = {};
	  (0, _keys2.default)(obj).forEach(function (key) {
	    obj2[prefix + key] = obj[key];
	  });
	  return obj2;
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/keys");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getPrototypeOf = __webpack_require__(10);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(5);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(11);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(12);

	var _inherits3 = _interopRequireDefault(_inherits2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Scraper = __webpack_require__(13);

	module.exports = function (_Scraper) {
	  (0, _inherits3.default)(MangaPanda, _Scraper);

	  function MangaPanda() {
	    (0, _classCallCheck3.default)(this, MangaPanda);
	    return (0, _possibleConstructorReturn3.default)(this, (MangaPanda.__proto__ || (0, _getPrototypeOf2.default)(MangaPanda)).call(this, {
	      name: "mangapanda",
	      baseURL: "http://www.mangapanda.com",
	      context: {
	        chapterPage: {
	          path: ":mangaalias/:chapteralias/:pagenum",
	          selectors: {
	            pageCount: "#pageMenu option",
	            img: "#imgholder img"
	          }
	        },
	        chapterList: {
	          path: ":mangaalias",
	          selectors: {
	            container: "#chapterlist",
	            row: "tr:not(.table_head)",
	            link: "a"
	          },
	          regex: {
	            title: /.* : (.*).*/,
	            date: /.*(\d{2}\/\d{2}\/\d{4})/,
	            chapteralias: /\/.+\/((\d|\.)+)/
	          },
	          dateFormat: "MM/DD/YYYY"
	        },
	        list: {
	          path: "alphabetical",
	          selectors: {
	            container: ".content_bloc2",
	            row: ".series_col li a"
	          },
	          regex: {
	            mangaalias: /\/(.+)/
	          }
	        },
	        releases: {
	          path: "latest",
	          selectors: {
	            container: ".updates",
	            row: "tr.c2",
	            date: ".c1",
	            dateFormat: "DD MMM YYYY",
	            title: ".chapter",
	            chapters: ".chaptersrec"
	          },
	          regex: {
	            chapternum: /.+ ((\d|\.)+)$/,
	            date: /(.*)/
	          }
	        }
	      }
	    }));
	  }

	  return MangaPanda;
	}(Scraper);

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/inherits");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray2 = __webpack_require__(14);

	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

	var _promise = __webpack_require__(15);

	var _promise2 = _interopRequireDefault(_promise);

	var _keys = __webpack_require__(8);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(5);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(6);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var request = __webpack_require__(16);
	var cheerio = __webpack_require__(17);
	var stringToEpoch = __webpack_require__(18);
	var toSlug = __webpack_require__(20);

	module.exports = function () {
	  function Scraper(_ref) {
	    var _ref$name = _ref.name,
	        name = _ref$name === undefined ? "" : _ref$name,
	        _ref$baseURL = _ref.baseURL,
	        baseURL = _ref$baseURL === undefined ? "" : _ref$baseURL,
	        _ref$context = _ref.context,
	        context = _ref$context === undefined ? {} : _ref$context;
	    (0, _classCallCheck3.default)(this, Scraper);

	    this.name = name;
	    this.baseURL = baseURL;
	    this.context = context;

	    this.requestHTML = this.requestHTML.bind(this);
	    this.requestPage = this.requestPage.bind(this);
	    this.getChapter = this.getChapter.bind(this);
	    this.getChapterList = this.getChapterList.bind(this);
	    this.getList = this.getList.bind(this);
	    this.getReleases = this.getReleases.bind(this);
	  }

	  (0, _createClass3.default)(Scraper, [{
	    key: "requestHTML",
	    value: function requestHTML(template) {
	      var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      var path = template;
	      (0, _keys2.default)(attr).forEach(function (key) {
	        path = path.replace(":" + key, attr[key]);
	      });

	      return request({
	        url: this.baseURL + "/" + path,
	        transform: cheerio.load
	      });
	    }
	  }, {
	    key: "requestPage",
	    value: function requestPage(mangaalias, chapteralias, pagenum) {
	      var _this = this;

	      var ctx = this.context.chapterPage;
	      return new _promise2.default(function (res, rej) {
	        _this.requestHTML(ctx.path, { mangaalias: mangaalias, chapteralias: chapteralias, pagenum: pagenum }).then(function ($) {
	          var pageCount = $(ctx.selectors.pageCount).length;
	          var img = $(ctx.selectors.img).attr("src");
	          var page = { pagenum: pagenum, img: img };
	          res([page, pageCount]);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getChapter",
	    value: function getChapter(mangaalias, chapteralias) {
	      var _this2 = this;

	      return new _promise2.default(function (res, rej) {
	        var pages = [];
	        _this2.requestPage(mangaalias, chapteralias, 1).then(function (_ref2) {
	          var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
	              page = _ref3[0],
	              pageCount = _ref3[1];

	          pages[0] = page;

	          var promises = new Array(pageCount - 1).fill(0).map(function (x, i) {
	            return _this2.requestPage(mangaalias, chapteralias, i + 2);
	          });

	          return _promise2.default.all(promises);
	        }).then(function (otherPages) {
	          otherPages.forEach(function (_ref4) {
	            var _ref5 = (0, _slicedToArray3.default)(_ref4, 1),
	                page = _ref5[0];

	            pages.push(page);
	          });
	          res(pages);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getChapterList",
	    value: function getChapterList(mangaalias) {
	      var _this3 = this;

	      var ctx = this.context.chapterList;
	      return new _promise2.default(function (res, rej) {
	        _this3.requestHTML(ctx.path, { mangaalias: mangaalias }).then(function ($) {
	          var chapters = [];

	          var $rows = $(ctx.selectors.container).find(ctx.selectors.row);

	          if (ctx.selectors.remove) {
	            $rows.find(ctx.selectors.remove).text("");
	          }

	          $rows.each(function (i, elem) {
	            var chapter = $(elem).text();
	            var title = ctx.regex.title.exec(chapter)[1].trim();

	            var href = $(elem).find(ctx.selectors.link).attr("href");
	            var chapteralias = ctx.regex.chapteralias.exec(href)[1];

	            var chapternum = void 0;
	            if (ctx.regex.chapternum) {
	              chapternum = ctx.regex.chapternum.exec(chapter)[1];
	            } else {
	              chapternum = chapteralias;
	            }
	            chapternum = parseFloat(chapternum, 10);

	            var dateString = ctx.regex.date.exec(chapter)[1];
	            var date = stringToEpoch(dateString, ctx.dateFormat);

	            chapters.push({
	              chapteralias: chapteralias,
	              chapternum: chapternum,
	              date: date,
	              title: title
	            });
	          });
	          res(chapters);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getList",
	    value: function getList() {
	      var _this4 = this;

	      var ctx = this.context.list;
	      return new _promise2.default(function (res, rej) {
	        _this4.requestHTML(ctx.path).then(function ($) {
	          var mangas = [];

	          var $rows = $(ctx.selectors.container).find(ctx.selectors.row);

	          $rows.each(function (i, elem) {
	            var href = $(elem).attr("href");
	            var mangaalias = ctx.regex.mangaalias.exec(href)[1];
	            var title = $(elem).text();

	            mangas.push({
	              mangaslug: toSlug(title),
	              mangaalias: mangaalias
	            });
	          });
	          res(mangas);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getReleases",
	    value: function getReleases() {
	      var _this5 = this;

	      var ctx = this.context.releases;
	      return new _promise2.default(function (res, rej) {
	        _this5.requestHTML(ctx.path).then(function ($) {
	          var releases = [];

	          var $rows = $(ctx.selectors.container).find(ctx.selectors.row);

	          $rows.each(function (i, elem) {
	            var dateString = $(elem).find(ctx.selectors.date).text();
	            dateString = ctx.regex.date.exec(dateString)[1];
	            var date = stringToEpoch(dateString, ctx.dateFormat);

	            var title = $(elem).find(ctx.selectors.title).text();
	            var mangaslug = toSlug(title);

	            var chapternums = [];

	            var chaptersEls = $(elem).find(ctx.selectors.chapters);

	            chaptersEls.each(function (i, chapter) {
	              var text = $(chapter).text();
	              var chapternum = ctx.regex.chapternum.exec(text)[1];
	              chapternum = parseInt(chapternum, 10);
	              chapternums.push(chapternum);
	            });

	            releases.push({
	              mangaslug: mangaslug,
	              date: date,
	              chapternums: chapternums
	            });
	          });
	          res(releases);
	        }).catch(rej);
	      });
	    }
	  }]);
	  return Scraper;
	}();

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/promise");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("request-promise-native");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("cheerio");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var moment = __webpack_require__(19);

	module.exports = function stringToEpoch(dateString, format) {
	  var today = moment();
	  var yesterday = today.subtract(1, "day");

	  var date = void 0;
	  if (/today/i.test(dateString)) {
	    date = today;
	  } else if (/yesterday/i.test(dateString)) {
	    date = yesterday;
	  } else {
	    date = moment(dateString, format);
	  }
	  return date.valueOf();
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	var toSlug = function toSlug(str) {
	  return str.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	};

	module.exports = toSlug;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getPrototypeOf = __webpack_require__(10);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(5);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(11);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(12);

	var _inherits3 = _interopRequireDefault(_inherits2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Scraper = __webpack_require__(13);

	module.exports = function (_Scraper) {
	  (0, _inherits3.default)(MangaReader, _Scraper);

	  function MangaReader() {
	    (0, _classCallCheck3.default)(this, MangaReader);
	    return (0, _possibleConstructorReturn3.default)(this, (MangaReader.__proto__ || (0, _getPrototypeOf2.default)(MangaReader)).call(this, {
	      name: "mangareader",
	      baseURL: "http://www.mangareader.net",
	      context: {
	        chapterPage: {
	          path: ":mangaalias/:chapteralias/:pagenum",
	          selectors: {
	            pageCount: "#pageMenu option",
	            img: "#imgholder img"
	          }
	        },
	        chapterList: {
	          path: ":mangaalias",
	          selectors: {
	            container: "#chapterlist",
	            row: "tr:not(.table_head)",
	            link: "a"
	          },
	          regex: {
	            title: /.* : (.*).*/,
	            date: /.*(\d{2}\/\d{2}\/\d{4})/,
	            chapteralias: /\/.+\/((\d|\.)+)/
	          },
	          dateFormat: "MM/DD/YYYY"
	        },
	        list: {
	          path: "alphabetical",
	          selectors: {
	            container: ".content_bloc2",
	            row: ".series_col li a"
	          },
	          regex: {
	            mangaalias: /\/(.+)/
	          }
	        },
	        releases: {
	          path: "latest",
	          selectors: {
	            container: ".updates",
	            row: "tr.c2",
	            date: ".c1",
	            dateFormat: "DD MMM YYYY",
	            title: ".chapter",
	            chapters: ".chaptersrec"
	          },
	          regex: {
	            chapternum: /.+ ((\d|\.)+)$/,
	            date: /(.*)/
	          }
	        }
	      }
	    }));
	  }

	  return MangaReader;
	}(Scraper);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray2 = __webpack_require__(14);

	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

	var _promise = __webpack_require__(15);

	var _promise2 = _interopRequireDefault(_promise);

	var _classCallCheck2 = __webpack_require__(5);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(6);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var request = __webpack_require__(16);
	var cheerio = __webpack_require__(17);
	var stringToEpoch = __webpack_require__(18);
	var toSlug = __webpack_require__(20);

	module.exports = function () {
	  function MangaEden() {
	    (0, _classCallCheck3.default)(this, MangaEden);

	    this.name = "mangaeden";
	    this.baseURL = "https://www.mangaeden.com/api";
	    this.imgURL = "https://cdn.mangaeden.com/mangasimg";

	    this.getChapter = this.getChapter.bind(this);
	    this.getChapterList = this.getChapterList.bind(this);
	    this.getList = this.getList.bind(this);
	    this.getReleases = this.getReleases.bind(this);
	  }

	  (0, _createClass3.default)(MangaEden, [{
	    key: "getChapter",
	    value: function getChapter(mangaalias, chapteralias) {
	      var _this = this;

	      return new _promise2.default(function (res, rej) {
	        request({
	          url: _this.baseURL + "/chapter/" + chapteralias,
	          json: true
	        }).then(function (data) {
	          var pages = data.images.reverse().map(function (_ref) {
	            var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
	                pageId = _ref2[0],
	                img = _ref2[1];

	            return {
	              pagenum: pageId + 1,
	              img: _this.imgURL + "/" + img
	            };
	          });
	          res(pages);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getChapterList",
	    value: function getChapterList(mangaalias) {
	      var _this2 = this;

	      return new _promise2.default(function (res, rej) {
	        request({
	          url: _this2.baseURL + "/manga/" + mangaalias,
	          json: true
	        }).then(function (data) {
	          var chapterList = data.chapters.reverse().map(function (_ref3) {
	            var _ref4 = (0, _slicedToArray3.default)(_ref3, 4),
	                chapternum = _ref4[0],
	                date = _ref4[1],
	                title = _ref4[2],
	                chapteralias = _ref4[3];

	            return {
	              chapternum: chapternum,
	              chapteralias: chapteralias,
	              title: title,
	              date: date * 1000
	            };
	          });
	          res(chapterList);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getList",
	    value: function getList() {
	      var _this3 = this;

	      return new _promise2.default(function (res, rej) {
	        request({
	          url: _this3.baseURL + "/list/0",
	          json: true
	        }).then(function (data) {
	          var mangas = data.manga.map(function (_ref5) {
	            var i = _ref5.i,
	                t = _ref5.t;
	            return {
	              mangaalias: i,
	              mangaslug: toSlug(t)
	            };
	          });
	          res(mangas);
	        }).catch(rej);
	      });
	    }
	  }, {
	    key: "getReleases",
	    value: function getReleases() {
	      return new _promise2.default(function (res, rej) {
	        request({
	          url: "http://www.mangaeden.com/ajax/news/1/0/0/",
	          transform: function transform(body) {
	            return cheerio.load("<body>" + body + "</body>");
	          }
	        }).then(function ($) {
	          var releases = [];

	          var $rows = $("body").find("li");

	          if ($rows.length < 1) {
	            rej("no rows found");
	          }

	          $rows.each(function (i, elem) {
	            var linkPrefix = "/en/en-manga/";
	            var $a = $(elem).find(".openManga, .closedManga");
	            var aliasid = $a.attr("href").replace(linkPrefix, "").replace("/", "");
	            var title = $a.text();

	            var chaptersEls = $(elem).find(".chapterLink");

	            var chapternums = [];

	            chaptersEls.each(function (i, chapter) {
	              var chapterAliasid = $(chapter).attr("href").replace("" + linkPrefix + aliasid + "/", "");
	              var chapternum = parseInt(chapterAliasid, 10);
	              chapternums.push(chapternum);
	            });

	            var dateString = $(elem).find(".chapterDate").first().text();
	            var date = stringToEpoch(dateString, "MMM D, YYYY");

	            releases.push({
	              mangaslug: toSlug(title),
	              date: date,
	              chapternums: chapternums
	            });
	          });
	          res(releases);
	        }).catch(rej);
	      });
	    }
	  }]);
	  return MangaEden;
	}();

/***/ }
/******/ ])));