const express = require('express')
const mongoose = require('mongoose')
const Redis = require('ioredis')

const app = express()

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
const url = process.env.MONGO_URL || 'mongodb://localhost:27017/mongo-database'
/*
What to learn : redis instace creation and ping method , mainly setup with docker compose
*/
app.get('/redis', async(req, res) => {
    const reply = await redis.ping()
    res.json({
        redis: reply
    })
})

app.get('/mongo', async(req, res) => {
    await mongoose.connect(url)
    res.json({
        message: 'connected',
        database: mongoose.connection.name
    })
})

app.listen(3000, (err) => {
    console.log('Srever staretd at post: 3000')
})