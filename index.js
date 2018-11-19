'use strict';

const uuid = require('uuid');
const {createNamespace} = require('cls-hooked');
const logzio = require('logzio-nodejs');

const ns = createNamespace(uuid.v4());
const keys = ['REQUEST_ID', 'CORRELATION_ID'];
const getRequestId = () => ns.get(keys[0]);
const getCorrelationId = () => ns.get(keys[1]);

const check = options => {
  if (!options || !options.token) {
    throw new Error('Your logz.io token is required');
  }
  const logger = logzio.createLogger({token: options.token});
  const requestIdHeader = options.requestIdHeader || 'x-request-id';
  const correlationIdHeader = options.correlationIdHeader || 'x-correlation-id';
  return {logger, requestIdHeader, correlationIdHeader};
};

const logzioLogger = options => handler => (req, res, ...restArgs) => {
  const {logger, requestIdHeader, correlationIdHeader} = check(options);
  const requestId = req.headers[requestIdHeader] || uuid.v4();
  const correlationId = req.headers[correlationIdHeader] || uuid.v4();

  req.requestId = getRequestId;
  req.correlationId = getCorrelationId;

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
    logger.close();
  });

  return ns.runAndReturn(() => {
    ns.set(keys[0], requestId);
    ns.set(keys[1], correlationId);
    return handler(req, res, ...restArgs);
  });
};

module.exports = {
  logzioLogger,
  getRequestId,
  getCorrelationId
};
