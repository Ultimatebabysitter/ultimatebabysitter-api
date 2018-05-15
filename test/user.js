process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()
let User = require("../api/models/user")

chai.use(chaiHttp)

describe('Users', function() {

  User.collection.drop()

  describe('Users', () => {
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

  it('should add a SINGLE user on /users POST', function(done) {
    chai.request(server)
      .post('/users')
      .send({"first_name": "Bertrand",
        "last_name": "Russell",
        "email": "brussel.sprout.fake@gmail.com",
        "age": 35,
        "address1": "12345 Mockingbird Ln",
      	"address2": "",
      	"city": "Wesley Chapel",
      	"state": "FL",
      	"zip": "33543",
        "type": "admin",
        "pay": 0,
      	"details": "admin account",
      	"verification": "NULL",
      	"password": "JU&^%Slkjlkjelskjdf3oa"
      })
      .end(function(err, res){
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('user')
        res.body.user.should.be.a('object')
        res.body.user.should.have.property('first_name')
        res.body.user.should.have.property('last_name')
        res.body.user.should.have.property('_id')
        res.body.user.first_name.should.equal('Bertrand')
        res.body.user.last_name.should.equal('Russell')
        done()
      })
  })

})
