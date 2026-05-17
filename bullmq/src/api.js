const express = require('express')
const { emailQueue } = require('./queue.js')

// what's done here ? this file is for producer who will ad the jobs in the queue system
// untimately it's and express app who will on post endpoint using details from post body
// 'add' jobs in queue with few 'configs'

const app = express()
app.use(express.json())

// post endpoint for producer job creation
app.post('/welcome-email', async function(req, res){
    const job = await emailQueue.add("send-welcome-email", 
        {
            to: req.body.to,
            name: req.body.name || "Learner"
        },
        {
            attempts: 3, // max attempts after job crash
            backoff: {
                type: "exponential",
                delay: 5000 // delay after max attempts to retry
            }
        }
    )

    return res.json({
        message: 'welcome email sent to emailqueue',
        JobId: job.id
    })
})

app.listen(3000, function(){
    console.log('server started on http://localhost:3000')
})