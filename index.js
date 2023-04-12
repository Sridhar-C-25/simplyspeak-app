const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoute = require("./routes/auth.route");
const blogRoute = require("./routes/blog.route");
const userRoute = require("./routes/user.route");
const connectDB = require("./config/db");

// connect mongodb
connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://192.168.1.100:3000"],
      credentials: true,
    })
  );
}

app.get("/", (req, res) => {
  res.json({ msg: "hello world" });
});

// routes
app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/user", userRoute);

// middleware for error handling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send({ message: errorMessage });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "./", "client", "build", "index.html"))
  );
}

// PORT -> LIVE || LOCAL
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("server started", port);
});
