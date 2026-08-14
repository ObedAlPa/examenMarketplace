const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const backendDir = path.join(root, 'backend')
const frontendDir = path.join(root, 'frontend')

const ensureFileFromExample = (examplePath, targetPath) => {
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(examplePath, targetPath)
    console.log(`Created ${path.relative(root, targetPath)}`)
  }
}

const readEnvFile = (filePath) => {
  const entries = {}
  if (!fs.existsSync(filePath)) return entries
  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue
    const key = trimmed.substring(0, index).trim()
    const value = trimmed.substring(index + 1).trim()
    entries[key] = value
  }
  return entries
}

const ensureEnvFiles = () => {
  ensureFileFromExample(path.join(backendDir, '.env.example'), path.join(backendDir, '.env'))
  ensureFileFromExample(path.join(frontendDir, '.env.example'), path.join(frontendDir, '.env.local'))

  const backendEnv = path.join(backendDir, '.env')
  const frontendEnv = path.join(frontendDir, '.env.local')

  const backendValues = readEnvFile(backendEnv)
  if (!backendValues.DATABASE_URL) {
    const defaultValue = 'postgres://postgres:postgres@localhost:5432/marketplace_dev'
    fs.appendFileSync(backendEnv, `\nDATABASE_URL=${defaultValue}\n`)
  }

  const frontendValues = readEnvFile(frontendEnv)
  if (!frontendValues.VITE_API_URL) {
    fs.appendFileSync(frontendEnv, `\nVITE_API_URL=http://localhost:4000\n`)
  }
}

const runCommand = (args) => {
  const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  return spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false
  })
}

const runMigrations = () => {
  const result = runCommand(['--prefix', 'backend', 'run', 'migrate'])
  if (result.status !== 0) {
    console.warn('Migration failed. Check that PostgreSQL is running and DATABASE_URL is valid.')
  }
}

const runSeeds = () => {
  const result = runCommand(['--prefix', 'backend', 'run', 'seed'])
  if (result.status !== 0) {
    console.warn('Seed failed. Check that PostgreSQL is running and the database has been created.')
  }
}

const tryConnectToDatabase = () => {
  const backendEnv = readEnvFile(path.join(backendDir, '.env'))
  const dbUrl = backendEnv.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/marketplace_dev'

  let pgModule = null
  try {
    pgModule = require(path.join(backendDir, 'node_modules', 'pg'))
  } catch (error) {
    try {
      pgModule = require('pg')
    } catch (err) {
      console.warn('Could not import pg. Please run npm install first.')
      return
    }
  }

  const { Client } = pgModule
  const client = new Client({ connectionString: dbUrl })

  client.connect()
    .then(async () => {
      console.log('PostgreSQL connection OK')
      await client.end()
      runMigrations()
      runSeeds()
    })
    .catch((error) => {
      console.warn('PostgreSQL is not available yet. Start your local PostgreSQL instance and run:')
      console.warn('  npm run migrate')
      console.warn('  npm run seed')
      console.warn('Error:', error.message)
    })
}

const main = () => {
  ensureEnvFiles()
  console.log('Dependencies are installed with npm workspaces.')
  console.log('Using backend/.env and frontend/.env.local.')
  tryConnectToDatabase()
  console.log('Setup complete. To start the app:')
  console.log('  npm run dev')
}

main()
