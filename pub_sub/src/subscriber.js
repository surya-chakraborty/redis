const Redis = require('ioredis')

const subscriber = new Redis('redis://localhost:6379/')

subscriber.subscribe('notifications', function(err){
    if(err){
        console.log("some error ocuured: ", err.message)
    }
    console.log("Subscribe Successfully!")
})

subscriber.on("message", function(channel, message){
    console.log("Received On ", channel, ": ", JSON.parse(message))
})
