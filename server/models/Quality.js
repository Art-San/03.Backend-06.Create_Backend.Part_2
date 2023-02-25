const {Schema, model} = require('mongoose')

const shema = new Schema({
    name: {
        type: String,
        required: true  // обязательное ли это поле
    },
    color: {
        type: String,
        required: true 
    }
}, {
    timestamps: true // добавляет дату создания и дата обновления
})

module.exports = model('Quality', shema)

