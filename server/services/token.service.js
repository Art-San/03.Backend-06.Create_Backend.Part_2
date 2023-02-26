const jwt = require('jsonwebtoken')
const config = require('config')
const Token = require('../models/Token')

class TokenService {
    // return: accessToken, refreshToken, exporesIn
    generate(payload) {
        const accessToken = jwt.sign(payload, config.get("accessSecret"), { // сщздаем токен
            expiresIn: '1h' // жизнь токена
        })

        const refreshToken = jwt.sign(payload, config.get("refreshSecret")) // сщздаем рефреш токен

        return {accessToken, refreshToken, exporesIn: 3600}
    }

    async save(user, refreshToken) {
       const data = await Token.findOne( { user })
       if (data) {
        data.refreshToken = refreshToken
        return data.save()
       }

       const token = await Token.create({ user, refreshToken})
       return token
    }

    validateRefresh(refreshToken) {
        try {
           return jwt.verify(refreshToken, config.get("refreshSecret"))
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken) {
        try {
            return await Token.findOne({ refreshToken })
        } catch (e) {
            return null
        }
    }
    
}

module.exports = new TokenService()

