const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "lptt_erp"
})

// con.connect((err) => {
//     if(err) throw err
//     console.log('connect DB !!')
// })
module.exports = connection