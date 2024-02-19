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