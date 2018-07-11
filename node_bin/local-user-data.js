const User = require('../api/models/user.js')
const mongoose = require('mongoose')
const faker = require('faker')
const count = process.argv[2]

// connect to mongodb
mongoose.connect('mongodb://localhost/ultimatebabysitter')

for (var i = 0; i < count; i++) {
  var type = ['babysitter', 'parent']
  var streetName = faker.address.streetName()
  var streetAddress = faker.address.streetAddress()
  var fiveDigitZip = faker.address.zipCode()
  if (fiveDigitZip.length > 5) {
    fiveDigitZip = fiveDigitZip.slice(0, 5);
  }

  var user = new User({
    "_id": new mongoose.Types.ObjectId(),
  	"first_name": faker.name.firstName(),
  	"last_name": faker.name.lastName(),
  	"email": faker.internet.email(),
  	"age": Math.floor(Math.random()*(65-18+1)+18),
  	"phone": faker.phone.phoneNumber(),
  	"address1": streetAddress + ' ' + streetName,
  	"address2": faker.address.secondaryAddress(),
  	"city": faker.address.city(),
  	"state": faker.address.state(),
  	"zip": fiveDigitZip,
  	"type": type[Math.floor(Math.random()*(1-0+1)+0)],
  	"pay": Math.floor(Math.random()*(25-8+1)+8),
  	"details": faker.lorem.sentence(),
  	"password": "JU&^%Slkjl8ijoij8jij3oa"
  })
  user.save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    })
}
