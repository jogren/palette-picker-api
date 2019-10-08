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

app.get('/api/v1/projects/:id', async (request, response) => {
  const project = await database('projects').where('id', request.params.id).select();

  if(project.length) {
    return response.status(200).json(project);
  } else {
    return response.status(404).json({error: `Could not find id of ${request.params.id}.`})
  }
});

app.get('/api/v1/palettes', async (request, response) => {
  const palettes = await database('palettes').select();

  return response.status(200).json(palettes);
});

app.get('/api/v1/palettes/:id', async (request, response) => {
  const palette = await database('palettes').where('id', request.params.id).select();

  if (palette.length) {
    return response.status(200).json(palette);
  } 
});

module.exports = app;