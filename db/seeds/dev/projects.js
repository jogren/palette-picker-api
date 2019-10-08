const projectData = require('../../../projectData');

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
    .then(projectId => {
      let palettePromises = [];

      project.palettes.forEach(palette => {
        palettePromises.push(
          createPalette(knex, {
            name: palette.name,
            color1: palette.color1,
            color2: palette.color2,
            color3: palette.color3,
            color4: palette.color4,
            color5: palette.color5,
            project_id: projectId[0]
          })
        )
      });

      return Promise.all(palettePromises);
    })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = (knex) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
