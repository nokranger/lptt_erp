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

module.exports = route