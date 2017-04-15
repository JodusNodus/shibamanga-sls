
export default function composeReleaseId(mangaid:number, sourceslug:string, date:number):string {
  return `${date}-${mangaid}-${sourceslug}`;
};
