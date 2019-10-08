const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());

app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.get('/api/v1/projects', (request, response) => {
  console.log('return all projects')
});

module.exports = app;