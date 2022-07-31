import { Sequelize, DataTypes, Model } from "sequelize";
import { config } from "../config/config";
const sequelize = new Sequelize(config.DB_URI, { logging: false });

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
    sequelize, // We need to pass the connection instance
    modelName: "Album", // We need to choose the model name
    tableName: "Albums", // We specify the  table name in the DB. (Sequelizes puts the plural of the modelName by default, but here i'm making it explicit)
    timestamps: false,
  }
);
