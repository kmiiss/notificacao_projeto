const express = require('express');
const routes = require('./routes');
const { connectRabbitMQ, getChannel } = require('./rabbitmq');
const { startConsumer } = require('./consumer');

const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectRabbitMQ();
    // inicia consumer somente após conexão ter sido estabelecida
    await startConsumer();
    app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
  } catch (err) {
    console.error("Erro ao iniciar aplicação:", err);
    process.exit(1);
  }
}

start();
