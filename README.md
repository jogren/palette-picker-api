# palette-picker-api

[![Build Status](https://travis-ci.org/jogren/palette-picker-api.svg?branch=master)](https://travis-ci.org/jogren/palette-picker-api)

The palette picker api was built to store different projects with a one-to-many relationship. For each project the user can store a palette under each. Each palette includes a unique name with 5 colors saved as strings. The API is deployed at: https://palette-picker-api-sfjo.herokuapp.com.

## Technology

- Node.js
- SQL
- Express
- Knex
- PostgreSQL

## Learning Goals

- Solidify RESTful API design skills
- Server-side testing
- Further understanding of complete CRUD endpoints
- Connecting BE & FE
- Work with multiple environments:
  - testing
  - use of automatic continuous integration with TravisCI
  - deployment with Heroku

## Schema

![image](https://user-images.githubusercontent.com/45364533/66959159-07fe2e00-f027-11e9-949d-917cbc79a5cd.png)

## API - Endpoints

URL: https://palette-picker-api-sfjo.herokuapp.com

| Purpose                   |          URL           |  Verb  | Request Body                                                                                                                                        | Sample Success Response                                                                                                                                                                                                                 |
| ------------------------- | :--------------------: | :----: | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Get all of the projects   |  `/api/v1/projects/`   |  GET   | none                                                                                                                                                | `{projects: [array of projects]}`                                                                                                                                                                                                       |
| Get a specific project    | `/api/v1/projects/:id` |  GET   | none                                                                                                                                                | `{"id": 8,"name": "Winter","created_at": "2019-10-09T22:26:01.901Z","updated_at": "2019-10-09T22:26:01.901Z"}`                                                                                                                          |
| Get all of the palettes   |  `/api/v1/palettes/`   |  GET   | none                                                                                                                                                | `{palettes: [array of palettes]}`                                                                                                                                                                                                       |
| Get a specific palette    | `/api/v1/palettes/:id` |  GET   | none                                                                                                                                                | `{"id": 13,"name": "First Snow","project_id": 8,"created_at": "2019-10-11T22:43:56.193Z","updated_at": "2019-10-11T22:43:56.193Z","color1": "#FFFFFF","color2": "#FFFFFF","color3": "#FFFFFF","color4": "#FFFFFF","color5": "#FFFFFF"}` |
| Add a new project         |  `/api/v1/projects/`   |  POST  | `{"name": <String>}`                                                                                                                                | `{"id": <Integer>}`                                                                                                                                                                                                                     |
| Add a new palette         |  `/api/v1/palettes/`   |  POST  | `{ "name": <string>, "color1": <string>, "color2": <string>, "color3": <string>, "color4": <string>, "color5": <string>, "project_id": <integer> }` | `{"id": <Integer>}`                                                                                                                                                                                                                     |
| Edit a specific project   | `/api/v1/projects/:id` | PATCH  | none                                                                                                                                                | `{"id": <Integer>}`                                                                                                                                                                                                                     |
| Edit a specific palette   | `/api/v1/palettes/:id` | PATCH  | none                                                                                                                                                | `{"id": <Integer>}`                                                                                                                                                                                                                     |
| Delete a specific project | `/api/v1/projects/:id` | DELETE | none                                                                                                                                                | `The project with id <Integer> and all of its palettes have been removed.`                                                                                                                                                              |
| Delete a specific palette | `/api/v1/palettes/:id` | DELETE | none                                                                                                                                                | `The palette with id <Integer> has been removed.`                                                                                                                                                                                       |

## Query Params

| Purpose                                         |                   URL                   | Sample Success Response                                               |
| ----------------------------------------------- | :-------------------------------------: | --------------------------------------------------------------------- |
| Get all palettes that include the searched name |    `/api/v1/palettes?name=<String>`     | `{palettes: [array of palettes that include <String> in their name]}` |
| Get all palettes for a specific project_id      | `/api/v1/palettes?project_id=<Integer>` | `{palettes: [array of palettes with project_id:<Integer>]}`           |
