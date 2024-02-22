const app = require("../app.js")
const db = require("../db/connection")
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')
require('jest-sorted')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("App.js error handling", () =>{
  test("Should return a 404 if given an endpoint that does not exist", () =>{
    return request(app)
    .get('/api/thisendpointdoesntexist')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Path not found")
    })
  })
})

describe("GET /api/topics", () =>{
  test("Should send an array of topics to the client", () =>{
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((response) => {
      expect(response.body.topics.length).toBe(3)
      response.body.topics.forEach((topic) => {
        expect(typeof topic.description).toBe('string')
        expect(typeof topic.slug).toBe('string')
      })
    })
  })
})

describe("GET /api", () => {
  test("Should return all available endpoints with their descriptions, acceptable queries, formatting and example response", () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      })
  })
})

describe("GET /api/articles", () =>{
  test("Should send an array of articles to the client", () =>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      expect(response.body.articles.length).toBe(13)
      response.body.articles.forEach((article) => {
        expect(Object.keys(article).length).toBe(8)
        expect(typeof article.title).toBe('string')
        expect(typeof article.topic).toBe('string')
        expect(typeof article.author).toBe('string')
        expect(typeof article.comment_count).toBe('string')
        expect(typeof article.created_at).toBe('string')
        expect(typeof article.article_img_url).toBe('string')
        expect(typeof article.article_id).toBe('number')
        expect(typeof article.votes).toBe('number')
        expect(article).not.toHaveProperty('body')
      })
    })
  })
  test("Should be sorted by date descending", () =>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
    })
  })
})

describe("GET /api/articles/:article_id", () =>{
  test("Should send an article object to the client", () =>{
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      expect(response.body.article).toHaveProperty('author')
      expect(response.body.article).toHaveProperty('title')
      expect(response.body.article).toHaveProperty('article_id')
      expect(response.body.article).toHaveProperty('body')
      expect(response.body.article).toHaveProperty('topic')
      expect(response.body.article).toHaveProperty('created_at')
      expect(response.body.article).toHaveProperty('votes')
      expect(response.body.article).toHaveProperty('article_img_url')
    })
  })
  test('Should send an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist')
      })
  })
  test('Should send an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request')
      })
  })
})

describe("GET /api/articles/:article_id/comments", () =>{
  test("Should send an array of comments to the client", () =>{
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBe(11)
      response.body.comments.forEach((comment) => {
        expect(Object.keys(comment).length).toBe(6)
        expect(typeof comment.comment_id).toBe('number')
        expect(typeof comment.votes).toBe('number')
        expect(typeof comment.created_at).toBe('string')
        expect(typeof comment.author).toBe('string')
        expect(typeof comment.body).toBe('string')
        expect(typeof comment.article_id).toBe('number')
      })
    });
  })
  test("Should be sorted by date descending(most recent first)", () =>{
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      expect(response.body.comments).toBeSortedBy('created_at', {descending: true})
    })
  })
  test('Should get a 204 if given a valid, existing id with no comments', () => {
    return request(app)
      .get('/api/articles/10/comments')
      .expect(204)
  })
  test('Should send an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      })
  })
  test('Should send an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      })
  })
})

describe("POST /api/articles/:article_id/comments", () =>{
  test('Should send the posted comment to the client if the username is an existing user', () =>{
    const newComment = {
      username: 'butter_bridge',
      body: 'I like to comment a lot :)'
    }
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) =>{
        const {comment} = response.body
        expect(comment.article_id).toBe(1)
        expect(comment.author).toBe('butter_bridge')
        expect(comment.body).toBe('I like to comment a lot :)')
        expect(comment).toHaveProperty('comment_id')
        expect(comment).toHaveProperty('votes')
        expect(comment).toHaveProperty('created_at')
      })
  })
  test('Should send the posted comment to the client without the extra properties', () =>{
    const newComment = {
      username: 'butter_bridge',
      body: 'I like to comment a lot :)',
      extras: 'This is extra stuff that is not needed!'
    }
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) =>{
        const {comment} = response.body
        expect(comment.article_id).toBe(1)
        expect(comment.author).toBe('butter_bridge')
        expect(comment.body).toBe('I like to comment a lot :)')
        expect(comment).toHaveProperty('comment_id')
        expect(comment).toHaveProperty('votes')
        expect(comment).toHaveProperty('created_at')
        expect(comment).not.toHaveProperty('extras')
      })
  })
  test('Should send an appropriate status and error message when given a valid but non-existent id', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'I like to comment a lot :)'
    }
    return request(app)
    .post('/api/articles/100/comments')
    .send(newComment)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('article does not exist');
    })
  })
  test('Should send an appropriate status and error message when given an invalid id', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'I like to comment a lot :)'
    }
    return request(app)
    .post('/api/articles/Idontexist/comments')
    .send(newComment)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request');
    })
  })
  test('Should send an appropriate status and error message when given a comment with no body', () => {
    const newComment = {
      username: 'butter_bridge'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request');
    })
  })
  test('Should send an appropriate status and error message when given a comment with no username', () => {
    const newComment = {
      body: 'I like to comment a lot :)'
    }
    return request(app)
    .post('/api/articles/Idontexist/comments')
    .send(newComment)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request');
    })
  })
  test('Should send an appropriate status and error message when given a comment with a valid username but it is not in the users database', () => {
    const newComment = {
      username: 'WebsiteSuperCommenter',
      body: 'I like to comment a lot :)'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('username does not exist');
    })
  })
})

describe("PATCH /api/articles/:article_id", () =>{
  test("Should send an article object to the client with the correct properties of an article", () =>{
    const newVotes = {
      inc_votes: 100
    }
    return request(app)
    .patch('/api/articles/1')
    .send(newVotes)
    .expect(200)
    .then((response) => {
      const {article} = response.body
      expect(article).toHaveProperty('author')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('article_id')
      expect(article).toHaveProperty('body')
      expect(article).toHaveProperty('topic')
      expect(article).toHaveProperty('created_at')
      expect(article).toHaveProperty('votes')
      expect(article).toHaveProperty('article_img_url')
    })
  })
  test("Should send the correctly updated article to the client", () =>{
    const newVotes = {
      inc_votes: 100
    }
    return request(app)
    .patch('/api/articles/1')
    .send(newVotes)
    .expect(200)
    .then((response) => {
      expect(response.body.article.votes).toBe(200)
    })
  })
  test("Should send the correctly updated article to the client if the votes are negative", () =>{
    const newVotes = {
      inc_votes: -10
    }
    return request(app)
    .patch('/api/articles/1')
    .send(newVotes)
    .expect(200)
    .then((response) => {
      expect(response.body.article.votes).toBe(90)
    })
  })
  test('Should send an appropriate status and error message when given a valid but non-existent id', () => {
    const newVotes = {
      inc_votes: 100
    }
    return request(app)
    .patch('/api/articles/100')
    .send(newVotes)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('article does not exist')
    })
  })
  test('Should send an appropriate status and error message when given a valid key but invalid value for votes', () => {
    const newVotes = {
      inc_votes: "this is wrong"
    }
    return request(app)
    .patch('/api/articles/1')
    .send(newVotes)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request')
    })
  })
  test('Should send an appropriate status and error message when given an invalid id', () => {
    const newVotes = {
      inc_votes: 100
    }
    return request(app)
      .patch('/api/articles/not-an-article')
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      })
  })
  test('Should send an appropriate status and error message when given an invalid object', () => {
    const newVotes = {
      this_is: "wrong"
    }
    return request(app)
    .patch('/api/articles/1')
    .send(newVotes)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request');
    })
  })
})

describe("DELETE /api/comments/:comment_id", () =>{
  test("Should receive a status 204 with no content", () =>{
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        const comment = [response.body];
        expect(Object.keys(comment[0]).length).toBe(0);
      })
  })
  test("Should send an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      })
  })
  test("Should send an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      })
  })
})

describe("GET /api/users", () =>{
  test("Should send an array of users to the client", () =>{
    return request(app)
    .get('/api/users')
    .expect(200)
    .then((response) => {
      expect(response.body.users.length).toBe(4)
      response.body.users.forEach((user) => {
        expect(typeof user.username).toBe('string')
        expect(typeof user.name).toBe('string')
        expect(typeof user.avatar_url).toBe('string')
      })
    })
  })
})