let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

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
  describe('/POST users', () => {
    it('it should POST a user', (done) => {
      chai.request(server)
        .post('/users')
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });
});
