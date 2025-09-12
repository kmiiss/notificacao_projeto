const amqp = require("amqplib");

let channel;
let connection;

async function connectRabbitMQ() {
  try {
    const amqpUrl = process.env.RABBITMQ_URL || "amqp://user:pass@localhost:5672";
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ at", amqpUrl);
    return channel;
  } catch (err) {
    console.error("Failed to connect RabbitMQ:", err);
    throw err;
  }
}

function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
