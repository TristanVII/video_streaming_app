const express = require("express");
const cors = require("cors"); // Import cors
const {
  redisConnect,
  setKeyValue,
  getValue,
  setKeyValueWithExpiry,
} = require("./redis");

const generateRandomToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};

const app = express();
app.use(express.json()); // Body parser
app.use(cors());
let redis;

// Sign up route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const existingUser = await getValue(redis, username);
  if (existingUser !== null) {
    return res.status(400).json({ error: "Username already exists" });
  }

  await setKeyValue(redis, username, password);
  res.status(201).json({ message: "User created successfully" });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password, token } = req.body;

  if (token) {
    const validToken = await redis.ttl(token);
    console.log(validToken);
    if (validToken && validToken >= 0) {
      return res.status(201).json({ message: "success" });
    }
  }
  if (!username || !password) {
    return res.status(401).json({ error: "Missing username or password" });
  }
  const user = await getValue(redis, username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const isPasswordValid = password === user;
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  const newToken = generateRandomToken();
  await setKeyValueWithExpiry(redis, newToken, "true");
  res.status(201).json({ message: "success", token: newToken });
});

const port = 3000;
app.listen(port, async () => {
  redis = await redisConnect();
});
