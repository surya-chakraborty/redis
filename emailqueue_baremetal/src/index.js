const express = require('express')
const Redis = require('ioredis')

const app = express()
const redis = new Redis('redis://localhost:6379')
const QUEUE_KEY = "queue:emails"
app.use(express.json())

/*
What we need to do ? create a 'manual email queue' with listed jobs with redis-lists to understand the limitations.
'queues' are just data structure same as array where multiple 'jobs' takes place which push from one side and pop from another.
using left side for pusha dn right side for pop

What are the probelms in manual mode ?
1. If any job crashes after pop, no retry mechanism
2. No patrallel workers (background workers)
3. can't give weight to ceratin jobs for faster consumption

Cgeck queue sequence on redis-cli : 
> docker exec -it redis-store redis-cli
> LRANGE queue:emails 0 -1
*/

// create job task and push on redis queue
app.post('/emails', async function(req, res){
    const job = {
        to: req.body.to,
        subject: req.body.subject || "No Subject",
        body: req.body.emailBody || 'No Content',
        createdAt: new Date().toISOString()
    }

    // producer
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    res.json({
        queued: true,
        job
    })
})

// consume the job process with one entity (not multiple job simulation)
app.get('/emails/process-one', async function (req, res){
    // consumer
    const rawJob = await redis.rpop(QUEUE_KEY)
    console.log(rawJob)
    if(!rawJob){
        return res.json({
            message: 'No job present in the queue'
        })
    }
    const job = JSON.parse(rawJob)
    res.json({
        message: "email sent",
        job
    })
})

app.listen(3000, () => {
    console.log(`server started on: http://localhost:3000`)
})