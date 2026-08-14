require('dotenv').config({ quiet: true })
const app = require('./app')

const PORT = Number(process.env.PORT || 4000)

app.listen(PORT, () => {
  console.log(`AutoPartes API running on http://localhost:${PORT}`)
})
