
exports.up = function(knex) {
  return knex.schema.table('palettes', function(table) {
    table.string('color1');
    table.string('color2');
    table.string('color3');
    table.string('color4');
    table.string('color5');
  })
};

exports.down = function(knex) {
  return knex.schema.table('palettes', function(table) {
    table.dropColumn('color1');
    table.dropColumn('color2');
    table.dropColumn('color3');
    table.dropColumn('color4');
    table.dropColumn('color5');
  })
};
