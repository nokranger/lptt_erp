const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

//getallemp
route.get('/get-all-emp', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    connection.query("SELECT * FROM lptt_employee", (err, result, fields) => {
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

route.get('/get-last-emp', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    connection.query("SELECT * FROM lptt_employee ORDER BY employee_id LIMIT 1", (err, result, fields) => {
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

route.post('/post-emp', (req, res) => {
  connection.getConnection((err) => {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO lptt_employee (employee_id, employee_name, employee_lastname, job_position_id, employee_email, employee_tel, password, start_date, leave_sick, leave_activity, leave_vacation, employee_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let values = [req.body.employee_id, req.body.employee_name, req.body.employee_lastname, req.body.job_position_id, req.body.employee_email, req.body.employee_tel, req.body.password, req.body.start_date, req.body.leave_sick, req.body.leave_activity, req.body.leave_vacation, req.body.employee_pic]
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
})

route.post('/settingprofile', ((req, res) => {
  connection.getConnection((err) => {
    if (err) throw err;
    var sql = 'SELECT lptt_employee.employee_id, lptt_employee.employee_name, lptt_employee.employee_lastname, lptt_employee.employee_email, lptt_employee.employee_tel, lptt_employee.start_date, lptt_employee.leave_sick, lptt_employee.leave_activity, lptt_employee.leave_vacation, lptt_employee.employee_pic, job_position.job_name FROM lptt_employee INNER JOIN job_position ON job_position.job_id = lptt_employee.job_position_id WHERE lptt_employee.employee_id = ?'
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
}))

module.exports = route