const express = require('express')
const Redis = require('ioredis')

const app = express()
app.use(express.json())
const redis = new Redis('redis://localhost:6379/')

// store userprofile(object) in two ways : 
// 1. from json req body -> string in a single key, the pronblem is when we need to update it , we have to replace the whole string, not a single field
// 2. hashmaps , we can update individual fields no conversions needed 
// methods are : hset, hgetAll, hget, hexists, hverify etc.

// post endpoint to set userprofile as string to key
app.post('/user/:id/json', async function(req, res){
    console.log(JSON.stringify(req.body))
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body))
    res.json({
        message: 'saved as json'
    })
})

// get endpoint to get json string as json back
app.get('/user/:id/json', async function(req, res){
    const userProfile = await redis.get(`user:${req.params.id}:json`)
    console.log(userProfile)
    res.json({
        user: userProfile ? JSON.parse(userProfile) : null
    })
})

// post endpoint for hashmap store in key
app.post('/user/:id/hash', async function(req, res){
    await redis.hset(`user:${req.params.id}:json`, req.body)
    res.json({
        message: 'saved as hash'
    })
})

// get endpoint for hashmap userProfile
app.get('/user/:id/hash', async function(req, res){
    const userProfile = await redis.hgetall(`user:${req.params.id}:json`)
    res.json({
        user: userProfile
    })
})

app.listen(3000, function(){
    console.log(`server started on http://localhost:3000`)
})