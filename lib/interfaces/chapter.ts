export interface Page {
  pagenum: number,
  img: string,
}

export interface ChapterListItem {
  chapternum: number,
  chapteralias: string,
  title: string,
  date: number,
}

export interface Chapter {
  mangaid: number,
  chapternum: number,
  sourceslug: string,
  chapteralias: string,
  title: string,
  date: number,
  pages: Page[],
};

export interface MangaListItem {
  mangaslug: string,
  mangaalias: string,
}