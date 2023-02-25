const {Schema, model} = require('mongoose')

const shema = new Schema({
    content: { type: String, required: true },
    // На чьей странице находится коментарий
    pageId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ref - связь между колекциеей 
    // айди человеко которфй оставил уоментарий
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
}, {
    timestamps: { createdAt: 'created_at'} // меняем ключ на 'снижнем подчеркиванием'
})

module.exports = model('Comment', shema)

content: string
pageId: 
userId: string
