// Update with your config settings.

const config = {
  type: 'mysql',
  db: {
    type: 'mysql',
		host: '127.0.0.1',
		port: '3306',
    user: 'root',
    password: '',
    database: 'iot_db_init',
    charset: 'utf8',
    multipleStatements: true
  },
}

const seeds = {
  directory: './seeds'
}

const migrations = {
  directory: './migrations',
  stub: './js.stub',
  tableName: 'db_migrations'
}

const cfg = {
	client: config.db.type,
	connection: config.db,
	seeds: seeds,
	migrations: migrations
}

module.exports = {
  development: cfg,
  production: cfg
}
