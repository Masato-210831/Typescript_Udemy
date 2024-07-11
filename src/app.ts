import express, { Request, Response, NextFunction } from "express";
import todosRouters from "./routes/todos";
import { json } from "body-parser";

const app = express();

// requestのjsonをparseしてreq.bodyに渡す。
app.use(json())

// appにルートを設定
app.use("/todos", todosRouters);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
