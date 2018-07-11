require('dotenv').config()
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// sends an sms with a 4 digit number
exports.send_sms_code = (phoneNum, randomNum) => {
  client.messages.create({
    to: phoneNum,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Weclome to UltimateBabysitter. Your auth code is: ${randomNum}`
  })
  .then((message) => console.log(message.sid))
  .catch((err) => console.log(err))
}
