const express = require('express')
const Redis = require('ioredis')

const app = express()
app.use(express.json())
const redis = new Redis()

// PS : Otp verfication with ttl metadata of redis
// Intotal 3 routes: getOtp, verify/otp, getTTl

function getOtpKey(phone){
    return `otp:${phone}`
}

// post endpoint to get otp key by sending a phone no
app.post('/getotp', async function(req, res){
    const { phone }= req.body
    const getKey = getOtpKey(phone)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(otp, ": " , phone)

    await redis.set(getKey, otp, 'EX', 50)

    // In reaql send the otp via SMS / Mail
    res.json({
        message: `otp sent: ${otp}`
    })
})

// post endpoint to verify otp with req body phone and otp with the otp stored in redis
app.post('/otp/verify', async function(req, res){
    const {phone, otp} = req.body
    const savedOtp = await redis.get(getOtpKey(phone))

    if(!savedOtp){
        return res.json({
            message: 'Otp key not found or expired'
        })
    }
    if(savedOtp != otp){
        return res.json({
            message: 'Otp not matched, please try again later!'
        })
    }
    await redis.del(getOtpKey(phone))
    res.json({
        message: 'otp matched, you can login now'
    })

})

// get endpoint to check ttl time for phone otp
app.get('/otp/:phone/ttl', async function(req, res){
    const phone = req.params.phone
    const ttl = await redis.ttl(getOtpKey(phone))
    console.log(ttl)
    if(ttl == -2){
        return res.json({
            message: 'ttl time expired for otp'
        })
    }
    res.json({
        message: `otp valid for ${ttl} seconds`
    })
})

app.listen(3000, function(){
    console.log(`server started on http://localhost:3000`)
})