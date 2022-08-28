import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import { Album } from "./album";

export class Song extends Model {
  declare id: number;
  declare name: string;
  declare albumId: number;
}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db.connection,
    modelName: "Song",
    tableName: "Songs",
    timestamps: false,
  }
);
