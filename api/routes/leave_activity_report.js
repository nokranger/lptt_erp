const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.get('/get-all-la_report', (req, res) => {
    connection.getConnection((err) => {
      if (err) throw err;
      connection.query("SELECT * FROM leave_activity_report", (err, result, fields) => {
        if (err) throw err;
        // console.log(result);
        res.json({
          result: result
        })
      });
    });
    console.log('done selected')
  })
  route.post('/post-la_report', (req, res) => {
    connection.getConnection((err) => {
      if (err) throw err;
      console.log('connected')
      var sql = "INSERT INTO leave_activity_report (employee_id, leave_activity_report_id, start_time, end_time, reason_for_leave, leave_category, approve_id, approve_date, status, file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      let values = ['LPTT009', 'LAR001', req.body.start_time, req.body.end_time, req.body.reason_for_leave, req.body.leave_category, 'LPTT009', '2019-08-07', 'status', '/doc/nok.docs']
      connection.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log('1 record inserted')
      })
    })
  })
module.exports = route