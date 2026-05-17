const { Worker } = require('bullmq')
const { connection } = require('./queue.js')
const { Resend } = require('resend')
require('dotenv').config()


// What this file consist of ? worker code, made from worker object of bullmq with name, connection and job simulation
// then on complted or failed mission

// updated the code structiure mainly in the processor section for real email jobs using resend.com
const resend = new Resend(process.env.RESEND_API_KEY)

const worker = new Worker(
    "emails",
    // processor code 
    async function(job){
        console.log("processing email jobs", job.id)
        
        // await new Promise((resolve) => setTimeout(resolve, 1500))
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: job.data.to,
            subject: 'Welcome to bull mq real email job queue list, well done!',
            html: `
                <h1>Hello ${job.data.name}</h1>
                
                <p>You have got this mail as you succefully been sent the email via email job queue made by surya chakraborty with the help of 'resend.com'
                <br>
                For more information contact: surya chakraborty
                <br>
                you already got his number!!
                </p>
            `
        })

        console.log("Email sent!", response.data?.id)
        
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