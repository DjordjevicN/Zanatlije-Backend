
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const saltRounds = 3;
const jwt = require('jsonwebtoken')
const auth = require('../auth')
const db = require('../database')


// CREATE SERVICE
router.post('/createService', async (req, res) => {
    let { serviceCategory, servicePrice, serviceDescription, serviceUserId } = req.body.value;
    let sql = `INSERT INTO services SET 
    serviceCategory="${serviceCategory}",
    servicePrice="${servicePrice}",
    serviceDescription="${serviceDescription}",
    serviceUserId="${serviceUserId}"`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: 'Neuspesno kreiranje usluge', success: false });
            throw err
        };
        res.json({ msg: 'Usluga kreirana', success: true, results });
    })
})
// GET ALL SERVICES
router.post('/getAllServices', async (req, res) => {
    let sql = `SELECT * FROM services`
    // let sql = `SELECT * FROM services WHERE serviceUserId = 12`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: 'Neuspesno', success: false });
            throw err
        };
        res.json({ msg: 'Usluga kreirana', success: true, results });
    })
})
// GET USERS SERVICES
router.post('/getUsersServices', async (req, res) => {
    let userId = req.body.userId;
    let sql = `SELECT * FROM services WHERE serviceUserId = ${userId}`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: 'Neuspesno', success: false });
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})
// UPDATE SERVICE
router.post('/editService', (req, res) => {
    let { serviceCategory, serviceDescription, servicePrice, serviceId } = req.body.value;
    let sql = `UPDATE services SET 
    serviceCategory ='${serviceCategory}' ,
    serviceDescription="${serviceDescription}",
    servicePrice="${servicePrice}"
     WHERE serviceId = ${serviceId}`
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.json({ success: false, msg: 'Neuspesno' })
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})

// DELETE SERVICE  PS. Axios.delete() don't pass id for some reason
router.post('/deleteService', async (req, res) => {
    let serviceId = req.body.value
    let sql = `DELETE FROM services WHERE serviceId = ${serviceId}`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: 'Usluga Obrisana', success: true, results });
    })
})
// GET SINGLE SERVICE BY ID
router.post('/getServiceById', async (req, res) => {
    let serviceId = req.body.value
    let sql = `SELECT * FROM services WHERE serviceId = ${serviceId}`
    let query = await db.query(sql, (err, results) => {
        if (err) {
            res.json({ msg: '', success: false });
            throw err
        };
        res.json({ msg: '', success: true, results });
    })
})
module.exports = router;