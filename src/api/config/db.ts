import { Sequelize } from "sequelize";
import { DynamicObject } from "../utils/types";
import { config } from "./config";
import fs from "fs";
import path from "path";

const sync = async (connection: Sequelize) => {
  try {
    // This creates a table for each model if the tables don't exist already
    await connection.sync();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("An error occured:", error);
  }
};

const connection = new Sequelize(config.DB_URI, {
  logging: false,
}); // Connects to the Database

const db: DynamicObject = {};

const modelsFileExtensions = ["ts", "tsx", "js"];

const modelsDirectory = path.normalize(`${__dirname}/../models`); // Returns the path to reach the folder with the models base on the location of this file

// For a given path fs.readdirSync returns an array with all the files and folders contained on that path
fs.readdirSync(modelsDirectory)
  // Now we filter only the files who contain models, that is, files with .js/.jsx extension
  .filter((file) => {
    return modelsFileExtensions.includes(file.split(".").pop() || "");
  })
  .forEach(async (file) => {
    const model = await import(path.join(modelsDirectory, file));
    db[Object.keys(model)[0]] = Object.values(model)[0];
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.connection = connection;

sync(connection);

export default db;
