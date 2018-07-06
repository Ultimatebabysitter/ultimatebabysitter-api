require('dotenv').config()
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// sends an sms with a 4 digit number
exports.send_sms_code = (phoneNum, randomNum) => {
  client.messages.create({
    to: phoneNum,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Weclome to UltimateBabysitter. Your auth code is: ${randomNum}`
   })
  .then((message) => console.log(message.sid));
}

// used for testing; process.env.MY_PHONE_NUMBER is your twilio verified number
exports.test_sms_code = (phoneNum) => {
  client.messages.create({
    to: process.env.MY_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Weclome to UltimateBabysitter. Your auth code is: ${val}`
   })
  .then((message) => console.log(message.sid));
}
