process.env.NODE_ENV = 'test'
process.env.TWILIO_ACTIVE = 'false'

require('dotenv').config()

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
const User = require('../api/models/user')
const Rating = require('../api/models/rating')
let token
let userId
let otherUserId
let ratingId

chai.use(chaiHttp)

describe('User Tests\n', () => {
  User.collection.drop()

  it('should add 2 users at /users POST', function (done) {
    chai.request(server)
      .post('/users')
      .send({'first_name': 'Bertrand',
        'last_name': 'Russell',
        'email': 'brussell.fake@gmail.com',
        'age': 97,
        'phone': '+18135551234',
        'address1': '12345 England Ct',
        'address2': '',
        'city': 'Tampa',
        'state': 'FL',
        'zip': '33543',
        'type': 'babysitter',
        'pay': 0,
        'details': 'A founder of analytic babysitting.',
        'verification': 'NULL',
        'password': 'JU&^%Slkjl8ijoij8jij3oa'
      })
      .end(function (err, res) {
        otherUserId = res.body.id
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('first_name')
        res.body.should.have.property('age')
        res.body.should.have.property('city')
        res.body.should.have.property('pay')
        res.body.should.have.property('details')
      })
    chai.request(server)
      .post('/users')
      .send({'first_name': 'Albert',
        'last_name': 'Einstein',
        'email': 'einstein.fake@gmail.com',
        'age': 76,
        'phone': '+18135559876',
        'address1': '54321 Westway',
        'address2': '',
        'city': 'Tampa',
        'state': 'FL',
        'zip': '33609',
        'type': 'babysitter',
        'pay': 10,
        'details': '<script>bla</script>Developed a general theory of babysitting.',
        'verification': 'NULL',
        'password': 'JU&^%Slkjl8ijoij8jij3oa'
      })
      .end(function (err, res) {
        userId = res.body.id
        res.body.first_name.should.equal('Albert')
        res.body.age.should.equal(76)
        res.body.city.should.equal('Tampa')
        res.body.pay.should.equal(10)
        res.body.details.should.equal('Developed a general theory of babysitting.')
        done()
      })
  })

  it('should authenticate user at /users/authenticate POST', function (done) {
    chai.request(server)
      .post('/users/authenticate')
      .send({'email': 'einstein.fake@gmail.com', 'password': 'JU&^%Slkjl8ijoij8jij3oa'})
      .end(function (err, res) {
        token = res.body.token
        res.should.have.status(201)
        res.should.be.json
        res.body.message.should.equal('auth worked')
        done()
      })
  })

  it('should rate a babysitter POST', function (done) {
    chai.request(server)
      .post('/ratings')
      .set('Authorization', 'Bearer ' + token)
      .send({
      	"rating": "4",
      	"user": otherUserId,
      	"reporting_user": userId
      })
      .end(function (err, res) {
        ratingId = res.body._id
        res.should.have.status(201)
        res.should.be.json
        done()
      })
  })

  it('should find a babysitters rating', function(done) {
    chai.request(server)
      .get('/ratings/' + otherUserId)
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.count.should.equal(1)
        res.body.average.should.equal(4)
        res.body.ratings[0].rating.should.equal(4)
        done()
      })
  })

  it('should delete a rating at /ratings/:ratingId DELETE', function (done) {
    chai.request(server)
      .delete('/ratings/' + ratingId)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        done()
      })
  })

  it('should get a user at /users/:userId GET', function (done) {
    chai.request(server)
      .get('/users/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('first_name')
        res.body.should.have.property('age')
        res.body.should.have.property('city')
        res.body.should.have.property('pay')
        res.body.should.have.property('details')
        res.body.first_name.should.equal('Albert')
        res.body.age.should.equal(76)
        res.body.city.should.equal('Tampa')
        res.body.pay.should.equal(10)
        res.body.details.should.equal('Developed a general theory of babysitting.')
        done()
      })
  })

  it('should update the age of the user at /users/:userId PATCH', function (done) {
    chai.request(server)
      .patch('/users/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .send([
        {
          'propName': 'age',
          'value': 26
        }
      ])
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        done()
      })
  })

  it('should FAIL to update the age of another user at /users/:userId PATCH', function (done) {
    chai.request(server)
      .patch('/users/' + otherUserId)
      .set('Authorization', 'Bearer ' + token)
      .send([
        {
          'propName': 'age',
          'value': 26
        }
      ])
      .end(function (err, res) {
        res.should.have.status(401)
        res.should.be.json
        done()
      })
  })

  it('should find users within a certain distance at /users/distance/:distance GET', function (done) {
    chai.request(server)
      .get('/users/distance/25')
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.numberOfUsers.should.equal(1)
        res.body.users[0].should.have.property('name')
        res.body.users[0].should.have.property('zip')
        res.body.users[0].should.have.property('email')
        done()
      })
  })

  it('should list ALL users at /users GET', function (done) {
    chai.request(server)
      .get('/users')
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.users.should.be.a('array')
        res.body.users[0].should.have.property('email')
        res.body.users[0].should.have.property('zip')
        res.body.users[0].should.have.property('_id')
        res.body.count.should.equal(2)
        done()
      })
  })

  it('should delete a user at /users/:userId DELETE', function (done) {
    chai.request(server)
      .delete('/users/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        done()
      })
  })

  it('should FAIL to delete another user at /users/:userId DELETE', function (done) {
    chai.request(server)
      .delete('/users/' + otherUserId)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        res.should.have.status(401)
        res.should.be.json
        done()
      })
  })
})
