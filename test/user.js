process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()
let User = require("../api/models/user")

chai.use(chaiHttp)

describe('User Tests\n', () => {

  User.collection.drop()

  it('should add a SINGLE user on /users POST', function(done) {
    chai.request(server)
      .post('/users')
      .send({"first_name": "Bertrand",
        "last_name": "Russell",
        "email": "brussell.fake@gmail.com",
        "age": 97,
        "address1": "12345 England Ct",
        "address2": "",
        "city": "Tampa",
        "state": "FL",
        "zip": "33543",
        "type": "babysitter",
        "pay": 0,
        "details": "A founder of analytic babysitting.",
        "verification": "NULL",
        "password": "JU&^%Slkjl8ijoij8jij3oa"
      })
      .end()
    chai.request(server)
      .post('/users')
      .send({"first_name": "Albert",
        "last_name": "Einstein",
        "email": "einstein.fake@gmail.com",
        "age": 76,
        "address1": "54321 Westway",
      	"address2": "",
        "city": "Tampa",
        "state": "FL",
        "zip": "33609",
        "type": "babysitter",
        "pay": 0,
        "details": "Developed a general theory of babysitting.",
      	"verification": "NULL",
        "password": "JU&^%Slkjl8ijoij8jij3oa"
      })
      .end(function(err, res) {
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('user')
        res.body.user.should.be.a('object')
        res.body.user.should.have.property('first_name')
        res.body.user.should.have.property('last_name')
        res.body.user.should.have.property('_id')
        res.body.user.first_name.should.equal('Albert')
        res.body.user.last_name.should.equal('Einstein')
        done()
      })
  })

  it('should get a user on /users/:userId', function(done) {
    User.findOne({ 'last_name': 'Einstein' }, '_id', function (err, user) {
      if (err) return handleError(err)
      chai.request(server)
        .get('/users/' + user._id)
        .end(function(err, res) {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('first_name')
          res.body.should.have.property('last_name')
          res.body.should.have.property('_id')
          res.body.first_name.should.equal('Albert')
          res.body.last_name.should.equal('Einstein')
          done()
        })
    })
  })

  it('should authenticate user on /users/authenticate POST', function(done) {
    chai.request(server)
      .post('/users/authenticate')
      .send({"email": "einstein.fake@gmail.com", "password": "JU&^%Slkjl8ijoij8jij3oa"})
      .end(function(err, res) {
        res.should.have.status(201)
        res.should.be.json
        res.body.message.should.equal('auth worked')
        done()
      })
  })

  it('should update the age of the user on /users/:userId PATCH', function(done) {
    User.findOne({ 'last_name': 'Einstein' }, '_id', function (err, user) {
      if (err) return handleError(err)
      chai.request(server)
        .patch('/users/' + user._id)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVpbnN0ZWluLmZha2VAZ21haWwuY29tIiwiemlwIjoiMzM2MDkiLCJ1c2VySWQiOiI1YjEwNWRiNTM2ZmVjMjEzOTNlY2VmZDgiLCJpYXQiOjE1Mjc3OTkyMjEsImV4cCI6MTUyNzgwMjgyMX0.MK3BiITthNNYecF_rAEanaff5aCc2KlTzd84pkyAi2s')
        .send([
          {
            "propName": "age",
            "value": 26
          }
        ])
        .end(function(err, res) {
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })

  it('should find users within a certain distance on the /users/distance/:distance GET', function(done) {
    done()
  })

  it('should list ALL users on /users GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200)
        res.should.be.json
        res.body.users.should.be.a('array')
        res.body.users[0].should.have.property('email')
        res.body.users[1].should.have.property('email')
        res.body.count.should.equal(2)
        done()
      })
  })

  it('should delete a user on /users/:userId DELETE', function(done) {
    User.findOne({ 'last_name': 'Einstein' }, '_id', function (err, user) {
      if (err) return handleError(err)
      chai.request(server)
        .delete('/users/' + user._id)
        .end(function(err, res) {
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })

})
