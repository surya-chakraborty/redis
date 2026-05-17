const { Worker } = require('bullmq')
const { connection } = require('./queue.js')

// What this file consist of ? worker code, made from worker object of bullmq with name, connection and job simulation
// then on complted or failed mission

const worker = new Worker(
    "emails",
    // processor code 
    async function(job){
        console.log("processing email jobs", job.id, job.name, job.data)
        
        await new Promise((resolve) => setTimeout(resolve, 1500))

        console.log("Email job completed!", job.id, job.name, job.data)
        
    },
    {   
        connection,
        concurrency: 5
    }
)

worker.on("completed", function(job){
    console.log("Job Completed!", job.id, job.name, job.data)
})

worker.on("failed", function(job, err){
    console.log("Job failed!", job.id, job.name, job.data)
    console.log(err.message)
})

/*
On successful job conpleteion here's the logs on console :
processing email jobs 2 send-welcome-email { to: 'test@gmail.com', name: 'Surya' }
Email job completed! 2 send-welcome-email { to: 'test@gmail.com', name: 'Surya' }
Job Completed! 2 send-welcome-email { to: 'test@gmail.com', name: 'Surya' }

If for any reason job crashes the  it will retyr 3 times hence 3 set of logs.
*/