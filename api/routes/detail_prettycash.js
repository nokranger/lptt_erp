const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

//getallemp
route.patch('/approve-prettycash', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'UPDATE detail_prettycash SET status = ? WHERE id = ?'
    var value = [req.body.status, req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      // console.log(result);
      console.log('done update')
      con.release()
    });
  });
  // console.log('done selected')
})

route.post('/get-month-prettycash', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT * FROM detail_prettycash WHERE date BETWEEN ? and ? '
    var value = [req.body.from, req.body.to]
    connection.query(sql, value, (err, result, fields) => {
      if (err) throw err;
      if (result.length > 0) {
        console.log(result);
        res.status(200).json({
          result: result
        })
      } else {
        res.status(404).json({
          message: 'NOT FOUND'
        })
      }
      con.release()
    });
  });
  console.log('done selected')
})

route.post('/post-prettycash', (req, res) => {
  connection.getConnection((err) => {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO detail_prettycash (id, date, amount, service_charge, detail, picture, employee_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    let values = ['', req.body.date, req.body.amount, req.body.service_charge, req.body.detail, req.body.picture, req.body.employee_id, req.body.status]
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}) 

module.exports = route