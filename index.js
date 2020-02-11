const http = require('http')
const express = require('express')
const app = express()


app.use((req,res,next) =>{
    // const error = new Error("Not found")
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use((err, req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(400)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        err: {
            message: err.message
        }
    })
})

const server = app.listen(8081, (req, res, next) => {
    const host = server.address().address
    const port = server.address().port
    console.log('Server run port : ' + port)
})