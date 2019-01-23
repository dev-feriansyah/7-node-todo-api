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
    text: 'Second todo',
    completed: true,
    completedAt: 123312
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
    const id = todosSeed[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.result.text).toBe(todosSeed[0].text);
      })
      .end(done);
  });
  it('should get 404 if todo not found', done => {
    const id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
  it('should get 404 if ID given is INVALID', done => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo doc', done => {
    const id = todosSeed[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.result._id).toBe(id);
      })
      .end(err => {
        if(err) {
          return done(err);
        }
        Todo.findById(id).then(todo => {
          expect(todo).toNotExist();
          done();
        }).catch(e => done(e));
      })
  });
  it('should get 404 if no todo removed', done => {
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
  it('should get 404 if ID given is INVALID', done => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update todo', done => {
    const id = todosSeed[0]._id.toHexString();
    const body = {
      text: 'Mocha test -1',
      completed: true
    }
    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.result.text).toBe(body.text);
        expect(res.body.result.completed).toBe(body.completed);
        expect(res.body.result.completedAt).toBeA('number');
      })
      .end(err => {
        if(err) {
          done(err);
        }
        Todo.findById(id).then(todo => {
          expect(todo.text).toBe(body.text);
          expect(todo.completed).toBe(body.completed);
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch(e => done(e));
      })
  });
  it('should clear completedAt when todo is NOT COMPLETED', done => {
    const id = todosSeed[1]._id.toHexString();
    const body = {
      text: 'Mocha test -2',
      completed: false
    }
    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.result.text).toBe(body.text);
        expect(res.body.result.completed).toBe(body.completed);
        expect(res.body.result.completedAt).toNotExist();
      })
      .end(err => {
        if (err) {
          done(err);
        }
        Todo.findById(id).then(todo => {
          expect(todo.text).toBe(body.text);
          expect(todo.completed).toBe(body.completed);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch(e => done(e));
      })
  });
});