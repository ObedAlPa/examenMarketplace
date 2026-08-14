#!/usr/bin/env node
// Script para obtener un refresh token de Google OAuth2 para Google Drive API
// Uso: node scripts/get-refresh-token.js
// Requiere: GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en backend/.env o pasados por args

const { google } = require('googleapis')
const readline = require('readline')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const SCOPES = ['https://www.googleapis.com/auth/drive.file']

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) => new Promise((res) => rl.question(q, res))

  let clientId = process.env.GOOGLE_CLIENT_ID
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.log('\n📋 No hay GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET en backend/.env')
    clientId = await question('Ingresa tu GOOGLE_CLIENT_ID: ')
    clientSecret = await question('Ingresa tu GOOGLE_CLIENT_SECRET: ')
  }

  if (!clientId || !clientSecret) {
    console.error('❌ Se requieren Client ID y Client Secret')
    process.exit(1)
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost')

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Fuerza consentimiento para obtener refresh_token siempre
  })

  console.log('\n🔗 Abre esta URL en tu navegador:')
  console.log(authUrl)
  console.log('\n👉 Inicia sesión con la cuenta de Google que quieres usar para subir imágenes')
  console.log('👉 Autoriza la aplicación (puede salir "Google no ha verificado esta app" → Avanzado → Ir a... (no seguro))')

  const code = await question('\n📥 Pega aquí el código de autorización que te devuelve Google: ')

  try {
    const { tokens } = await oauth2Client.getToken(code.trim())
    console.log('\n✅ ¡Tokens obtenidos!')
    console.log('────────────────────────────────────────')
    console.log('Access Token:', tokens.access_token)
    console.log('Refresh Token:', tokens.refresh_token)
    console.log('Expiry Date:', tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'N/A')
    console.log('────────────────────────────────────────')
    console.log('\n📝 Copia el REFRESH TOKEN y ponlo en backend/.env:')
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
    console.log('\n⚠️  El refresh token NO expira. Guárdalo seguro, no lo subas a Git público.')
  } catch (err) {
    console.error('\n❌ Error intercambiando código:', err.message)
    if (err.message.includes('invalid_grant')) {
      console.log('   Posible causa: el código ya se usó o expiró. Vuelve a generar la URL y autoriza de nuevo.')
    }
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()