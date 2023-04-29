module.exports = class DefaulError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
};
