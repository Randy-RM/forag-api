require('dotenv').config({ path: '../../.env' });

const dataBaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DATABASE || 'forag',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = {
  development: dataBaseConfig,
  test: dataBaseConfig,
  production: dataBaseConfig,
};
