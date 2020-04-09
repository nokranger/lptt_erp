const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.get('/get-all-trans', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err;
      connection.query("SELECT * FROM transportation", (err, result, fields) => {
        if (err) throw err;
        // console.log(result);
        res.json({
          result: result
        })
        con.release()
      });
    });
    console.log('done selected')
  })

route.get('/get-last-trans', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    connection.query("SELECT * FROM transportation ORDER BY trans_id LIMIT 1", (err, result, fields) => {
      if (err) throw err;
      res.json({
        result: result
      })
      con.release()
    })
  })
  console.log('done selected')
})  
route.post('/post-trans', (req, res) => {
  connection.getConnection((err) => {
    if (err) throw err;
    console.log('connected')
    var sql = "INSERT INTO transportation (trans_id, employee_id, trans_date, trans_form, trans_to, trans_vehicle, trans_values, approve_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    let values = [req.body.trans_id, 'LPTT009', req.body.trans_date, req.body.trans_form, req.body.trans_to, req.body.trans_vehicle, req.body.trans_values, 'LPTT009']
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log('1 record inserted')
    })
  })
})

module.exports = route