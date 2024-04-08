const { createClient } = require("redis");

// Connect to localhost on port 6379
const redisConnect = async () => {
  const client = createClient({
    host: "10.17.37.183",
    port: 6379,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  return client;
};

const setKeyValue = async (client, key, value) => {
  if (!client || !key || !value) {
    throw new Error("Missing values: ", client, key, value);
  }
  await client.set(key, value);
};

const getValue = async (client, key) => {
  if (!client || !key) {
    throw new Error("Missing values: ", client, key);
  }
  try {
    const value = await client.get(key);
    console.log("Value for key", key, ":", value);
    return value;
  } catch (error) {
    console.error("Error retrieving value:", error);
    throw error;
  }
};

const setKeyValueWithExpiry = async (
  client,
  key,
  value,
  expiryInSeconds = 600
) => {
  try {
    // Use SETEX to set the key and its expiry simultaneously
    await client.setEx(key, expiryInSeconds, value);
    return true; // Indicate success
  } catch (error) {
    console.error("Error setting key with expiry:", error);
    return false; // Indicate failure
  }
};

module.exports = { redisConnect, setKeyValue, getValue, setKeyValueWithExpiry };
