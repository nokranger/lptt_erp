const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
var multer  = require('multer')
const { response } = require('express')
route.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: '../../../../../VueJS/LPTT/frontend_erp/src/img/uploads/plan/',
  filename: function(req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    )
    cb(null, 'LPTTPLAN' + "-" + Date.now() + '.png')
  }
})

const upload = multer({
  storage: storage
})


route.get('/get-all-la_report', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      connection.query("SELECT leave_activity_report.*, leave_type.leave_name FROM leave_activity_report INNER JOIN leave_type on leave_activity_report.leave_category = leave_type.leave_id ORDER BY leave_activity_report_id", (err, result, fields) => {
        if (err) throw err
        // console.log(result);
        res.json({
          result: result,
        })
        con.release()
      })
    })
    console.log('plan select')
})
module.exports = route