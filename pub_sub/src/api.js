const express = require('express')
const Redis = require('ioredis')

const app = express()
app.use(express.json())
/*
What is pub sub: notification delivary system based on publishers
on channels on which diffrent subscribers listens (active or inactive)

simply, redis can be itself without any dependencies used as a pub-sub model
it has some methods as publish adn subscribe and some event handlers like on message etc.

we need to create mutiple channel and subscribers and subscribe then on diffrent channels

we need to create two main file - subscriber redis code ans publisherb + backend code on api.js


For testing: we have only one subscriber right now
> start bothe node process : node subscriber.js , node api.js
> POST request on http://localhost:3000/notifications
> request body :
{
    "title" : "Order received",
    "message": "order received by customer"
}
response back : {
    "message": "Notification sent to 1 subscribers"
}
    
> subscriber.js logs :
Subscribe Successfully!
Received On  notifications :  {
  title: 'Order received',
  message: 'order received by customer',
  createdAt: '2026-05-18T17:39:05.163Z'
}

*/
const publisher = new Redis('redis://localhost:6379/')

app.post('/notifications', async function(req, res){
    const payload = {
        title: req.body.title || "Default title",
        message: req.body.message || "Hello World",
        createdAt: new Date().toISOString()
    }

    const receivers = await publisher.publish(
        "notifications",
        JSON.stringify(payload)
    )

    res.json({
        message: `Notification sent to ${receivers} subscribers`
    })

})

app.listen(3000, function(){
    console.log(`server started on: http://localhost:3000`)
})