const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
var multer  = require('multer')
const { response } = require('express')
route.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: '../../../../ssr/lptt_erp/public/uploads/leave/',
  filename: function(req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, 'LPTTLEAVE' + "-" + Date.now() + ext)
  }
})

const upload = multer({
  storage: storage
})

route.get('/get-all-la_report', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      connection.query("SELECT *, leave_type.leave_name FROM leave_activity_report INNER JOIN leave_type on leave_activity_report.leave_category = leave_type.leave_id WHERE leave_activity_report.status = 0 ORDER BY leave_activity_report_id DESC", (err, result, fields) => {
        if (err) throw err
        // console.log(result);
        res.json({
          result: result,
        })
        con.release()
      })
    })
    console.log('done selected')
})

route.get('/get-all-history', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    connection.query("SELECT *, leave_type.leave_name FROM leave_activity_report INNER JOIN leave_type on leave_activity_report.leave_category = leave_type.leave_id WHERE leave_activity_report.status > 0 ORDER BY leave_activity_report_id DESC", (err, result, fields) => {
      if (err) throw err
      // console.log(result);
      res.json({
        result: result,
      })
      con.release()
    })
  })
  console.log('done selected')
})

route.post('/get-all-la_report-user', (req, res) => {
  console.log('emid', [req.body.id])
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT * FROM leave_activity_report WHERE employee_id = ? ORDER BY leave_activity_report_id DESC'
    var value = [req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) throw err
      // console.log(result);
      res.json({
        result: result,
      })
      con.release()
    })
  })
  console.log('done selected')
})

 
  route.get('/get-last-record', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
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
      if (err) throw err
      var sql = 'UPDATE leave_activity_report SET status = ?, approve_id = ?, approve_date = ? WHERE leave_activity_report_id = ?'
      var sql2 = 'SELECT *, leave_type.leave_name FROM leave_activity_report INNER JOIN leave_type on leave_activity_report.leave_category = leave_type.leave_id WHERE leave_activity_report.status = 0 ORDER BY leave_activity_report_id DESC'
      var value = [req.body.status, req.body.approve_id, new Date(Date.now()).toString(), req.body.id]
      connection.query(sql, value, (err, result, fields) => {
        if (result.affectedRows == 0) {
          res.status(404).json({
            err: err
          })
        }else if (result.affectedRows == 1) {
          connection.query(sql2, (err, result, fields) => {
            // console.log('query2')
            // console.log(result)
            if (err) {
              res.status(404).json({
                err: err
              })
            }
            if (result.length > 0) {
              res.status(200).json({
                result: result
              })
            } else if (result.length == 0){
              res.status(404).json({
                status: 1
              })
            }
          })
        }
        // console.log('bbbbbbb', typeof(result));
        console.log('reject leave done')
        con.release()
      })
    })
  })

  route.patch('/approve-leave-report', (req, res) => {
    console.log('app', [req.body.status, req.body.id, req.body.approve_id, req.body.category])
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'UPDATE leave_activity_report SET status = ?, approve_id = ?, approve_date = ? WHERE leave_activity_report_id = ?'
      var sql2 = 'UPDATE lptt_employee SET leave_activity = leave_activity - ? WHERE employee_id = ? AND leave_activity - ? >= 0'
      var sql2_2 = 'UPDATE lptt_employee SET leave_sick = leave_sick - ? WHERE employee_id = ? AND leave_sick - ? >= 0'
      var sql3 = 'SELECT *, leave_type.leave_name FROM leave_activity_report INNER JOIN leave_type on leave_activity_report.leave_category = leave_type.leave_id WHERE leave_activity_report.status = 0 ORDER BY leave_activity_report_id DESC'
      var value = [req.body.status, req.body.approve_id, new Date(Date.now()).toString(), req.body.id]
      var value2 = [req.body.amount, req.body.emp_id, req.body.amount]
      if (req.body.category == 1) {
        console.log('req1',req.body.category)
        connection.query(sql2, value2, (err, result, fields) => {
          console.log('err', err)
          console.log('resROWS: ', result.affectedRows)
          if (result.affectedRows == 0) {
            console.log('status0')
            res.status(200).json({
              result: 1
            })
          } else if (result.affectedRows == 1) {
            connection.query(sql, value, (err, result) => {
              console.log('resROWS2', result.affectedRows)
              console.log('status1')
              connection.query(sql3, (err, result) => {
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
              console.log('approve leave done')
              con.release()
            })
          }
        })
      } else if (req.body.category == 2) {
        console.log('req2',req.body.category)
        connection.query(sql2_2, value2, (err, result) => {
          console.log('err', err)
          console.log('resROWS: ', result.affectedRows)
          if (result.affectedRows == 0) {
            console.log('status0')
            res.status(200).json({
              result: 2
            })
          } else if (result.affectedRows == 1) {
            connection.query(sql, value, (err, result) => {
              console.log('resROWS2', result.affectedRows)
              console.log('status1')
              connection.query(sql3, (err, result) => {
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
              console.log('approve leave done')
              con.release()
            })
          }
        })
      }
    })
  })

  route.post('/post-la_report', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      console.log('connected')
      var sql = "INSERT INTO leave_activity_report (leave_activity_report_id, employee_id, start_time, end_time, reason_for_leave, leave_category, approve_id, approve_date, status, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      var sql2 = 'SELECT *, leave_type.leave_name FROM leave_activity_report INNER JOIN leave_type on leave_activity_report.leave_category = leave_type.leave_id ORDER BY leave_activity_report_id DESC'
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
    if (err) throw err
    var sql = 'SELECT leave_sick, leave_activity  FROM lptt_employee WHERE employee_id = ?'
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