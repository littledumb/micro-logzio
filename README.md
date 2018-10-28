# micro-logzio
A middleware for micro framework that logs requests and responses using logz.io service.

## Usage

```
const logzio = require('logzio-nodejs');
const microLogzio = require('micro-logzio');

const logger = logzio.createLogger({
  token: {{your logz.io token}},
  host: 'listener.logz.io'
});
const reqLogger = microLogzio({
  logger,
  headerNameForRequest: 'x-request-id', // Optional, default is 'x-request-id'
  headerNameForCorrelation: 'x-correlation-id' // Optional, default is 'x-correlation-id'
});

module.exports = reqLogger(async (req, res) => `Hello world`);
```

## References

* [maximeshr/micro-bunyan-request](https://github.com/maximeshr/micro-bunyan-request) for micro
* [Logz.io](https://logz.io) who provides ELK service with free community plan
* [ELK stack](https://www.elastic.co/elk-stack) (Elasticsearch, Logstash and Kibana) for monitoring and analyzing distributed web services
