const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.get('/get-all-dtrans', (req, res) => {
    connection.getConnection((err) => {
      if (err) throw err;
      connection.query("SELECT * FROM detail_transtation", (err, result, fields) => {
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