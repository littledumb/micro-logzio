# micro-logzio
A middleware for micro framework that logs requests and responses using logz.io service.

## Usage

```
const {logzioLogger, getRequestId, getCorrelationId} = require('micro-logzio');

module.exports = logzioLogger({token: 'your_logzio_token'})(async (req, res) => {
  const requestId = getRequestId();
  const correlationId = getCorrelationId();
});
```

## References

* [maximeshr/micro-bunyan-request](https://github.com/maximeshr/micro-bunyan-request) for micro
* [tafarij/micro-correlation-id](https://github.com/tafarij/micro-correlation-id) for micro
* [Logz.io](https://logz.io) who provides ELK service with free community plan
* [ELK stack](https://www.elastic.co/elk-stack) (Elasticsearch, Logstash and Kibana) for monitoring and analyzing distributed web services
