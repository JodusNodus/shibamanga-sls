module.exports = function composeChapterId(
  { mangaid, chapternum, sourceslug },
) {
  return `${mangaid}-${chapternum}-${sourceslug}`;
};
