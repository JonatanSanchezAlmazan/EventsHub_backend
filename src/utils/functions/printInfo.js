const printInfo = (total, lastPage, page, endpoint) => {
  return {
    count: total,
    pages: lastPage,
    currentPage: page,
    next:
      page + 1 > lastPage
        ? null
        : `http://localhost:3000/${endpoint}?page=${page + 1}`,
    prev:
      page - 1 <= 0
        ? null
        : `http://localhost:3000/${endpoint}?page=${page - 1}`,
  };
};

module.exports = { printInfo };
