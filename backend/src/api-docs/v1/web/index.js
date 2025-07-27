const swaggerUi = require('swagger-ui-express');
const router = require('express').Router();

const swagger = require('../../../config/swagger');

const mobile = swaggerUi.generateHTML(
    swagger.webSetup,
);
router.use('', swaggerUi.serveFiles(swagger.webSetup, {swaggerOptions: { displayRequestDuration: true }}));
router.get('', (req, res) => res.send(mobile));

module.exports = router;
