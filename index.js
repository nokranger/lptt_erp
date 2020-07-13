//import nodemodules
const http = require('http')
const express = require('express')
const app = express()
// const route = express.Router()
const bodyParser = require('body-parser')

// const connection = require('./api/models/connection')

//import route
const empRoute = require('./api/routes/employee')
const loginRoute = require('./api/routes/login')
const jobRoute = require('./api/routes/jobposition')
const transRoute = require('./api/routes/transportation')
const DtransRoute = require('./api/routes/detail_transportation')
const leaveAR = require('./api/routes/leave_activity_report')
const prettyRoute = require('./api/routes/detail_prettycash')

app.use((req, res, next) =>{
    // const error = new Error("Not found")
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

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

app.get('/test', (req, res) => {
    res.send('<h1>Hello world</h1>')
    console.log('cc join')
})
app.get('/www', (req, res) => {
    res.send('<h1>Hello world</h1>')
    console.log('cc joinหหหหหห')
})



//route
// app.use(app.router);
// routes.initialize(app);
app.use('/emp', empRoute)
app.use('/job', jobRoute)
app.use('/trans', transRoute)
app.use('/dtrans', DtransRoute)
app.use('/leavear', leaveAR)
app.use('/emp', loginRoute)
app.use('/cash', prettyRoute)


let ports = process.env.PORT || 4000

const server = app.listen(ports, (req, res, next) => {
    const host = server.address().address
    const port = server.address().port
    console.log('Server run port : ' + port)
})