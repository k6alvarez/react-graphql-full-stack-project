// let's go!
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// use express middleware for cookies
server.express.use(cookieParser());

// decode jwt to get userId on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

// middleware to populate user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) {
    return next();
  }

  const user = await db.query.user(
    {
      where: {
        id: req.userId
      }
    },
    "{id, permissions, email, name}"
  );

  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(
      `Ya chingamos. Todo esta listo en http:/localhost:${deets.port}`
    );
  }
);
