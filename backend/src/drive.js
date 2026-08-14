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
// ESTRUCTURA DE CARPETAS EN DRIVE:
// Google Drive (al05-050-0322@utdelacosta.edu.mx)
// └── Marketplace-Mexico (GOOGLE_DRIVE_FOLDER_ID)
//     ├── electronica/
//     ├── computacion/
//     ├── hogar/
//     ├── ropa/
//     ├── deportes/
//     ├── libros/
//     └── general/
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

// Mapeo de categoría (slug) a nombre de carpeta en Drive
const CATEGORY_FOLDER_MAP = {
  electronica: 'electronica',
  computacion: 'computacion',
  hogar: 'hogar',
  ropa: 'ropa',
  deportes: 'deportes',
  libros: 'libros',
  general: 'general'
}

// Cache de folder IDs para evitar llamadas repetidas
const folderCache = new Map()

async function getOrCreateCategoryFolder(categorySlug) {
  const folderName = CATEGORY_FOLDER_MAP[categorySlug] || 'general'
  if (folderCache.has(folderName)) return folderCache.get(folderName)

  // Buscar si ya existe la carpeta dentro de la raíz
  const searchResponse = await drive.files.list({
    q: `name='${folderName}' and '${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  let folderId
  if (searchResponse.data.files.length > 0) {
    folderId = searchResponse.data.files[0].id
  } else {
    // Crear la carpeta
    const createResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [GOOGLE_DRIVE_FOLDER_ID]
      },
      fields: 'id'
    })
    folderId = createResponse.data.id
  }

  folderCache.set(folderName, folderId)
  return folderId
}

async function uploadImage({ buffer, mimeType, filename, categorySlug }) {
  if (!isConfigured) throw notConfiguredError()

  // Determinar carpeta destino por categoría
  const parentFolderId = await getOrCreateCategoryFolder(categorySlug || 'general')

  // Archivo en la carpeta de la categoría
  const fileResponse = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [parentFolderId]
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