export interface Manga {
  mangaid: number,
  artist: string,
  author: string,
  summary: string,
  title: string,
  rating: number,
  completed: boolean,
  tags: string[],
  genres: string[],
  mangaslugs: string[],
  alternativetitles: string[],
  recommendations: number[],
  publisher: string
  year: number,
  licensed?: boolean,
  source?: string,
  cover?: string,
  hits?: number,
}

export interface MangaListItem {
  mangaid: number,
  title: string,
  cover: string,
  author: string,
  year: number,
  publisher: string,
  rating: number,
  foundInSources?: boolean,
}

export interface SourceItem {
  mangaalias: string,
  sourceslug: string,
}
