// 1. У любого пользователя в БД будет как минимум qualities & professions
// 2.  Они равны mock данным

// через модели взаимодествуем с БД

const Profession = require('../models/Profession')
const Quality = require('../models/Quality')
const professionsMock = require('../mock/professions.json')
const qualitiesMock = require('../mock/qualities.json')


module.exports = async () => {
  const professions = await Profession.find() // find всегда возвращает массив

  if (professions.length !== professionsMock.length) {
   await createInitialEntity(Profession, professionsMock)
  }

  const qualities = await Quality.find()

  if (qualities.length !== qualitiesMock.length) {
    await createInitialEntity(Quality, qualitiesMock)
   }
  
}

async function createInitialEntity(Model, data) {
    await Model.collection.drop()                   // предворительно очищаем колекцию
    return Promise.all(
        data.map(async item => {
            try {
                delete item._id
                const newItem = new Model(item)
                await newItem.save()
                return newItem
            } catch (e) {
                return e
            }
        })
    )
}