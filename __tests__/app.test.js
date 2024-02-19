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
    });
  })
})

describe("GET /api", () => {
  test("Should return all available endpoints with their descriptions, acceptable queries, formatting and example response", () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      });
  });
});

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
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('Should send an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
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
    });
  })
  test("Should be sorted by date descending", () =>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
    });
  })
})