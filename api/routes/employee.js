const express = require('express')
const route = express.Router()
var multer  = require('multer')
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: '../../../../../VueJS/LPTT/frontend_erp/src/img/uploads/signup/',
  filename: function(req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    )
    cb(null, 'LPTTSIGNUP' + "-" + Date.now() + '.png')
  }
})

const upload = multer({
  storage: storage
})

//getallemp
route.post('/get-all-emp', (req, res) => {
  connection.getConnection((err, con) => {
    var sql = 'SELECT * FROM lptt_employee WHERE employee_id = ?'
    var value = [req.body.id]
    if (err) throw err
    connection.query(sql, value, (err, result, fields) => {
      console.log('sql emp')
      console.log(result)
      if (result.length > 0) {
        console.log('status200')
        res.status(200).json({
          result: result
        })
      } else {
        console.log('status404')
        res.status(404).json({
          err: err
        })
      } 
    con.release()
    })
  })
  console.log('done selected')
})

route.get('/get-last-emp', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    connection.query("SELECT * FROM lptt_employee INNER JOIN job_position WHERE job_position_id = job_position.job_id ORDER BY employee_id DESC LIMIT 1", (err, result, fields) => {
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

route.post('/post-emp', upload.single('file'), (req, res) => {
  connection.getConnection((err) => {
    if (err) throw err
    console.log("Connected!")
    let data = JSON.parse(req.body.data)
    var sql = "INSERT INTO lptt_employee (employee_id, employee_name, employee_lastname, job_position_id, employee_email, employee_tel, password, start_date, leave_sick, leave_activity, leave_vacation, employee_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let values = [data.employee_id, data.employee_name, data.employee_lastname, data.job_position_id, data.employee_email, data.employee_tel, data.password, data.start_date, data.leave_sick, data.leave_activity, data.leave_vacation, req.file.filename]
    connection.query(sql, values, (err, result) => {
      if (err) throw err
      res.status(200).json({
        result: req.file.filename
      })
      console.log("1 record inserted");
    })
  })
})

route.post('/settingprofile', (req, res) => {
  console.log('connect from cc', req.body.employee_id)
  connection.getConnection((err, con) => {
    console.log(req.body.employee_id)
    if (err) throw err
    var sql = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id WHERE lptt_employee.employee_id = ?'
    var values = [req.body.employee_id]
    connection.query(sql, values, (err, result, fields) => {
      if (err) throw err
      if (result.length > 0) {
        res.status(200).json({
          result: result
        })
      } else {
        res.status(404).json({
          err: err
        })
      }
    })
    console.log('select data for setting profile')
    con.release()
  })
})

route.post('/settingprofileadmin', (req, res) => {
  console.log('connect from ccnn', req.body.employee_id)
  if (req.body.employee_id == 'ADMIN') {
    console.log('re admin')
    connection.getConnection((err, con) => {
      console.log(req.body.employee_id)
      if (err) throw err
      var sql = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name,job_position.permission FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id'
      var values = [req.body.employee_id]
      connection.query(sql, values, (err, result, fields) => {
        if (err) throw err;
        if (result.length > 0) {
          res.status(200).json({
            result: result
          })
        } else {
          res.status(404).json({
            err: err
          })
        }
      })
      console.log('select data for setting profile')
      con.release()
    })
  }
})

route.patch('/adminchangepassword', (req, res) => {
  console.log(req.body.approve_id, req.body.role)
  if (req.body.approve_id == 'ADMIN' && req.body.role == '0') {
    console.log('re admin')
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'UPDATE lptt_employee SET password = ? WHERE employee_id = ?'
      var sql2 = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name,job_position.permission FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id'
      var values = [req.body.password, req.body.id]
      console.log(req.body.password, req.body.id)
      connection.query(sql, values, (err, result, fields) => {
        connection.query(sql2, (err, result, fields) => {
          console.log('test2')
          if (err) throw err
          if (result.length > 0) {
            res.status(200).json({
              result: result
            })
          } else {
            res.status(404).json({
              err: err
            })
          }
        })
      })
      console.log('adminchangepassword')
      con.release()
    })
  }
})

route.patch('/changepassword', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'UPDATE lptt_employee SET password = ? WHERE employee_id = ?'
      var sql2 = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id WHERE lptt_employee.employee_id = ?'
      var values = [req.body.password, req.body.id]
      var value2 = [req.body.id]
      console.log(req.body.password, req.body.id)
      connection.query(sql, values, (err, result, fields) => {
        connection.query(sql2, value2, (err, result, fields) => {
          console.log('test2')
          if (err) throw err
          if (result.length > 0) {
            res.status(200).json({
              result: result
            })
          } else {
            res.status(404).json({
              err: err
            })
          }
        })
      })
      console.log('changepassword')
      con.release()
    })
})

route.patch('/updateusers', (req, res) => {
  console.log('test update users')
  console.log([req.body.name, req.body.lastname, req.body.tel, req.body.email, req.body.id])
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'UPDATE lptt_employee SET employee_name = ?, employee_lastname = ?, employee_tel = ?, employee_email = ? WHERE employee_id = ?'
      var sql2 = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id WHERE lptt_employee.employee_id = ?'
      var values = [req.body.name, req.body.lastname, req.body.tel, req.body.email, req.body.id]
      var value2 = [req.body.id]
      connection.query(sql, values, (err, result, fields) => {
        connection.query(sql2, value2, (err, result, fields) => {
          if (err) throw err
          if (result.length > 0) {
            res.status(200).json({
              result: result
            })
          } else {
            res.status(404).json({
              err: err
            })
          }
        })
      })
      console.log('updateusers')
      con.release()
    })
})

route.patch('/updateusersadmin', (req, res) => {
  console.log('test update users')
  console.log([req.body.name, req.body.lastname, req.body.tel, req.body.email, req.body.id])
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'UPDATE lptt_employee SET employee_name = ?, employee_lastname = ?, employee_tel = ?, employee_email = ? WHERE employee_id = ?'
      var sql2 = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id WHERE lptt_employee.employee_id = ?'
      var values = [req.body.name, req.body.lastname, req.body.tel, req.body.email, req.body.id]
      var value2 = [req.body.id]
      connection.query(sql, values, (err, result, fields) => {
        connection.query(sql2, value2, (err, result, fields) => {
          if (err) throw err
          if (result.length > 0) {
            res.status(200).json({
              result: result
            })
          } else {
            res.status(404).json({
              err: err
            })
          }
        })
      })
      console.log('updateusersadmin')
      con.release()
    })
})
module.exports = route