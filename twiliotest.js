require('dotenv').config()
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
var val = Math.floor(1000 + Math.random() * 9000);

client.messages.create({
  to: process.env.MY_PHONE_NUMBER,
  from: process.env.TWILIO_PHONE_NUMBER,
  body: `Your auth code is: ${val}`
 })
.then((message) => console.log(message.sid));
