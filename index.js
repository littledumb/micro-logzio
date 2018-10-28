'use strict';

const uuid = require('uuid');

module.exports = options => handler => (req, res, ...restArgs) => {
  const {logger} = options;
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
