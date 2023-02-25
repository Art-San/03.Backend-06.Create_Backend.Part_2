const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateUserData } = require('../utils/helpers')
const tokenService = require('../services/token.service')
const router = express.Router({ mergeParams: true })

// // /api/auth/signUp <-
// 1. get data from req (email, password ...)
// 2. check if users already exist
// 3. hash password
// 4. create users
// 5 generate ptokens
router.post('/signUp', async (req, res) => {
    try {
        const { email, password } = req.body

        const exitingUser = await User.findOne({ email: email }) 
        
        if (exitingUser) {
            return res.status(400).json({
                error: {
                    message: 'EMAIL_EXISTE',
                    code: 400
                }
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12) // шифруем пароль полученый из req.body 12-это сложность шифрования

        const newUser = await User.create({
            ...generateUserData(), // учитыва что данная функция возвращает объект то тоже ее развернем ...generateUserData
            ...req.body,                //  в таком порядке если что то ...req.body перепишет enerateUserData, и затем уже пароль
            password: hashedPassword
        })

       const tokens = tokenService.generate({ _id: newUser._id })
       await tokenService.save(newUser._id, tokens.refreshToken)

       res.status(201).send({ ...tokens, userId: newUser._id })


    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибкаю Попробуйте позже'
        }) 
    }
})

router.post('/signInWithPassword', async (req, res) => {
    
})

router.post('/token', async (req, res) => {
    
})

module.exports = router