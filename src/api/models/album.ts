import { DataTypes, Model } from "sequelize";
import { Song } from "./song";
import db from "../config/db";

export class Album extends Model {
  declare id: number;
  declare name: string;
  declare year: number;
  declare band: string;
}

Album.init(
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    band: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.connection, // We need to pass the connection instance
    modelName: "Album", // We need to choose the model name
    tableName: "Albums", // We specify the  table name in the DB. (Sequelizes puts the plural of the modelName by default, but here i'm making it explicit)
    timestamps: false,
  }
);

// Not sure if it's a bug in Sequelize, but for some reason the foreign key has to be indicated in both sides of the association
Album.hasMany(Song, {
  foreignKey: "albumId",
  onDelete: "CASCADE",
  constraints: false,
});
Song.belongsTo(Album, { foreignKey: "albumId", as: "album" });
