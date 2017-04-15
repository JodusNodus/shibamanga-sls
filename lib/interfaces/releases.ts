import { MangaListItem } from "../interfaces/manga";

export interface ReleaseItem {
  mangaid?: number,
  mangaslug?: string,
  date: number,
  sourceslug?: string,
  chapternums: number[],
}

export interface FullReleaseItem extends ReleaseItem, MangaListItem {
  mangaid: number,
}