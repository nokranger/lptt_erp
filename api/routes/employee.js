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
        // res.json({
        //     result: result
        // })
    });
  });
  console.log('done selected')
})

route.post('/post-emp', (req,res) => {
  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO lptt_employee (employee_id, employee_name, employee_lastname, job_position_id, employee_email, employee_tel, password, start_date, leave_sick, leave_activity, leave_vacation, employee_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    // let values = ['LPTT010', 'anusorn', 'thavornporn', '1', 'anusorn@logiprotech-th.co.th', '981265683', 'test1234', '2019-08-06T17:00:00.000Z', '30', '7', '14', '/img/nok.jpg']
    // aa = 'LPTT010'
    // bb= 'anusorn'
    // cc='thavornporn'
    // dd='1'
    // ee='anusorn@logiprotech-th.co.th'
    // ff='981265683'
    // t= 'test1234'
    // u='2019-08-06T17:00:00.000Z'
    // i= '30'
    // o='7'
    // p='14'
    // l='/img/nok.jpg'
    // let values = [aa, bb, cc,dd,ee,ff,t,u,i,o,p,l]
    let values = [req.body.employee_id, req.body.employee_name, req.body.employee_lastname, req.body.job_position_id, req.body.employee_email, req.body.employee_tel, req.body.password, req.body.start_date, req.body.leave_sick, req.body.leave_activity, req.body.leave_vacation, req.body.employee_pic]
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}) 

module.exports = route