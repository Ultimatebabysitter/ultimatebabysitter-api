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
      .send({"first_name": "Albert",
        "last_name": "Einstein",
        "email": "einstein.fake@gmail.com",
        "age": 35,
        "address1": "54321 Westway",
      	"address2": "",
        "city": "Tampa",
        "state": "FL",
        "zip": "33609",
        "type": "babysitter",
        "pay": 0,
      	"details": "admin account",
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

  it('should list ALL users on /users GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200)
        res.should.be.json
        res.body.users.should.be.a('array')
        done()
      })
  })

})
