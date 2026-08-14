const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgresql://postgres:postgres@localhost:5432/tenomerca_dev'

const pool = new Pool({ connectionString })

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
}
