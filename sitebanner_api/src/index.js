const express = require('express')
const Redis = require('ioredis')

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
const BANNER_KEY = "app:banner"

/*
What to learn : redis key value pair set, get and del, if exists check in db.
*/

app.post('/banner', async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to redis store learning camp!")
    res.send({
        success: true
    })
})

app.get('/banner', async (req, res) => {
    const message = await redis.get(BANNER_KEY)
    res.send({
        message: message
    })
})

app.delete('/banner', async (req, res) => {
    await redis.del(BANNER_KEY)
    res.send({
        success: true
    })
})

// checks if key exits in db or not, even if maybe avaiavle in redis
app.get('/banner/exists', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY)
    console.log(exists)
    res.send({
        exists: Boolean(exists)
    })
})


app.listen(3000, (err) => {
    if(err){
        console.log('err: ', err)
    }
    console.log('server stared at post: 3000')
})