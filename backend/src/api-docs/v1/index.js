const router = require('express').Router();
const basicAuth = require('express-basic-auth');
const mobile = require('./web');


router.use(
  '/web',
  basicAuth({
    users: {
      [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
    },
    challenge: true,
  }),
  mobile
);
module.exports = router;
