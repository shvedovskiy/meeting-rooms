require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const pagesRoutes = require('./pages/routes');
const graphQLRoutes = require('./graphql/routes');


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pagesRoutes);
app.use('/graphql', graphQLRoutes);

const PORT = process.env.SERVER_PORT | 3090;
app.listen(PORT, () => {
  console.info(`Express app listening on localhost:${PORT}`);
});
