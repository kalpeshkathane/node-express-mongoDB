module.exports = {
  getCreatedTimeStamp: function (userId) {
    return {
      isDeleted: false,  
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  getUpdatedTimeStamp: function (userId) {
    return {
      updatedBy: userId,
      updatedAt: new Date(),
    };
  },
};
