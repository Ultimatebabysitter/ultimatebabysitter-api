let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Users', () => {
  // Test the /GET route
  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
          .get('/users')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
  });

  // Test the /POST route
  let userSample = {
    "name": "Bertrand",
    "age": 70,
    "location": "123 mockingbird lane",
    "type": "parent",
    "pay": "10, 15",
    "details": "Looking for a babysitter"
  }
  describe('/POST users', () => {
    it('it should POST a user', (done) => {
      chai.request(server)
        .post('/users')
        .send(userSample)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.user.should.be.an('object');
          expect(res.body.user).to.have.all.keys('name', 'age', 'location', 'type', 'pay', 'details');
          done();
        });
    });
  });
});
