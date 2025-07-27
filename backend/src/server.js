const path = require('path');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models');
const { startAgenda } = require('./models/helpers/AgendaHelper');


app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
// Import and use the routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(
    '✅ App is running at http://localhost:%d in %s mode',
    process.env.PORT,
    process.env.NODE_ENV
  );
});

if (process.env.NODE_ENV !== 'production') {
  const apiDoc = require('./api-docs');
  app.use('/api-docs', apiDoc);
}

app.use(
  '/',
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

// Start Agenda for task scheduling
startAgenda();
