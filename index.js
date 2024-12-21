require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRouter = require("./routers/users.router");
const roomRouter = require("./routers/rooms.router");
const globalErrorHandler = require("./middlewares/error.middleware");

const app = express();
const port = 8080;
app.use(cors({ origin: "*"}));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(userRouter);
app.use(roomRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
