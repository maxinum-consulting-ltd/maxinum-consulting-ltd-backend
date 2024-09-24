// const express = require("express");
// const { v4: uuidv4 } = require("uuid");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const transactions = [
//   {
//     id: "60f5774d-7a63-4081-9db5-c812600845fb",
//     date: "2018-01-01",
//     author: "Димаш",
//     sum: 300000,
//     category: "Капитал",
//     comment: "Комментарий 1",
//   },
//   {
//     id: "45082d0e-5cc1-48cd-baaa-a91a8f89810d",
//     date: "2020-02-02",
//     author: "Адиль",
//     sum: 150000,
//     category: "Расходы",
//     comment: "Комментарий 2",
//   },
//   {
//     id: "64f2173a-7ac9-4801-92c7-589127d33ef4",
//     date: "2023-03-03",
//     author: "Арлан",
//     sum: 200000,
//     category: "Инвестиции",
//     comment: "Комментарий 3",
//   },
// ];

// app.use(express.json());

// const getTransaction = (req, res) => {
//   res.json([...transactions].reverse());
// };

// const postTransaction = (req, res) => {
//   const id = uuidv4();
//   req.body.id = id;
//   transactions.push(req.body);
//   res.json(req.body);
// };

// const deleteTransaction = (req, res) => {
//   const { id } = req.params;
//   const index = transactions.findIndex(transaction => transaction.id === id);
//   if (index !== -1) {
//     transactions.splice(index, 1);
//     res.status(200).json({ message: "Транзакция удалена" });
//   } else {
//     res.status(404).json({ message: "Транзакция не найдена" });
//   }
// };

// const editTransaction = (req, res) => {
//   const { id } = req.params;
//   const index = transactions.findIndex(transaction => transaction.id === id);

//   if (index !== -1) {
//     transactions[index] = { ...transactions[index], ...req.body };
//     res.status(200).json(transactions[index]);
//   } else {
//     res.status(404).json({ message: "Транзакция не найдена" });
//   }
// };

// app.get("/", getTransaction);
// app.post("/", postTransaction);
// app.delete("/:id", deleteTransaction);
// app.patch("/:id", editTransaction);

// app.listen(5000, () => {
//   console.log("Server was started on port 5000");
// });

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
