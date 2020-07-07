const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

//getallemp
route.post('/login', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT employee_id,password FROM `lptt_employee` WHERE employee_id = ? AND password = ?'
    var value = [req.body.employee_id, req.body.password]
    connection.query(sql, value, (err, result, fields) => {
      if (err) throw err;
      // console.log(result);
      if (result.length > 0) {
          res.json({
              result: 'success'
          })
      } else {
          res.json({
              result: 'unsuccess'
          })
      }
    //   for (i = 0; i < result.length; i++) {
    //   if (result == null || result == [] || result == undefined || result == 'undefined' || result == '') {
    //       console.log('error')
    //   } else if (result[i].employee_id == req.body.employee_id && result[i].password == req.body.password) {
    //     console.log('success')
    //   }
    //   console.log(result[0].employee_id)
    //   res.json({
    //     result: result
    //   })
    // }
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

module.exports = route