
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const saltRounds = 3;
const jwt = require('jsonwebtoken')
const auth = require('../auth')
const db = require('../database')


// CREATE USER
router.post('/createUser', async (req, res) => {
    let { userName, email, password } = req.body.value;
    let newPassword = await bcrypt.hash(password, saltRounds)
    let sql = `INSERT INTO users SET 
    userName="${userName}",
    email="${email}",
    password="${newPassword}",
    userCredit="30",
    userStatus="standard",
    userTheme="light"`

    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: 'Profil vec postoji', success: false });
            throw err
        };
        res.json({ msg: 'Profil kreiran', success: true, results });
    })
})

// LOGIN USER
router.post('/loginUser', (req, res) => {
    const { email, password } = req.body.value
    let sql = `SELECT * FROM users WHERE email = '${email}'`
    let query = db.query(sql, async (err, results) => {
        if (err) {
            throw err
        } else if (results) {
            let match = await bcrypt.compare(password, results[0].password)
            if (match) {
                let user = {
                    email: results[0].email,
                    id: results[0].userId
                }
                delete results[0].password;
                let token = jwt.sign({ user }, process.env.TOKEN_SECRET);
                res.json({ msg: 'Dobrodosli', success: true, token, results });
            }
        }
    })
})

// GET PROFILE BY ID
router.post('/getUserById', (req, res) => {
    let sql = `SELECT * FROM users WHERE userId = '${req.body.value.userId}'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '' })
            throw err
        };
        res.json({ results, msg: 'Informacije Izmenjene' })
    })
})
// UPDATE USER PROFILE
router.post('/updateUser', auth, (req, res) => {
    let id = req.user.user.id
    let { userId, userName, userAddress, email, aboutMe, userPhoneNumber } = req.body.value;
    let sql = `UPDATE users SET 
    userName ='${userName}' ,
    userAddress="${userAddress}",
    email="${email}",
    aboutMe="${aboutMe}",
    userPhoneNumber="${userPhoneNumber}"
     WHERE userId = ${id}`
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.json({ success: false, msg: 'Neuspesno' })
            throw err
        };
        res.json({ msg: 'Profil Uspesno Obnovljen', success: true, results });
    })
})

// GET MY DATA
router.get('/getMyData', auth, (req, res) => {
    let id = req.user.user.id
    let sql = `SELECT * FROM users WHERE users.userId = '${id}'`

    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        delete results[0].password;
        res.json({ results, success: true, msg: '' })
    })
})
// GET MY TASKS
router.get('/getUserTasks', auth, (req, res) => {
    let id = req.user.user.id
    let sql = `SELECT * FROM tasks WHERE tasks.taskUserId = '${id}'`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, msg: '' })
    })
})
// GET MY SERVICES
router.get('/getUserServices', auth, (req, res) => {
    let id = req.user.user.id
    let sql = `SELECT * FROM services WHERE services.serviceUserId = '${id}'`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, msg: '' })
    })
})

// GET PROPOSALS
router.get('/getUserProposals', (req, res) => {
    let id = req.body.value
    let sql = `SELECT * FROM proposals WHERE proposals.proposalTaskId = '${id}'`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, msg: '' })
    })
})
// GET PROPOSALS BY USER ID
router.post('/getUserProposalsById', (req, res) => {
    let id = req.body.value
    let sql = ` select * from proposals join tasks on proposals.proposalTaskId = tasks.taskId where proposals.proposalFromId = '${id}'`


    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, msg: '' })
    })
})

// GET MESSAGES IG THERE IS PROPOSALS
router.post('/getProposalsMessages', (req, res) => {
    let id = req.body.proposalId
    let sql = `SELECT * FROM messages WHERE messageProposalId = '${id}'`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json({ results, success: true, msg: '' })
    })
})

// SEND MESSAGE
router.post('/sendMessage', async (req, res) => {
    let { messageProposalId, messageBody, messageFromUserId, messageFromName, messageTimestamp, messageSeen } = req.body.value;
    let sql = `INSERT INTO messages SET 
    messageProposalId="${messageProposalId}",
    messageBody="${messageBody}",
    messageFromName="${messageFromName}",
    messageTimestamp="${messageTimestamp}",
    messageSeen="${messageSeen}",
    messageFromUserId="${messageFromUserId}"`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: 'Poruka poslata', success: true, results });
    })
})
// DELETE USER

module.exports = router;