const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
var multer  = require('multer')
const { response } = require('express')
route.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: '../../../../../VueJS/LPTT/frontend_erp/src/img/uploads/plan/',
  filename: function(req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    )
    cb(null, 'LPTTPLAN' + "-" + Date.now() + '.png')
  }
})

const upload = multer({
  storage: storage
})


route.post('/createplan', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'INSERT INTO plan (plan_id, employee_id, title, detail, priority, permission, member, reg_date, up_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, '', '']
      connection.query(sql, value,  (err, result, fields) => {
        if (err) throw err
        // console.log(result);
        res.json({
          result: result,
        })
        con.release()
      })
    })
    console.log('plan create')
})

route.get('/get-emp-plan', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT employee_id, employee_name FROM `lptt_employee`'
    // var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, '', '']
    connection.query(sql, (err, result, fields) => {
      console.log(result)
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.length > 0) {
        res.status(200).json({
          result: result
        })
      }
      console.log('plan get employee')
      con.release()
    })
  })
})

route.get('/showcontent', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT * FROM plan'
    // var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, '', '']
    connection.query(sql, (err, result, fields) => {
      console.log(result)
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.length > 0) {
        console.log('test plan')
        res.status(200).json({
          result: result
        })
      }
      console.log('plan get content')
      con.release()
    })
  })
})
module.exports = route