import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../../index";
import { Sequelize } from "sequelize";
import { config } from "../../../api/config/config";

const sequelize = new Sequelize(config.DB_URI);

const connectDB = async () => {
  const sequelize = new Sequelize(config.DB_URI);
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log("Connection has been established successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
  }
};

describe("GET /", () => {
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  test("Should return status code of 200 if no filters are set", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toEqual(200);
  });
});
