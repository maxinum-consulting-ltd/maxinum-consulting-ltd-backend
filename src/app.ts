import "reflect-metadata";
import express from "express";
import cors from "cors";
import { Transaction } from "./entity/Transaction";
import AppDataSource from "../database";

const app = express();
app.use(cors());
app.use(express.json());


AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established");

    const transactionRepository = AppDataSource.getRepository(Transaction);

    app.get("/", async (req, res) => {
      const transactions = await transactionRepository.find();
      res.json(transactions);
    });

    app.post("/", async (req, res) => {
      const transaction = transactionRepository.create(req.body);
      const savedTransaction = await transactionRepository.save(transaction);
      res.json(savedTransaction);
    });

    app.delete("/:id", async (req, res) => {
      const { id } = req.params;
      const result = await transactionRepository.delete(id);
      if (result.affected) {
        res.status(200).json({ message: "Транзакция удалена" });
      } else {
        res.status(404).json({ message: "Транзакция не найдена" });
      }
    });

    app.patch("/:id", async (req, res) => {
      const { id } = req.params;
      await transactionRepository.update(id, req.body);
      const updatedTransaction = await transactionRepository.findOneBy({ id });
      if (updatedTransaction) {
        res.json(updatedTransaction);
      } else {
        res.status(404).json({ message: "Транзакция не найдена" });
      }
    });

    app.listen(5000, () => {
      console.log("Server was started on port 5000");
    });
  })
  .catch(error => console.log("Database connection error: ", error));
