'use strict';

const uuid = require('uuid');

const instance = {};
const closeLogger = () => {
  if (instance.logger && !instance.logger.closed) {
    instance.logger.close();
  }
};

process.on('SIGINT', closeLogger);
process.on('SIGTERM', closeLogger);
process.on('exit', closeLogger);

module.exports = options => handler => (req, res, ...restArgs) => {
  const {logger} = options;
  if (!instance.logger) {
    instance.logger = logger;
  }
  const headerName = options.headerName || 'x-request-id';
  const id = req.headers[headerName] || uuid.v4();

  res.setHeader(headerName, id);

  logger.log({
    message: `Request ${id} started...`,
    req
  });

  const time = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(time);
    logger.log({
      message: `Request ${id} ended.`,
      duration: (diff[0] * 1e3) + (diff[1] * 1e-6),
      res
    });
  });

  return handler(req, res, ...restArgs);
};
