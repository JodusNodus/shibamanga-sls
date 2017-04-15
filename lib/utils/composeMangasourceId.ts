export default function composeMangasourceId(mangaslug:string, sourceslug:string):string {
  return `${mangaslug}-${sourceslug}`;
};
