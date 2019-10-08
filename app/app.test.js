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
});