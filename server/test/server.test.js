const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}  = require('./../server');
const {Todo} = require('./../models/todo');

const todosSeed = [
  {
    _id: new ObjectID(),
    text: 'First todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second todo'
  }
];

beforeEach(done => {
  Todo
    .deleteMany({})
    .then(() => {
      return Todo.insertMany(todosSeed);
    })
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create todo document in database', done => {
    const text = 'Mocha testing todo';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end(err => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });
  it('should NOT create todo and response with 400 Code', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end(err => {
        if(err) {
          return done(err);
        }
        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos in database', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.results.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todosSeed[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.result.text).toBe(todosSeed[0].text);
      })
      .end(done);
  });
  it('should get 404 if todo not found', done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it('should get 404 if ID given is not valid', done => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});