const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
var multer  = require('multer')
const { response } = require('express')
route.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: '../../../../ssr/lptt_erp/public/uploads/plan/',
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


route.post('/createplan', (req, res) => {
    connection.getConnection((err, con) => {
      if (err) throw err
      var sql = 'INSERT INTO plan (plan_id, employee_id, title, detail, priority, permission, member, reg_date, up_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      var sql2 = 'SELECT * FROM plan'
      var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, new Date(Date.now()).toString(), new Date(Date.now()).toString()]
      connection.query(sql, value,  (err, result, fields) => {
        if (err) throw err
        if (result.affectedRows == 0) {
          res.status(404).json({
            err: err
          })
        } else if (result.affectedRows == 1) {
          // console.log('rowUPPLAN')
          connection.query(sql2, (err, result, fields) => {
            // console.log('sql queryplan')
            // console.log(result)
            if (result.length > 0) {
              // console.log('status200')
              res.status(200).json({
                result: result
              })
            } else {
              // console.log('status404')
              res.status(404).json({
                err: err
              })
            } 
          })
        }
        con.release()
      })
    })
    console.log('plan create')
})

route.patch('/editcontents', (req, res) => {
  console.log('edit', [req.body.id, req.body.title, req.body.up])
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'UPDATE plan SET title = ?, up_date = ? WHERE plan_id = ?'
    var sql2 = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    var value = [req.body.title, req.body.up, req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.affectedRows == 0) {
        res.status(404).json({
          err: err
        })
      } else if (result.affectedRows == 1) {
        connection.query(sql2, (err, result, fields) => {
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
      }
      con.release()
    })
  })
})
route.patch('/editdetailcontents', (req, res) => {
  console.log('edit', [req.body.id, req.body.detail, req.body.up])
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'UPDATE plan SET detail = ?, up_date = ? WHERE plan_id = ?'
    var sql2 = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    var value = [req.body.detail, req.body.up, req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.affectedRows == 0) {
        res.status(404).json({
          err: err
        })
      } else if (result.affectedRows == 1) {
        connection.query(sql2, (err, result, fields) => {
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
      }
      con.release()
    })
  })
})

route.post('/deletecontents', (req, res) => {
  console.log('delete', req.body.id)
  connection.getConnection((err, con) => {
    console.log('delete2', req.params.id)
    if (err) throw err
    var sql = 'DELETE FROM plan WHERE plan_id = ?'
    var sql2 = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    var value = [req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.affectedRows == 0) {
        console.log('delete fail')
        res.status(404).json({
          err: err
        })
      } else if (result.affectedRows == 1) {
        console.log('delete done')
        connection.query(sql2, (err, result, fields) => {
          console.log('delete done2')
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
      }
      con.release()
    })
  })
})

route.post('/createcomment', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'INSERT INTO comment_plan (plans_id, employee_id, comments, reg_date, up_date) VALUES (?, ?, ?, ?, ?)'
    var sql2 = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    var value = [req.body.id, req.body.employee_id, req.body.ccomment, req.body.reg, req.body.up]
    console.log('hhhhh  ', value)
    // var value2 = [req.body.id]
    connection.query(sql, value,  (err, result, fields) => {
      if (err) throw err
      // console.log('ROW: ', result.affectedRows)
      if (result.affectedRows == 0) {
        res.status(404).json({
          err: err
        })
      } else if (result.affectedRows == 1) {
        // console.log('rowUP')
        connection.query(sql2, (err, result, fields) => {
          // console.log('sql query')
          // console.log(result)
          if (result.length > 0) {
            // console.log('status200')
            res.status(200).json({
              result: result
            })
          } else {
            // console.log('status404')
            res.status(404).json({
              err: err
            })
          } 
        })
      }
      con.release()
    })
  })
  console.log('plan create')
})

route.patch('/editcomments', (req, res) => {
  console.log('edit', [req.body.id, req.body.comment, req.body.up])
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'UPDATE comment_plan SET comments = ?, up_date = ? WHERE comments_id = ?'
    var sql2 = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    var value = [req.body.comment, req.body.up, req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.affectedRows == 0) {
        res.status(404).json({
          err: err
        })
      } else if (result.affectedRows == 1) {
        connection.query(sql2, (err, result, fields) => {
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
      }
      con.release()
    })
  })
})
route.post('/deletecomments', (req, res) => {
  console.log('delete', req.body.id)
  connection.getConnection((err, con) => {
    console.log('delete2', req.params.id)
    if (err) throw err
    var sql = 'DELETE FROM comment_plan WHERE comments_id = ?'
    var sql2 = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    var value = [req.body.id]
    connection.query(sql, value, (err, result, fields) => {
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.affectedRows == 0) {
        console.log('delete fail')
        res.status(404).json({
          err: err
        })
      } else if (result.affectedRows == 1) {
        console.log('delete done')
        connection.query(sql2, (err, result, fields) => {
          console.log('delete done2')
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
      }
      con.release()
    })
  })
})

route.get('/get-emp-plan', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT employee_id, employee_name, employee_lastname, employee_pic FROM `lptt_employee`'
    // var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, '', '']
    connection.query(sql, (err, result, fields) => {
      // console.log(result)
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
      console.log('plan get employee')
      con.release()
    })
  })
})

route.get('/showcontent', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT * FROM plan'
    // var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, '', '']
    connection.query(sql, (err, result, fields) => {
      // console.log(result)
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.length > 0) {
        // console.log('test plan')
        res.status(200).json({
          result: result
        })
      }
      console.log('plan get content')
      con.release()
    })
  })
})

route.get('/showcomment', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err
    var sql = 'SELECT lptt_employee.employee_name, lptt_employee.employee_lastname, comment_plan.* FROM `comment_plan` INNER JOIN lptt_employee ON comment_plan.employee_id = lptt_employee.employee_id ORDER BY plans_id DESC'
    // var value = ['', req.body.id, req.body.title, req.body.detail, req.body.priority, req.body.permission, req.body.member, '', '']
    connection.query(sql, (err, result, fields) => {
      // console.log(result)
      if (err) {
        res.status(404).json({
          err: err
        })
      }
      if (result.length > 0) {
        // console.log('test plan')
        res.status(200).json({
          result: result
        })
      }
      console.log('plan get content')
      con.release()
    })
  })
})
module.exports = route