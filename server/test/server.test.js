const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}  = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const seed   = require('./seed/seed');

beforeEach(seed.populateUsers);
beforeEach(seed.populateTodos);

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
    const id = seed.todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.result.text).toBe(seed.todos[0].text);
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
    const id = seed.todos[0]._id.toHexString();
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
    const id = seed.todos[0]._id.toHexString();
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
    const id = seed.todos[1]._id.toHexString();
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

describe('GET /users/me', () => {
  it('should return user that authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', seed.users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(seed.users[0]._id.toHexString());
        expect(res.body.email).toBe(seed.users[0].email);
      })
      .end(done);
  });
  it('should NOT return user if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => expect(res.body).toEqual({}))
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'test@example.com';
    const password = 'test123';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if(err) return done(err);
        User.findOne({email}).then(user => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch(e => done(e));
      })
  });
  it('should NOT create user when email and password is INVALID', done => {
    const email = 'invalidemail.com';
    const password = 'nope' // min 6
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(err => {
        if(err) return done(err);
        User.findOne({email}).then(user => {
          expect(user).toNotExist();
          done();
        }).catch(e => done(e));
      })
  });
  it('should NOT create user when email already EXIST', done => {
    const email = seed.users[0].email;
    const password = 'validpassword';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(err => {
        if(err) return done(err);
        User.find({email}).then(users => {
          expect(users.length).toBe(1);
          done();
        }).catch(e => done(e));
      })
  });
});