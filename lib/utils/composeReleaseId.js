module.exports = function composeReleaseId({ mangaid, date, sourceslug }) {
  return `${date}-${mangaid}-${sourceslug}`;
};
