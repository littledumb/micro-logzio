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
  const headerNameForRequest = options.headerNameForRequest || 'x-request-id';
  const headerNameForCorrelation = options.headerNameForCorrelation || 'x-correlation-id';
  const requestId = req.headers[headerNameForRequest] || uuid.v4();
  const correlationId = req.headers[headerNameForCorrelation] || requestId;

  res.setHeader(headerNameForRequest, requestId);
  res.setHeader(headerNameForCorrelation, correlationId);

  logger.log({
    message: `Request ${requestId} started...`,
    req
  });

  const time = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(time);
    logger.log({
      message: `Request ${requestId} ended.`,
      duration: (diff[0] * 1e3) + (diff[1] * 1e-6),
      res
    });
  });

  return handler(req, res, ...restArgs);
};
