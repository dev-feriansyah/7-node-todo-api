const expect  = require('expect'),
      request = require('supertest');

const {app}  = require('./../server'),
      {Todo} = require('./../models/todo');


beforeEach(done => {
  Todo.deleteMany({}).then(() => done());
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

        Todo.find().then(todos => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch(e => done(e));

      })

  });

});