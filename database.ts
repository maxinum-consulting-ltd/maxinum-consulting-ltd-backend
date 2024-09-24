import { DataSource } from "typeorm";
import { Transaction } from "./src/entity/Transaction"; // Импортируйте вашу сущность Transaction

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "1234",
  database: "transactions",
  synchronize: true,
  logging: false,
  entities: [Transaction],
});

export default AppDataSource;
