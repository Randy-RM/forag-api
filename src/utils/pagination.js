/**
 * --------------------------
 * Method that returns paged.
 * --------------------------
 */
function getPagination(page, size) {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}

/**
 * --------------------------
 * Method that returns paged results.
 * --------------------------
 */
function getPagingData(data, page, limit) {
  const { count: totalItems, rows: results } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, totalPages, currentPage, results };
}

module.exports = {
  getPagination,
  getPagingData,
};
