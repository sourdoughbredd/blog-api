// Import dependencies
import request from "supertest";
import { expect } from "chai";
import app from "./config/appTesting.js";

describe("GET index route", function () {
  it("should return a 200 OK status", async () => {
    const response = await request(app).get("/");
    expect(response.status).to.equal(200);
  });

  it("should return content type as JSON", async () => {
    const response = await request(app).get("/");
    expect(response.headers["content-type"]).to.include("application/json");
  });

  it("should return an object with the correct structure", async () => {
    const response = await request(app).get("/");
    expect(response.body).to.include.keys(
      "message",
      "version",
      "documentation_url",
      "endpoints"
    );
    expect(response.body.endpoints).to.have.all.keys("posts", "users");
  });
});
