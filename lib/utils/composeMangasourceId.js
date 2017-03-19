module.exports = function composeMangasourceId({ mangaslug, sourceslug }) {
  return `${mangaslug}-${sourceslug}`;
};
