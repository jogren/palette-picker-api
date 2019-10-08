
exports.seed = (knex) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises)
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
