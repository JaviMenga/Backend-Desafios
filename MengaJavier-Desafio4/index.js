// Express
const express = require('express')
const app = express()
    // const { Router } = express
    // const router = Router()

// Codigo para que la app use los router
// app.use('/holi', router)

// Server
const server = app.listen(8080, () => { console.log('Server is running on port 8080') })
server.on('error', (err) => { console.log(err) })

// Rutas
app.get('/', (req, res) => {
        res.send('Hola')
    })
    // router.get('/', (req, res) => {
    //     res.send('Holi2')
    // })