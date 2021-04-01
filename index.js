const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const port = process.env.PORT || 3001
const db = require('./database')
const authUser = require('./routes/authUser')
const services = require('./routes/services')
const tasks = require('./routes/tasks')
const app = express()
require('dotenv').config()
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authUser)
app.use(services)
app.use(tasks)

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('SQL CONNECTED WOOHOOA');
});
app.get('/', (req, res) => {
    let sql = `SELECT * FROM users WHERE userId = '1'`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json('TESTIRANJE BACKEND RADI')
    })
})

app.get('/getLatestTasks', (req, res) => {
    let sql = `SELECT * FROM tasks ORDER BY tasks.taskId DESC LIMIT 3`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, notification: '' })
    })
})
// get initials users 
app.get('/getInitialProfiles', (req, res) => {
    let sql = `SELECT * FROM services JOIN users ON services.serviceUserId = users.userId ORDER BY services.serviceId DESC LIMIT 10`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, notification: '' })
    })
})

// search for task by task title
app.post('/getSearchTasks', (req, res) => {
    let value = req.body.value;
    let sql = `SELECT * FROM tasks WHERE match(tasks.taskTitle) against('${value}')`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, notification: '' })
    })
})
// SEARCH USERS BASED ON SERVICES
app.post('/getSearchUsers', (req, res) => {
    let value = req.body.value;
    let sql = `SELECT * FROM services JOIN users ON users.userId = services.serviceUserId WHERE match(services.serviceCategory) against('${value}')`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, notification: '' })
    })
})

//  GET USER AND HIS SERVICES BY USER ID
app.post('/getUserAndServices', (req, res) => {
    let value = req.body.value;
    let sql = `SELECT * FROM users JOIN services ON users.userId = services.serviceUserId WHERE users.userId = '${value}'`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, notification: '' })
    })
})


app.listen(port, () => {
    console.log(`Listening on ${port}`);
})