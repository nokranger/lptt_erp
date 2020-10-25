const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
var multer  = require('multer')
const { response } = require('express')
route.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: './public/uploads/leave/',
  filename: function(req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, 'LPTTLEAVE' + "-" + Date.now() + ext);
  }
})

const upload = multer({
  storage: storage
})

route.get('/get-all-la_report', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err;
      connection.query("SELECT * FROM leave_activity_report", (err, result, fields) => {
        if (err) throw err;
        // console.log(result);
        res.json({
          result: result,
        })
        con.release()
      });
    });
    console.log('done selected')
  })

  route.get('/get-last-record', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err;
      connection.query('SELECT lptt_employee.employee_name, reason_for_leave, leave_category, status FROM leave_activity_report INNER JOIN lptt_employee ORDER BY leave_activity_report_id DESC LIMIT 1', (err, result, fields) => {
        if (err) {
          res.status(404).json({
            err: err
          })
        }
        if (result.length > 0) {
          res.status(200).json({
            result: result
          })
        } else {
          res.status(404).json({
            message: 'NOT FOUND'
          })
        }
        con.release()
      })
    })
  })
  route.patch('/approve-leave-report', (req, res) => {
    console.log('llll', [req.body.status, req.body.id, req.body.approve_id])
    connection.getConnection((err, con) => {
      if (err) throw err;
      var sql = 'UPDATE leave_activity_report SET status = ?, approve_id = ? WHERE leave_activity_report_id = ?'
      var sql2 = 'SELECT * FROM leave_activity_report'
      var value = [req.body.status, req.body.approve_id, req.body.id]
      connection.query(sql, value, (err, result, fields) => {
        connection.query(sql2, (err, result, fields) => {
          console.log('query2')
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
          } else {
            res.status(404).json({
              message: 'NOT FOUND'
            })
          }
        })
        if (err) {
          res.status(404).json({
            err: err
          })
        }
        // console.log('bbbbbbb', typeof(result));
        console.log('update leave done')
        con.release()
      })
    })
  })
  route.post('/post-la_report', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err;
      console.log('connected')
      var sql = "INSERT INTO leave_activity_report (leave_activity_report_id, employee_id, start_time, end_time, reason_for_leave, leave_category, approve_id, approve_date, status, file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      let values = ['', req.body.employee_id, req.body.start_time, req.body.end_time, req.body.reason_for_leave, req.body.leave_category, req.body.approve_id, req.body.approve_date, req.body.status, req.body.file]
      connection.query(sql, values, (err, result) => {
        if (err) {
          res.status(404).json({
            err: err
          })
        }
        // if (result.length > 0) {
        //   response.status(202).json({
        //     message: 'success'
        //   })
        // } else {
        //   res.status(404).json({
        //     message: 'NOT FOUND'
        //   })
        // }
        console.log('leave inserted')
        con.release()
      })
    })
  })
  route.post('/upload', upload.single('file'), (req, res) => {
    let data = JSON.parse(req.body.data)
    // console.log(JSON.parse(req.body.data.cc))
    console.log(data.cc)
    res.json({ cool: req.file.path})   
  })
module.exports = route