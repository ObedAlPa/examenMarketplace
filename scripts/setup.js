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
  if (!backendValues.PORT) {
    fs.appendFileSync(backendEnv, '\nPORT=4000\n')
  }
  if (!backendValues.DATABASE_URL) {
    fs.appendFileSync(backendEnv, '\n# Leave DATABASE_URL blank if you want the app to run in memory mode without PostgreSQL\n')
  }
  if (!backendValues.CORS_ORIGINS) {
    fs.appendFileSync(backendEnv, '\nCORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://192.168.101.15:5173,http://192.168.101.15:5174,http://192.168.101.15:5175\n')
  }

  const frontendValues = readEnvFile(frontendEnv)
  if (!frontendValues.VITE_API_URL) {
    fs.appendFileSync(frontendEnv, `\nVITE_API_URL=http://localhost:4000\n`)
  }
}

const runCommand = (args, extraEnv = {}) => {
  const isWindows = process.platform === 'win32'
  const cmd = isWindows ? 'cmd.exe' : 'npm'
  const commandArgs = isWindows ? ['/d', '/s', '/c', 'npm', ...args] : args

  return spawnSync(cmd, commandArgs, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv }
  })
}

const runMigrations = (dbUrl) => {
  const result = runCommand(['--prefix', 'backend', 'run', 'migrate'], {
    DATABASE_URL: dbUrl,
    PG_CONNECTION: dbUrl,
  })
  if (result.status !== 0) {
    console.warn('Migration failed. Check that PostgreSQL is running and DATABASE_URL is valid.')
  }
}

const runSeeds = (dbUrl) => {
  const result = runCommand(['--prefix', 'backend', 'run', 'seed'], {
    DATABASE_URL: dbUrl,
    PG_CONNECTION: dbUrl,
  })
  if (result.status !== 0) {
    console.warn('Seed failed. Check that PostgreSQL is running and the database has been created.')
  }
}

const parseDbName = (dbUrl) => {
  try {
    const url = new URL(dbUrl)
    const dbName = decodeURIComponent(url.pathname.replace(/^\/+/, ''))
    return dbName || 'postgres'
  } catch (error) {
    return 'postgres'
  }
}

const ensureDatabaseExists = async (dbUrl, pgModule) => {
  const { Client } = pgModule
  const targetDb = parseDbName(dbUrl)
  const fallbackUrl = new URL(dbUrl)
  fallbackUrl.pathname = '/postgres'

  const adminClient = new Client({ connectionString: fallbackUrl.toString() })
  try {
    await adminClient.connect()
    const result = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb])
    if (result.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${targetDb}"`)
      console.log(`Database "${targetDb}" was created because it did not exist.`)
    } else {
      console.log(`Database "${targetDb}" already exists.`)
    }
  } catch (error) {
    console.warn('Could not create database automatically. Check that PostgreSQL is running and your credentials are valid.')
    if (error && error.message) console.warn('Details:', error.message)
  } finally {
    await adminClient.end().catch(() => {})
  }
}

const tryConnectToDatabase = () => {
  const backendEnv = readEnvFile(path.join(backendDir, '.env'))
  const dbUrl = backendEnv.DATABASE_URL && String(backendEnv.DATABASE_URL).trim()

  if (!dbUrl) {
    console.log('No PostgreSQL URL configured. The app will run in memory mode until you add DATABASE_URL in backend/.env.')
    return
  }

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
      runMigrations(dbUrl)
      runSeeds(dbUrl)
    })
    .catch(async (error) => {
      const message = (error && error.message) ? String(error.message).toLowerCase() : ''
      const isMissingDatabase = message.includes('does not exist') || (error && error.code === '3D000')

      if (isMissingDatabase) {
        console.warn(`Database "${parseDbName(dbUrl)}" was not found. Creating it automatically...`)
        await ensureDatabaseExists(dbUrl, pgModule)
        const retry = new Client({ connectionString: dbUrl })
        try {
          await retry.connect()
          console.log('PostgreSQL connection OK after database creation')
          await retry.end()
          runMigrations(dbUrl)
          runSeeds(dbUrl)
        } catch (retryError) {
          console.warn('PostgreSQL is still unavailable after creation; please check permissions and credentials.')
          if (retryError && retryError.message) console.warn('Details:', retryError.message)
        }
        return
      }

      console.warn('PostgreSQL is not available or the URL is invalid. The app can still run in memory mode.')
      console.warn('To enable PostgreSQL, update backend/.env and run:')
      console.warn('  npm run migrate')
      console.warn('  npm run seed')
      console.warn('Current DATABASE_URL:', dbUrl)
      if (error && error.message) {
        console.warn('Details:', error.message)
      }
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
