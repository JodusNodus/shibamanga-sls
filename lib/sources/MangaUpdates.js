const request = require("request-promise");
const cheerio = require("cheerio");
const delayToFinish = require("../utils/delay");
const toSlug = require("../utils/toSlug");
const toGenre = require("../utils/toGenre");
const cleanText = require("../utils/cleanText");

module.exports = class MangaUpdates {
  constructor() {
    this.baseURL = "https://www.mangaupdates.com";

    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
    this.list = this.list.bind(this);
    this.getItem = this.getItem.bind(this);
  }
  success(data, cb) {
    cb(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  }
  failure(err, cb) {
    console.error(err);
    cb(null, {
      statusCode: 400,
      body: err,
    });
  }
  list(event, context, cb) {
    let { index, length } = event.queryStringParameters;
    index = parseInt(index, 10);
    length = parseInt(length, 10);
    if (isNaN(index) || isNaN(length)) {
      this.failure("index & length required", cb);
    }

    const itemRequests = new Array(length)
      .fill(0)
      .map((x, i) => this.getItem({ mangaid: index + i, delay: i * 100 }));

    Promise.all(itemRequests)
      .then((x) => {
        const items = x.filter(y => !!y);
        const result = { index, length, items };
        this.success(result, cb);
      })
      .catch((e) => {
        this.failure(e, cb);
      });
  }
  getItem({ mangaid, delay = 0, retry = false }) {
    return new Promise((res, rej) => {
      delayToFinish(delay)
        .then(() =>
          request({
            url: `${this.baseURL}/series.html?id=${mangaid}`,
            transform: cheerio.load,
          }))
        .then(($) => {
          if ($("#main_content .series_content_cell").length < 1) {
            return null;
          }

          const title = cleanText(
            $(".series_content_cell .releasestitle").text(),
          );

          const details = {
            mangaid,
            title,
            slug: toSlug(title),
            slugs: [title],
            genres: [],
            recommendations: [],
            tags: [],
          };

          const $rows = $(".series_content_cell").find(".sContent");

          const rowData = [
            // First Column
            "summary",
            "type",
            "relatedItems",
            "alternativeTitles",
            "scanlatingGroups",
            "latestReleases",
            "completed",
            "completedScanlating",
            "animeStartEndChapter",
            "userReviews",
            "forum",
            "userRating",
            "lastUpdated",
            // Sectond Column
            "cover",
            "genres",
            "extraCategories",
            "categoryRecommendations",
            "recommendations",
            "author",
            "artist",
            "year",
            "originalPublisher",
            "mangazine",
            "licensed",
            "englishPublisher",
            "activityStats",
            "listStats",
          ];
          $rows.each((i, elem) => {
            const row = $(elem);
            const data = rowData[i];
            switch (data) {
            case "summary":
              details.summary = cleanText(row.text());
              break;
            case "year":
              details.year = parseInt(cleanText(row.text()), 10);
              if (isNaN(details.year)) {
                  details.year = undefined;
                }
              break;
            case "cover":
              details.cover = row.find("img").attr("src");
              break;
            case "author":
              details.author = row.find("a").text();
            case "artist":
              details.artist = row.find("a").text();
              break;
            case "completed":
              details.completed = row.text().indexOf("Complete") > -1;
              break;
            case "genres":
              row.find("a > u").each((i, elem) => {
                  let genre = cleanText($(elem).text()).toLowerCase();
                  genre = toGenre(genre);
                  details.genres.push(genre);
                });
              break;
            case "recommendations":
              row.find("a").each((i, elem) => {
                  const href = $(elem).attr("href");
                  const link = "series.html?id=";
                  if (href && href.indexOf(link) > -1) {
                    const id = parseInt(href.replace(link, ""), 10);
                    details.recommendations.push(id);
                  }
                });
              break;
            case "licensed":
              details.licensed = row.text().indexOf("Yes") > -1;
              break;
            case "originalPublisher":
              details.publisher = cleanText(row.text());
              break;
            case "userRating":
              details.rating = row
                  .text()
                  .match(/Bayesian Average: [\d\.]+ \/ 10.0/g);
              if (!details.rating || details.rating.length < 1) {
                  details.rating = 0;
                } else {
                  details.rating = details.rating[0];
                  details.rating = details.rating.replace(
                    "Bayesian\ Average\:\ ",
                    "",
                  );
                  details.rating = details.rating.replace(" / 10.0", "");
                  details.rating = parseFloat(details.rating) || 0;
                }
              break;
            case "alternativeTitles":
              details.alternativetitles = row
                  .html()
                  .replace(/<(?:.|\n)*?>/gm, "\n")
                  .split("\n")
                  .map(cleanText)
                  .filter(x => !!x)
                  .filter(x => x.length > 0)
                  .map(x => x.replace(/ \(\w+\)/, "")); // Remove lang indicator

              details.slugs = details.slugs.concat(details.alternativetitles);
              break;
            case "extraCategories":
              row.find("ul .tag_normal").each((i, elem) => {
                  const tag = cleanText($(elem).text()).toLowerCase();
                  details.tags.push(tag);
                });
            }
          });
          details.slugs = details.slugs.map(toSlug).filter(x => x.length > 1);

          res(details);
        })
        .catch((e) => {
          if (retry) {
            res();
            return console.log(e);
          }
          return this.getItem({ mangaid, retry: true });
        });
    });
  }
};
