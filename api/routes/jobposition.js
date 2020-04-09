const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.get('/get-all-job', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err;
      connection.query("SELECT * FROM job_position", (err, result, fields) => {
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

module.exports = route