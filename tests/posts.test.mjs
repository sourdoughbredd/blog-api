import request from "supertest";
import { expect } from "chai";
import app from "./config/appTesting.js";
import {
  initializeMongoServer,
  closeDatabase,
} from "./config/dbConfigTesting.js";
import post from "../models/post";

describe("GET all posts", () => {
  before(async function () {
    await initializeMongoServer();
  });

  after(async function () {
    await closeDatabase();
  });
});
