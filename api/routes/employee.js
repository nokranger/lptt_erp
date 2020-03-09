const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())


route.get('/get-all-emp', (req, res) => {
  connection.connect((err) => {
    if (err) throw err;
    connection.query("SELECT * FROM lptt_employee", (err, result, fields) => {
      if (err) throw err;
      // console.log(result);
      res.json({
        result: result
      })
    });
  });
  console.log('done selected')
})

route.get('/get-last-emp', (req, res) => {
  connection.connect((err) => {
    if (err) throw err;
    connection.query("SELECT * FROM lptt_employee ORDER BY employee_id LIMIT 1", (err, result, fields) => {
      if (err) throw err;
      // console.log(result);
      res.json({
        result: result
      })
    });
  });
  console.log('done selected')
})

route.post('/post-emp', (req,res) => {
  connection.connect((err) => {
    if(!err){
      console.log("Connected!");
      var sql = "INSERT INTO lptt_employee (employee_id, employee_name, employee_lastname, job_position_id, employee_email, employee_tel, password, start_date, leave_sick, leave_activity, leave_vacation, employee_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let values = [req.body.employee_id, req.body.employee_name, req.body.employee_lastname, req.body.job_position_id, req.body.employee_email, req.body.employee_tel, req.body.password, req.body.start_date, req.body.leave_sick, req.body.leave_activity, req.body.leave_vacation, req.body.employee_pic]
      connection.query(sql, values, (err, result) => {
        // if (err) throw err;
        // console.log("1 record inserted");
        if(!err)
          res.send('Insert successfully')
        else
          console.log(err)
      });
    }else{
      console.log(err)
    }
  });
}) 

module.exports = route