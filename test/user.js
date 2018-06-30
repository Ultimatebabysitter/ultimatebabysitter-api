process.env.NODE_ENV = 'test'

require('dotenv').config()

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
const User = require('../api/models/user')
let token
let userId
let otherUserId

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
        otherUserId = res.body.user._id
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('user')
        res.body.user.should.be.a('object')
        res.body.user.should.have.property('_id')
        res.body.user.should.have.property('first_name')
        res.body.user.should.have.property('last_name')
        res.body.user.should.have.property('email')
        res.body.user.should.have.property('age')
        res.body.user.should.have.property('address1')
        res.body.user.should.have.property('address2')
        res.body.user.should.have.property('city')
        res.body.user.should.have.property('state')
        res.body.user.should.have.property('zip')
        res.body.user.should.have.property('type')
        res.body.user.should.have.property('pay')
        res.body.user.should.have.property('details')
        res.body.user.should.have.property('verification')
        res.body.user.should.have.property('password')
      })
    chai.request(server)
      .post('/users')
      .send({'first_name': 'Albert',
        'last_name': 'Einstein',
        'email': 'einstein.fake@gmail.com',
        'age': 76,
        'address1': '54321 Westway',
        'address2': '',
        'city': 'Tampa',
        'state': 'FL',
        'zip': '33609',
        'type': 'babysitter',
        'pay': 0,
        'details': 'Developed a general theory of babysitting.',
        'verification': 'NULL',
        'password': 'JU&^%Slkjl8ijoij8jij3oa'
      })
      .end(function (err, res) {
        userId = res.body.user._id
        res.body.user.first_name.should.equal('Albert')
        res.body.user.last_name.should.equal('Einstein')
        res.body.user.email.should.equal('einstein.fake@gmail.com')
        res.body.user.age.should.equal(76)
        res.body.user.address1.should.equal('54321 Westway')
        res.body.user.address2.should.equal('')
        res.body.user.city.should.equal('Tampa')
        res.body.user.state.should.equal('FL')
        res.body.user.zip.should.equal('33609')
        res.body.user.type.should.equal('babysitter')
        res.body.user.pay.should.equal(0)
        res.body.user.details.should.equal('Developed a general theory of babysitting.')
        res.body.user.verification.should.equal('NULL')
        done()
      })
  })

  it('should get a user at /users/:userId GET', function (done) {
    chai.request(server)
      .get('/users/' + userId)
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('_id')
        res.body.should.have.property('first_name')
        res.body.should.have.property('last_name')
        res.body.should.have.property('email')
        res.body.should.have.property('age')
        res.body.should.have.property('address1')
        res.body.should.have.property('address2')
        res.body.should.have.property('city')
        res.body.should.have.property('state')
        res.body.should.have.property('zip')
        res.body.should.have.property('type')
        res.body.should.have.property('pay')
        res.body.should.have.property('details')
        res.body.should.have.property('verification')
        res.body.should.have.property('password')
        res.body.first_name.should.equal('Albert')
        res.body.last_name.should.equal('Einstein')
        res.body.email.should.equal('einstein.fake@gmail.com')
        res.body.age.should.equal(76)
        res.body.address1.should.equal('54321 Westway')
        res.body.address2.should.equal('')
        res.body.city.should.equal('Tampa')
        res.body.state.should.equal('FL')
        res.body.zip.should.equal('33609')
        res.body.type.should.equal('babysitter')
        res.body.pay.should.equal(0)
        res.body.details.should.equal('Developed a general theory of babysitting.')
        res.body.verification.should.equal('NULL')
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
