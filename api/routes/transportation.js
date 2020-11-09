const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.get('/get-all-trans', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      connection.query("SELECT * FROM transportation", (err, result, fields) => {
        if (err) throw err
        // console.log(result);
        res.json({
          result: result
        })
        con.release()
      })
    })
    console.log('done selected')
  })

  route.post('/get-all-trans-user', (req, res) => {
    console.log('user', [req.body.id])
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'SELECT * FROM transportation WHERE employee_id = ?'
      var value = [req.body.id]
      connection.query(sql, value, (err, result, fields) => {
        if (err) throw err
        // console.log(result);
        res.json({
          result: result
        })
        con.release()
      })
    })
    console.log('done selected')
  }) 

route.get('/get-last-trans', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    connection.query("SELECT lptt_employee.employee_name, trans_from, trans_to, trans_vehicle, trans_status FROM transportation INNER JOIN lptt_employee on lptt_employee.employee_id = transportation.employee_id ORDER BY transportation.trans_id DESC LIMIT 1", (err, result, fields) => {
      if (err) {
        res.status(400).json({
          err: err
        })
      }
      if (result) {
        res.status(200).json({
          result: result
        })
      }  else {
        res.status(404).json({
          message: 'NOT FOUND'
        })
      }
      con.release()
    })
  })
  console.log('done selected')
})  
route.post('/post-trans', (req, res) => {
  console.log('trans', ['', req.body.trans_date, req.body.employee_id, req.body.trans_from, req.body.trans_to, req.body.trans_vehicle, req.body.trans_values, req.body.approve_id, req.body.status])
  connection.getConnection((err, con) => {
    if (err) throw err
    console.log('connected')
    var sql = "INSERT INTO transportation (trans_id, date, employee_id, trans_from, trans_to, trans_vehicle, trans_values, approve_id, trans_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    var sql2 = 'SELECT * FROM transportation'
    let values = ['', req.body.trans_date, req.body.employee_id, req.body.trans_from, req.body.trans_to, req.body.trans_vehicle, req.body.trans_values, req.body.approve_id, req.body.status]
    connection.query(sql, values, (err, result) => {
      connection.query(sql2, (err, result, fields) => {
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
      })
      console.log('trans inserted')
      con.release()
    })
  })
})

route.patch('/approve-transportation', (req, res) => {
  connection.getConnection((err, con) => {
    // console.log(req.body.trans_status, req.body.approve_id, req.body.trans_id)
    if (err) throw err
    var sql = 'UPDATE transportation SET trans_status = ?, approve_id = ? WHERE trans_id = ?'
    var sql2 = 'SELECT * FROM transportation'
    var value = [req.body.trans_status, req.body.approve_id, req.body.trans_id]
    connection.query(sql, value, (err, result, fields) => {
      connection.query(sql2, (err, result, fields) => {
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
        console.log('approve trans done')
        con.release()
      })
    })
  })
})

route.patch('/reject-transportation', (req, res) => {
  connection.getConnection((err, con) => {
    // console.log(req.body.trans_status, req.body.approve_id, req.body.trans_id)
    if (err) throw err
    var sql = 'UPDATE transportation SET trans_status = ?, approve_id = ? WHERE trans_id = ?'
    var sql2 = 'SELECT * FROM transportation'
    var value = [req.body.trans_status, req.body.approve_id, req.body.trans_id]
    connection.query(sql, value, (err, result, fields) => {
      connection.query(sql2, (err, result, fields) => {
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
        console.log('reject trans done')
        con.release()
      })
    })
  })
})

route.get('/getstation', (req, res) => {
  // console.log('test', req.body.test)
  connection.getConnection((err, con) => {
    // console.log('test', req.body.test)
    if (err) throw err
    var sql = "SELECT trans_to = 'benz' _trans_to_benz, trans_to = 'lptt' _trans_to_lptt, trans_to = 'toyota' _trans_to_toyota FROM transportation"
    // var value = [req.boy.test]
    connection.query(sql, (err, result, fields) => {
      console.log('res', result)
      if (err) throw err
      if (result.length > 0) {
        res.status(200).json({
          result: result
        })
      }
      con.release()
    })
  })
  console.log('done selected')
})  

module.exports = route