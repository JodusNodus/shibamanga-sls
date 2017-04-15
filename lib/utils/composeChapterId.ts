export default function composeChapterId(mangaid:number, chapternum:number, sourceslug:string):string {
  return `${mangaid}-${chapternum}-${sourceslug}`;
};
