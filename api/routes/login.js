const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const passport = require('passport')
route.use(bodyParser.json())

const SECRET = 'MY_SECRET_KEY'

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: SECRET
}


const JwtAuth = new JwtStrategy(jwtOption, (payload, done) => {
  if(payload.sub == req.body.employee_id) done(null, true)
  else done(null, false)
})
passport.use(JwtAuth)

const requireJWTAuth = passport.authenticate('jwt', {session: false})



//getallemp
// route.get('/aa', requireJWTAuth, (req,res) => {
//   res.send('aa')
// })
route.post('/login', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT job_position.permission, lptt_employee.employee_id, lptt_employee.password FROM job_position INNER JOIN lptt_employee ON job_position.job_id = lptt_employee.job_position_id WHERE lptt_employee.employee_id = ? AND lptt_employee.password= ?'
    var value = [req.body.employee_id, req.body.password]
    connection.query(sql, value, (err, result, fields) => {
      if (err) throw err;
      // console.log(result);
      if (result.length > 0) {
        console.log(result[0].permission)
        const token = jwt.sign(
          {
          sub: result[0].employee_id,
          iat: new Date().getTime(), // issue at time,
          role: result[0].permission,
          loginSuccessfull: true,
          },process.env.JWT_KEY,
          {
            expiresIn: '10m'
          })
        const payload = {
          sub: result[0].employee_id,
          iat: new Date().getTime(), // issue at time,
          role: result[0].permission,
          loginSuccessfull: true,
        }
        console.log('success')
          // res.status(200).json(jwt.encode(payload, SECRET))
        res.status(200).json(token)
      } else {
        console.log('unsuccess')
        res.status(404).json({
          message: 'NOT FOUND'
        })
      }
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