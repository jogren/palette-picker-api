const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const cors = require('cors')

app.use(cors())
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
  const { name, project_id } = request.query;
  if (name) {
    const queriedPalette = await database('palettes').where('name', 'like', `%${name}%`).select();
    if (queriedPalette.length) {
      return response.status(200).json(queriedPalette)
    } else {
      return response.status(404).json({ error: 'That palette does not exist.' })
    }
  } else if (project_id) {
    const queriedPalette = await database('palettes').where('project_id', project_id).select();
    if (queriedPalette.length) {
      return response.status(200).json(queriedPalette)
    } else {
      return response.status(404).json({ error: 'That palette does not exist.' })
    }
  }
  return response.status(200).json(palettes);
});

app.get('/api/v1/palettes/:id', async (request, response) => {
  const palette = await database('palettes').where('id', request.params.id).select();

  if (palette.length) {
    return response.status(200).json(palette);
  } else {
    return response.status(404).json({ error: `Could not find id of ${request.params.id}.` })
  }
});

app.post('/api/v1/projects', async (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <string> }. You are missing a ${requiredParameter} property.` })
    } 
  }
  const alreadyExists = await database('projects').where('name', project.name).select()
  console.log(alreadyExists)
  if (alreadyExists.length) {
    return response.status(422).json({ error: `${project.name} already exists, please choose a new name.` })
  }

  const insertedProject = await database('projects').insert(project, 'id');

  if (!alreadyExists.length && insertedProject) {
    return response.status(201).json({ id: insertedProject[0] });
  } else {
    return response.status(422).json({ error: 'Failed to post project' })
  }
})

app.post('/api/v1/palettes', async (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'project_id', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string>, project_id: <integer> }. You are missing a ${requiredParameter} property.` })
    }
  }

  const insertedPalette = await database('palettes').insert(palette, 'id');

  if (insertedPalette) {
    return response.status(201).json({ id: insertedPalette[0] });
  } else {
    return response.status(422).json({ error: 'Failed to post palette' })
  }
})

app.patch('/api/v1/projects/:id', async (request, response) => {
  const projectChanges = request.body;
  const project = await database('projects').where('id', request.params.id).select();

  
  if (project.length) {
    await database('projects')
      .where('id', request.params.id)
      .update(projectChanges)
    return response.status(202).json({ id: request.params.id })
  } else {
    return response.status(400).json({ error: `Could not find project with id of ${request.params.id}` })
  }
});

app.patch('/api/v1/palettes/:id', async (request, response) => {
  const paletteChanges = request.body;
  const palette = await database('palettes').where('id', request.params.id).select();

  if (palette.length) {
    await database('palettes')
      .where('id', request.params.id)
      .update(paletteChanges)
    return response.status(202).json({ id: request.params.id })
  } else {
    return response.status(400).json({ error: `Could not find palette with id of ${request.params.id}` })
  }
});

app.delete('/api/v1/projects/:id', async (request, response) => {
  const project = await database('projects').where('id', request.params.id).select();
  
  if(project.length) {
    await database('palettes').where('project_id', request.params.id).del()
    await database('projects').where('id', request.params.id).del()
    
    response.status(200).json(`The project with id ${request.params.id} and all of its palettes have been removed.`)
  } else {
    return response.status(400).json({ error: `Could not find project with id of ${request.params.id}` })
  }
});

app.delete('/api/v1/palettes/:id', async (request, response) => {
  const palette = await database('palettes').where('id', request.params.id).select();

  if (palette.length) {
    await database('palettes').where('id', request.params.id).del()

    response.status(200).json(`The palette with id ${request.params.id} has been removed.`)
  } else {
    return response.status(400).json({ error: `Could not find palette with id of ${request.params.id}` })
  }
});

module.exports = app;