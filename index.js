// index.js
const path = require('path');
const fs = require('fs');
const http = require('http');
const oas3Tools = require('oas3-tools');

// Ruta al spec (ojo con mayúsculas/minúsculas)
const specPath = path.join(__dirname, 'api', 'openapi.yaml');

// Log para Render: confirma que el archivo existe
console.log('Resolved OpenAPI spec path:', specPath, 'exists?', fs.existsSync(specPath));

const options = {
  routing: {
    // Apunta a tu carpeta de controladores
    controllers: path.join(__dirname, 'controllers'),
  },
  logging: true,
};

// Crea la app Express desde el spec
const expressAppConfig = oas3Tools.expressAppConfig(specPath, options);
const app = expressAppConfig.getApp();

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Redirige la raíz a Swagger UI
app.get('/', (req, res) => res.redirect('/docs'));

// Arrancar servidor (Render inyecta PORT)
const port = process.env.PORT || 8080;
http.createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
