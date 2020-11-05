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
route.post('/get-all-la_report-user', (req, res) => {
  console.log('emid', [req.body.id])
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT * FROM leave_activity_report WHERE employee_id = ?'
    var value = [req.body.id]
    connection.query(sql, value, (err, result, fields) => {
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
      connection.query('SELECT lptt_employee.employee_name, reason_for_leave, leave_category, status FROM leave_activity_report INNER JOIN lptt_employee on lptt_employee.employee_id = leave_activity_report.employee_id ORDER BY leave_activity_report.leave_activity_report_id DESC LIMIT 1', (err, result, fields) => {
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
  route.patch('/reject-leave-report', (req, res) => {
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

  route.patch('/approve-leave-report', (req, res) => {
    console.log('llll', [req.body.status, req.body.id, req.body.approve_id])
    connection.getConnection((err, con) => {
      if (err) throw err;
      var sql = 'UPDATE leave_activity_report SET status = ?, approve_id = ? WHERE leave_activity_report_id = ?'
      var sql2 = 'UPDATE lptt_employee SET leave_activity = leave_activity - ? WHERE employee_id = ?'
      var sql3 = 'SELECT * FROM leave_activity_report'
      var value = [req.body.status, req.body.approve_id, req.body.id]
      var value2 = [req.body.amount, req.body.emp_id]
      connection.query(sql, value, (err, result, fields) => {
        connection.query(sql2, value2, (err, result, fields) => {
          connection.query(sql3, (err, result, fields) => {
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
          // console.log('bbbbbbb', typeof(result));
          console.log('reject leave done')
          con.release()
        })
      })
    })
  })

  route.post('/post-la_report', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err;
      console.log('connected')
      var sql = "INSERT INTO leave_activity_report (leave_activity_report_id, employee_id, start_time, end_time, reason_for_leave, leave_category, approve_id, approve_date, status, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      var sql2 = 'SELECT * FROM leave_activity_report'
      let values = ['', req.body.employee_id, req.body.start_time, req.body.end_time, req.body.reason_for_leave, req.body.leave_category, req.body.approve_id, req.body.approve_date, req.body.status, req.body.amount]
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

route.post('/checkleave', (req, res) => {
  console.log('id:', req.body.id)
  console.log('test leave')
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT leave_activity FROM lptt_employee WHERE employee_id = ?'
    let values = [req.body.id]
    connection.query(sql, values, (err, result) => {
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
      console.log('res', result)
      console.log('check leave done')
      con.release()
    })
  })
})
module.exports = route