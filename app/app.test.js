const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {

  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return a 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select();

      const res = await request(app).get('/api/v1/projects');

      const response = JSON.stringify(res.body)
      const projects = JSON.stringify(expectedProjects)

      expect(res.status).toBe(200);
      expect(response).toEqual(projects)
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a 200 and a specific project', async () => {
      const expectedProject = await database('projects').first();
      const id = expectedProject.id;

      const res = await request(app).get(`/api/v1/projects/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedProject));
    });

    it('should return a 404 and an error message', async () => {
      const wrongId = -1;

      const res = await request(app).get(`/api/v1/projects/${wrongId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual("Could not find id of -1.");
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return a 200 and all of the palettes', async () => {
      const expectedPalettes = await database('palettes').select();

      const res = await request(app).get('/api/v1/palettes');

      const response = JSON.stringify(res.body)
      const palettes = JSON.stringify(expectedPalettes)

      expect(res.status).toBe(200);
      expect(response).toEqual(palettes)
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a 200 and a specific project', async () => {
      const expectedProject = await database('palettes').first();
      const id = expectedProject.id;

      const res = await request(app).get(`/api/v1/palettes/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedProject));
    });

    it('should return a 404 and an error message', async () => {
      const wrongId = -1;

      const res = await request(app).get(`/api/v1/palettes/${wrongId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual("Could not find id of -1.");
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should return a 200 and add a new project to the table', async () => {
      const newProject = { name: 'Winter Palettes' };

      const res = await request(app).post('/api/v1/projects').send(newProject);

      const projects = await database('projects').where('id', res.body.id).select();
      const project = projects[0];

      expect(res.status).toBe(201);
      expect(project.name).toEqual(newProject.name)
    });

    it('should return a 422 and a message when missing parameter', async () => {
      const newProject = {};

      const res = await request(app).post('/api/v1/projects').send(newProject);

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual('Expected format: { name: <string> }. You are missing a name property.')
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should return a 200 and add a new palette to the table', async () => {
      const newPalette = { 
        name: 'Christmas Theme', 
        color1: '#FFFFFF', 
        color2: '#FFFFFF',
        color3: '#FFFFFF',
        color4: '#FFFFFF',
        color5: '#FFFFFF'
      };

      const res = await request(app).post('/api/v1/palettes').send(newPalette);

      const palettes = await database('palettes').where('id', res.body.id).select();
      const palette = palettes[0];

      expect(res.status).toBe(201);
      expect(palette.name).toEqual(newPalette.name)
    });

    it('should return a 422 and a message when missing parameter', async () => {
      const newPalette = {
        name: 'Christmas Theme',
        color1: '#FFFFFF',
        color3: '#FFFFFF',
        color4: '#FFFFFF',
        color5: '#FFFFFF'
      };
      const res = await request(app).post('/api/v1/palettes').send(newPalette);

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual('Expected format: { name: <string>, color1, <string>, color2, <string>, color3, <string>, color4, <string>, color5, <string>, }. You are missing a color2 property.')
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should return a 204 and updated the project', async () => {
      const updatedInfo = {
        name: 'Summer'
      }

      const targetProject = await database('projects').first();
      const mockId = targetProject.id;
      
      const res = await request(app).patch(`/api/v1/projects/${mockId}`).send(updatedInfo);
      const expectedProject = await database('projects').where('id', mockId);

      expect(res.status).toBe(202);
      expect(expectedProject[0].name).toEqual(updatedInfo.name)
    });

    it('should return a 400 and an error message', async () => {
      const updatedInfo = {
        name: 'Summer'
      };
      const invalidId = -1;

      const res = await request(app).patch(`/api/v1/projects/${invalidId}`).send(updatedInfo);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual('Could not find project with id of -1')
    });
  });

  describe('PATCH /api/v1/palettes/:id', () => {
    it('should return a 204 and updated the palette', async () => {
      const updatedInfo = {
        name: 'Fourth of July',
        color2: '#1261A0',
        color3: '#FF6347' 
      }

      const targetPalette = await database('palettes').first();
      const mockId = targetPalette.id;

      const res = await request(app).patch(`/api/v1/palettes/${mockId}`).send(updatedInfo);
      const expectedPalette = await database('palettes').where('id', mockId);

      expect(res.status).toBe(202);
      expect(expectedPalette[0].name).toEqual(updatedInfo.name)
    });

    it('should return a 400 and an error message', async () => {
      const updatedInfo = {
        name: 'Fourth of July',
        color2: '#1261A0',
        color3: '#FF6347'
      }

      const invalidId = -1;

      const res = await request(app).patch(`/api/v1/projects/${invalidId}`).send(updatedInfo);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual('Could not find project with id of -1')
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return a 200 and a message', async () => {
      const targetProject = await database('projects').first();
      const mockId = targetProject.id;

      const res = await request(app).delete(`/api/v1/projects/${mockId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(`The project with id ${mockId} and all of its palettes have been removed.`)
    });

    it('should return a 400 and an error message', async () => {
      const invalidId = -1;

      const res = await request(app).delete(`/api/v1/projects/${invalidId}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual('Could not find project with id of -1')
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return a 200 and a message', async () => {
      const targetPalette = await database('palettes').first();
      const mockId = targetPalette.id;

      const res = await request(app).delete(`/api/v1/palettes/${mockId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(`The palette with id ${mockId} has been removed.`)
    });

    it('should return a 400 and an error message', async () => {
      const invalidId = -1;

      const res = await request(app).delete(`/api/v1/palettes/${invalidId}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual('Could not find palette with id of -1')
    });
  });
});