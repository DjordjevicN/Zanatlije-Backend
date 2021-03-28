
const express = require('express');
const router = express.Router();
const db = require('../database')

router.get('/allTasks', async (req, res) => {
    let sql = `SELECT * FROM tasks ;`
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})
// CREATE TASK
router.post('/createTask', async (req, res) => {
    let { taskUserId, taskTitle, taskPrice, taskBody, taskTimestamp, taskLatitude, taskLongitude, taskAddress, taskOwnerName } = req.body.value;
    let sql = `INSERT INTO tasks SET 
    taskUserId="${taskUserId}",
    taskTitle="${taskTitle}",
    taskPrice="${taskPrice}",
    taskBody="${taskBody}",
    taskOwnerName="${taskOwnerName}",
    taskTimestamp="${taskTimestamp}",
    taskLatitude="${taskLatitude}",
    taskLongitude="${taskLongitude}",
    taskAddress="${taskAddress}"`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: 'Neuspesno Kreiranje Projekta', success: false });
            throw err
        };
        res.json({ msg: 'Projekat kreiran', success: true, results });
    })
})
// DELETE TASK  PS. Axios.delete() don't pass id for some reason
router.post('/deleteTask', async (req, res) => {
    let taskId = req.body.value
    let sql = `DELETE FROM tasks WHERE taskId = ${taskId}`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: 'Projekat Obrisan', success: true, results });
    })
})

// UPDATE TASK
router.post('/updateTask', (req, res) => {
    let { taskTitle, taskPrice, taskAddress, taskBody, taskUserId, taskId } = req.body.value;
    let sql = `UPDATE tasks SET 
    taskTitle ='${taskTitle}' ,
    taskPrice="${taskPrice}",
    taskAddress="${taskAddress}",
    taskBody="${taskBody}"
     WHERE taskId = ${taskId}`
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.json({ success: false, msg: 'Neuspesno' })
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})

// CREATE PROPOSAL
router.post('/createProposal', async (req, res) => {
    let { proposalPrice, proposalInitMessage, proposalFromName, proposalFromId, proposalTaskId } = req.body.value;
    let sql = `INSERT INTO proposals SET 
    proposalPrice="${proposalPrice}",
    proposalInitMessage="${proposalInitMessage}",
    proposalFromName="${proposalFromName}",
    proposalFromId="${proposalFromId}",
    proposalTaskId="${proposalTaskId}"`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})
// GET TASK PROPOSALS

router.post('/getTaskProposals', async (req, res) => {
    let proposalTaskId = req.body.value;
    let sql = `SELECT * FROM proposals WHERE proposalTaskId = '${proposalTaskId}'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})
module.exports = router;
