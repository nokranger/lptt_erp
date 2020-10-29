const express = require('express')
const route = express.Router()
var multer  = require('multer')
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())


const storage = multer.diskStorage({
  destination: '../../../../../VueJS/LPTT/frontend_erp/src/img/uploads/prettycash/',
  filename: function(req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, 'LPTTPRETTYCASH' + "-" + Date.now() + '.png');
  }
})

const upload = multer({
  storage: storage
})

//getallemp
route.patch('/approve-prettycash', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'UPDATE detail_prettycash SET status = ?, approve_id = ? WHERE id = ?'
    var sql2 = 'SELECT * FROM detail_prettycash WHERE date BETWEEN ? and ?'
    var value = [req.body.status, req.body.approve_id, req.body.id]
    var value2 =  [req.body.from, req.body.to]
    connection.query(sql, value, (err, result, fields) => {
      connection.query(sql2, value2, (err, result, fields) => {
        console.log('query2')
        console.log(result)
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
      // console.log('bbbbbbb', typeof(result));
      console.log('update cash done')
      con.release()
    });
  });
  // console.log('done selected')
})

route.patch('/reject-prettycash', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'UPDATE detail_prettycash SET status = ?, approve_id = ? WHERE id = ?'
    var sql2 = 'SELECT * FROM detail_prettycash WHERE date BETWEEN ? and ?'
    var value = [req.body.status, req.body.approve_id, req.body.id]
    var value2 =  [req.body.from, req.body.to]
    connection.query(sql, value, (err, result, fields) => {
      connection.query(sql2, value2, (err, result, fields) => {
        console.log('query2')
        console.log(result)
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
      // console.log('bbbbbbb', typeof(result));
      console.log('update cash done')
      con.release()
    });
  });
  // console.log('done selected')
})
route.post('/pdf', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT @_No := @_No + 1 _No, date, detail, amount, @_amount := @_amount + amount _amounts FROM `detail_prettycash`, (SELECT @_No := 0) _No, (SELECT @_amount := 0) _amounts WHERE status = 1 and date BETWEEN ? and ?'
    var value = [req.body.from, req.body.to]
    console.log(req.body.from)
    console.log(req.body.to)
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }else if (result.length > 0) {
        console.log('test',result)
        res.status(200).json({
          result: result
        })
      }
    })
    console.log('select data for pdf')
    con.release()
  })
})

route.post('/get-month-prettycash', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT * FROM detail_prettycash WHERE date BETWEEN ? and ? '
    var value = [req.body.from, req.body.to]
    connection.query(sql, value, (err, result, fields) => {
      if (err) throw err;
      if (result.length > 0) {
        console.log(result);
        res.status(200).json({
          result: result
        })
      } else {
        res.status(404).json({
          message: 'NOT FOUND'
        })
      }
      con.release()
    });
  });
  console.log('done selected')
})

route.post('/post-prettycash', upload.single('file'), (req, res) => {
  connection.getConnection((err) => {
    if (err) throw err;
    console.log("Connected!");
    let data = JSON.parse(req.body.data)
    // console.log(req.body.data)
    var sql = "INSERT INTO detail_prettycash (id, date, amount, service_charge, detail, picture, employee_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    let values = ['', data.date, data.amount, data.service_charge, data.detail,  req.file.filename, data.employee_id, data.status]
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
      res.status(200).json({
        result: req.file.filename
      })
    });
  });
}) 

module.exports = route