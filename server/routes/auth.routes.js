const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const { generateUserData } = require('../utils/helpers')
const tokenService = require('../services/token.service')
const Token = require('../models/Token')
const router = express.Router({ mergeParams: true })

// // /api/auth/signUp <-
// 1. get data from req (email, password ...)
// 2. check if users already exist
// 3. hash password
// 4. create users
// 5 generate tokens
// 6. validaciya

router.post('/signUp', [   // hendler - async (req, res) => {} оборачивае  [в квадратные] и запихиваем chek
check('email', "Некорректный email").isEmail(),
check('password', 'Минимальная длина пороля 8 символов').isLength({min: 8}),
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400,
                        errors: errors.array()   // смотрим что там за ошибки
                    }
                })
            }
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
}])

// 1. validate
// 2. find user
// 3. compare hashed password
// 4. generate token
// 5. return date

router.post('/signInWithPassword', [
    check('email', 'Email некорректный').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(), // exists() - на наличие
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400
                    }
                })
            }

            const {email, password} = req.body

            const existingUser = await User.findOne({ email })

            if (!existingUser) {
                return res.status(400).send({
                    error: {
                        message: 'EMAIL_NOT_FOUND',
                        code: 400
                    }
                })
            }

         const isPasswordEquel = await bcrypt.compare(password, existingUser.password) // conpare- сравниваем пришедший парол и пароль в базе
        
         if (!isPasswordEquel) {
            return res.status(400).send({
                error: {
                    message: 'INVALID_PASSWORD',
                    code: 400
                }
            })
         }

         const tokens = tokenService.generate({ _id: existingUser._id })
         await tokenService.save(existingUser._id, tokens.refreshToken)

         res.status(200).send({ ...tokens, userId: existingUser._id })

        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибкаю Попробуйте позже'
            })
        }
}])

function isTokenInvalid(data, dbToken) {
    return !data || !dbToken || data._id !== dbToken?.user?.toString()
}

router.post('/token', async (req, res) => {
    try {
        const {refresh_token: refreshToken} = req.body
        const data = tokenService.validateRefresh(refreshToken)
        const dbToken = await tokenService.findToken(refreshToken)

        if(isTokenInvalid(data, dbToken)) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        const tokens = await tokenService.generate({
             _id: data._id
        })
        await tokenService.save(data._id, tokens.refreshToken)

        // console.log('data', data)       // если просто остави консоль.лог и не завершим запрос 

        // res.status(200).send({data})    // с помощью res.status(200).send({data}) то сервер будет виснуть
        res.status(200).send({ ...tokens, userId: data._id}) 
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибкаю Попробуйте позже'
        })
    }
})

module.exports = router