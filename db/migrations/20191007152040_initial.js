exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('project_id').unsigned();
      table.foreign('project_id').references('projects.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  
};
