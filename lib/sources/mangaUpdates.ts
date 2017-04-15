import * as request from "request-promise-lite";
import * as cheerio from "cheerio";
import delayToFinish from "../utils/delay";
import toSlug from "../utils/toSlug";
import toGenre from "../utils/toGenre";
import cleanText from "../utils/cleanText";

import { Manga } from "../interfaces/manga";

class MangaUpdates {
  name: string;
  baseURL: string;

  constructor() {
    this.name = "mangaupdates";
    this.baseURL = "https://www.mangaupdates.com";

    this.getList = this.getList.bind(this);
    this.getItem = this.getItem.bind(this);
  }
  async getList(index:number, length:number):Promise<Manga[]> {
    const itemRequests = new Array(length)
      .fill(0)
      .map((x, i) => this.getItem(index + i, i * 100));

    const items = await Promise.all(itemRequests);
    return items.filter(x => !!x);
  }
  async getItem(mangaid: number, delay: number = 0, retry: boolean = false):Promise<Manga> {
    await delayToFinish(delay)

    try {
      const $ = request({
        url: `${this.baseURL}/series.html?id=${mangaid}`,
        transform: cheerio.load,
      });

      if ($("#main_content .series_content_cell").length < 1) {
        return null;
      }

      const title = cleanText(
        $(".series_content_cell .releasestitle").text(),
      );

      const details: any = {
        mangaid,
        title,
        mangaslugs: [title],
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
        const $row = $(elem);
        const data = rowData[i];
        switch (data) {
          case "summary":
            details.summary = cleanText($row.text());
            break;
          case "year":
            details.year = parseInt(cleanText($row.text()), 10);
            if (isNaN(details.year)) {
              details.year = undefined;
            }
            break;
          case "cover":
            details.cover = $row.find("img").attr("src");
            break;
          case "author":
            details.author = $row.find("a").text();
          case "artist":
            details.artist = $row.find("a").text();
            break;
          case "completed":
            details.completed = $row.text().indexOf("Complete") > -1;
            break;
          case "genres":
            $row.find("a > u").each((i, elem) => {
              let genre = cleanText($(elem).text()).toLowerCase();
              genre = toGenre(genre);
              details.genres.push(genre);
            });
            break;
          case "recommendations":
            $row.find("a").each((i, elem) => {
              const href = $(elem).attr("href");
              const link = "series.html?id=";
              if (href && href.indexOf(link) > -1) {
                const id = parseInt(href.replace(link, ""), 10);
                details.recommendations.push(id);
              }
            });
            break;
          case "licensed":
            details.licensed = $row.text().indexOf("Yes") > -1;
            break;
          case "originalPublisher":
            details.publisher = cleanText($row.text());
            break;
          case "userRating":
            const ratingMatches: string[] = $row
              .text()
              .match(/Bayesian Average: [\d\.]+ \/ 10.0/g);
            if (!ratingMatches || ratingMatches.length < 1) {
              details.rating = 0;
            } else {
              let ratingStr: string = ratingMatches[0];
              ratingStr = ratingStr.replace("Bayesian\ Average\:\ ", "");
              ratingStr = ratingStr.replace(" / 10.0", "");
              details.rating = parseFloat(ratingStr) || 0;
            }
            break;
          case "alternativeTitles":
            details.alternativetitles = $row
              .html()
              .replace(/<(?:.|\n)*?>/gm, "\n")
              .split("\n")
              .map(cleanText)
              .filter(x => !!x)
              .filter(x => x.length > 0)
              .map(x => x.replace(/ \(\w+\)/, "")); // Remove lang indicator
            details.mangaslugs = details.mangaslugs.concat(details.alternativetitles);
            break;
          case "extraCategories":
            $row.find("ul .tag_normal").each((i, elem) => {
              const tag = cleanText($(elem).text()).toLowerCase();
              details.tags.push(tag);
            });
        }
      });
      details.mangaslugs = details.mangaslugs
        .map(toSlug)
        .filter(x => x.length > 1);

      return details as Manga;
    } catch (err) {
      if (retry) {
        return null;
      }
      return await this.getItem(mangaid, 0, true);
    };
  }
};

export default new MangaUpdates();