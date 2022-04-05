import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../../index";

describe("Test example", () => {
  test("GET /", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toEqual(200);
  });
});
