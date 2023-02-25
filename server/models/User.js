const {Schema, model} = require('mongoose')

const shema = new Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true }, // unique - уникальный
    password: {type: String},
    completedMeetings: {type: Number},
	image: String,
    profession: { type: Schema.Types.ObjectId, ref: 'Profession'}, // ref - связь между колекциеей 
    qualities: [{ type: Schema.Types.ObjectId, ref: 'Quality' }],  // так как качеств может быть несколько то указываем []
    rate: Number,
    sex: {type: String, enum: ['male', 'female', 'other']} //enum: один из


	

}, {
    timestamps: true
})

module.exports = model('User', shema)

