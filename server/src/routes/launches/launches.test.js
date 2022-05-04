const request = require("supertest");
const app = require("../../app");
const {
  mongoConnect,
  mongoDisconnect
} = require("../../services/mongo");

describe("Testing launches API", () => {
  beforeAll(() => {
    mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test GET /launches", () => {
    test("it should respond with 200 success", async () => {
      await request(app).get("/v1/launches").expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeRequestData = {
      mission: "CCV explorer",
      rocket: "NCC Incremental 1",
      target: "Kepler-62 f",
      launchDate: "December 23, 2023",
    };
    const matchObj = {
      mission: "CCV explorer",
      rocket: "NCC Incremental 1",
      target: "Kepler-62 f",
    };
    const dataWithInvalidDate = {
      mission: "CCV explorer",
      rocket: "NCC Incremental 1",
      target: "Kepler-62 f",
      launchDate: "hello",
    };
    test("it should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeRequestData)
        .expect(201)
        .expect("Content-Type", /json/);
      const requestDate = new Date(
        completeRequestData.launchDate
      ).valueOf();
      const responseDate = new Date(
        response.body.launchDate
      ).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(matchObj);
    });
    test("it should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(matchObj)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(dataWithInvalidDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Invalid date",
      });
    });
  });
});
