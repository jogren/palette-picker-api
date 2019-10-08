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

app.get('/api/v1/projects', async (request, response) => {
  const projects = await database('projects').select();

  return response.status(200).json(projects);
});

app.get('/api/v1/palettes', async (request, response) => {
  const palettes = await database('palettes').select();

  return response.status(200).json(palettes);
});

module.exports = app;