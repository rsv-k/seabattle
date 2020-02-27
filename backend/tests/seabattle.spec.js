const request = require('supertest');
const UserInfo = require('../schemas/userInfo');
const {createShips} = require('../modules/seabattle');

let server;

describe('/api/seabattle', () => {
  beforeEach(() => {
    server = require('../../server');
  });

  afterEach(() => {
    // clear db
    UserInfo.deleteMany({})
      .then(() => {
        server.close();
      })
  });
  
  describe('GET /:id', () => {
    it ('should return userInfo if valid id is passed', (done) => {
      // prepopulate db with a dummy doc
      const userInfo = new UserInfo({
        ships: createShips(),
        shotCells: [],
        history: ['New game Started']
      });

      userInfo.save()
        .then((res) => {
          return request(server).get('/api/seabattle/' + res._id);
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('msg', 'userInfo fetched successfully');
          done();
        });
    });

    it ('should return 404 if invalid id is passed', (done) => {
      request(server).get('/api/seabattle/1')
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty('msg', 'userInfo not found');
          done();
        });
    });
  });

  describe('Delete /:id', () => {
    it ('should return updated userInfo if valid id is passed', (done) => {
      // prepopulate db with a dummy doc
      const userInfo = new UserInfo({
        ships: createShips(),
        shotCells: [],
        history: ['About to begin a new game']
      });

      userInfo.save()
        .then((res) => {
          return request(server).delete('/api/seabattle/' + res._id);
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('msg', 'New game started');
          expect(res.body.data.history.length).toBe(2);
          expect(res.body.data.history).toContain('New game started');
          done();
        });
    });

    it ('should return new userInfo if invalid id is passed', (done) => {
      request(server).delete('/api/seabattle/1')
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('msg', 'New game started');
          expect(res.body.data.history.length).toBe(1);
          expect(res.body.data.history).toContain('New game started');
          done();
        });
    });
  });

  describe('Put /', () => {
    it ('should return 400 if no userInfo provided', (done) => {
      request(server).put('/api/seabattle/', {})
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('msg', 'No content provided');
          done();
        });
    });

    it ('should return 404 if invalid id is provided', (done) => {
      request(server).put('/api/seabattle/').send({updatedUserInfo: {_id: 1}})
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty('msg', 'userInfo is not found');
          done();
        });
    });
    
    it ('should return 200 if valid userInfo is provided', (done) => {
      // prepopulate db with a dummy doc
      const userInfo = new UserInfo({
        ships: createShips(),
        shotCells: [],
        history: ['New game Started']
      });

      userInfo.save()
      .then((res) => {
        res.history.push('User shot x: 0, y: 0. Result: 1');
        return request(server).put('/api/seabattle/').send({updatedUserInfo: res})
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('msg', 'userInfo successfully updated');
        done();
      });
    });
  });

});