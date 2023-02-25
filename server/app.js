const express = require('express')
const mongoose = require('mongoose') // для подключенния удаллено к MongoDB 
const config = require('config')
const chalk = require('chalk')
const initDatabase = require('./start/initDatabase')
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// /api --> 
app.use('/api', routes)

const PORT = config.get('port') ?? 8080

// if (process.env.NODE_ENV === 'production') {
//     console.log(chalk.bgBlueBright('Production'))
// } else {
//     console.log(chalk.bgMagentaBright('Development'))
// }

async function start() {
    try {
        mongoose.connection.once('open', () => {  //обращаемся к соединнению с БД (моногоДБ) единожды (once) 
            initDatabase()
        })
        await mongoose.connect(config.get('mongoUrl'))
        console.log(chalk.cyanBright('MongoDB connected'))
        app.listen(PORT, () => 
        console.log(chalk.green(`Server has started on port ${PORT}...`))
    ) 
    } catch (e) {
        console.log(chalk.red(e.message))
        process.exit(1)
    }
}

start()

