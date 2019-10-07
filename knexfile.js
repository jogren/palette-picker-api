module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettePicker',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
