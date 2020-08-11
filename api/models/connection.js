const mysql = require('mysql')

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: "lptt_erp",
  multipleStatements: true
})

// con.connect((err) => {
//     if(err) throw err
//     console.log('connect DB !!')
// })
module.exports = connection
