import { ReleaseItem } from "./releases";
import { Page, ChapterListItem, MangaListItem } from "./chapter";

export interface Source {
  name: string,
  baseURL: string,
  context?: object,
  getChapter(mangaalias:string, chapteralias:string):Promise<Page[]>;
  getChapterList(mangaalias:string):Promise<ChapterListItem[]>;
  getList():Promise<MangaListItem[]>;
  getReleases():Promise<ReleaseItem[]>;
}

export interface Context {
  chapterPage: {
    path: string
    selectors: {
      pageCount: string
      img: string
    },
  },
  chapterList: {
    path: string
    selectors: {
      container: string,
      row: string,
      link: string,
      remove?: string,
    },
    regex: {
      title: RegExp,
      date: RegExp,
      chapteralias: RegExp,
      chapternum?: RegExp,
    },
    dateFormat: string
  },
  list: {
    path: string
    selectors: {
      container: string
      row: string
    },
    regex: {
      mangaalias: RegExp
    },
  },
  releases: {
    path: string,
    dateFormat: string
    selectors: {
      container: string,
      row: string,
      date: string,
      title: string
      chapters: string
    },
    regex: {
      chapternum: RegExp,
      date: RegExp
    },
  }
}