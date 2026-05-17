const { Queue } = require('bullmq')

// What's in this file ? Queue creation with name and connection
// and finally export the emailqueue and connection

const connection = {
    host: 'localhost',
    port: 6379
}

const emailQueue = new Queue("emails", { connection })

module.exports = {
    emailQueue,
    connection
}