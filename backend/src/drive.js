// Integración con la API de Google Drive v3 (googleapis) para subir imágenes
// de productos y compartirlas públicamente.
//
// POR QUÉ OAuth2 CON REFRESH TOKEN (y no una service account):
// Las cuentas de Google Workspace institucionales (como la de la UTD) bloquean
// service accounts de dominios externos. OAuth2 con la cuenta dueña solo
// requiere que el usuario genere el refresh token una vez y no necesita
// permisos de dominio.
//
// DÓNDE VAN LAS CREDENCIALES:
// Todas se leen de process.env (nunca hardcodeadas). Se definen en backend/.env
// (ver backend/.env.example) con las variables GOOGLE_CLIENT_ID,
// GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y GOOGLE_DRIVE_FOLDER_ID.
//
// CÓMO SE RENDERIZA DESPUÉS:
// uploadImage devuelve { fileId } y la ruta lo expone como drive://<fileId>.
// El frontend lo normaliza (backend/src/imageUrl.js) a la URL pública
// https://drive.google.com/uc?export=view&id=<fileId>, que se puede ver sin
// autenticación gracias al permiso "cualquier persona con el enlace puede ver"
// que se asigna en uploadImage.
const { google } = require('googleapis')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID

const isConfigured = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN && GOOGLE_DRIVE_FOLDER_ID)

const notConfiguredError = () =>
  new Error('Google Drive no configurado. Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y GOOGLE_DRIVE_FOLDER_ID en el .env (ver README).')

const drive = isConfigured
  ? (() => {
      const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
      auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
      return google.drive({ version: 'v3', auth })
    })()
  : null

async function uploadImage({ buffer, mimeType, filename }) {
  if (!isConfigured) throw notConfiguredError()

  // Archivo en la carpeta fija de Drive
  const fileResponse = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [GOOGLE_DRIVE_FOLDER_ID]
    },
    media: {
      mimeType,
      body: buffer
    },
    fields: 'id'
  })

  const fileId = fileResponse.data.id

  // Permiso público para que las imágenes se vean sin login
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  })

  return { fileId }
}

module.exports = {
  isConfigured,
  uploadImage
}
