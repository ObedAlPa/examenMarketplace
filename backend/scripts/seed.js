const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'data.sql'), 'utf8')
const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgresql://postgres:postgres@localhost:5432/tenomerca_dev'

async function run() {
  const client = new Client({ connectionString: DATABASE_URL })
  try {
    await client.connect()
    console.log('Connected to', DATABASE_URL)
    await client.query(sql)
    console.log('Seeds applied')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
