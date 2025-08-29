'use strict';

const path = require('path');
const http = require('http');
const cors = require('cors');
const oas3Tools = require('oas3-tools');

const serverPort = process.env.PORT || 8080;

const options = {
  routing: { controllers: path.join(__dirname, './controllers') },
};

const expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, 'api/openapi.yaml'),
  options
);
const app = expressAppConfig.getApp();

app.use(cors());
app.get('/health', (_req, res) => res.json({ ok: true }));

http.createServer(app).listen(serverPort, () => {
  console.log('Server listening on port %d', serverPort);
  console.log('Docs at http://localhost:%d/docs', serverPort);
});
