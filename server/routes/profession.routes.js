const express = require('express')
const Profession = require('../models/Profession')
const router = express.Router({ mergeParams: true })

router.get('/', async (req, res) => {
    try {
        const list = await Profession.find()
        res.status(200).send(list)
        // res.status(200).json({ list }) // добавляет {"list":
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибкаю Попробуйте позже'
        })
    }
})

module.exports = router