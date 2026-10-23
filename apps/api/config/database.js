const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  // Ensure database path is always anchored to apps/api root, whether running from src or dist
  const isDist = __dirname.includes('dist');
  const appRoot = isDist ? path.resolve(__dirname, '..', '..') : path.resolve(__dirname, '..');
  const dbFilename = env('DATABASE_FILENAME', '.tmp/data.db');
  const sqliteFilename = path.isAbsolute(dbFilename) ? dbFilename : path.resolve(appRoot, dbFilename);

  const connections = {
    postgres: {
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'community_lerevenu'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', 'postgres'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
    sqlite: {
      connection: {
        filename: sqliteFilename,
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
