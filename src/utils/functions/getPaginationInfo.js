const Event = require("../../api/models/event");
const { dataPerPage } = require("../variable/pagination");

const getPaginationInfo = async (query) => {
  const total = await Event.countDocuments(query);
  const lastPage = Math.floor(total / dataPerPage) + 1;
  return {
    total,
    lastPage,
  };
};

module.exports = {
  getPaginationInfo,
};
