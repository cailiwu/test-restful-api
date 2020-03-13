const log = (res, req, next) => {
  console.log('logging...');
  next();
};

module.exports = log;
