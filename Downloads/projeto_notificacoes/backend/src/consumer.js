const { getChannel } = require('./rabbitmq');
const statusMap = require('./statusStore');

async function startConsumer() {
  const channel = getChannel();
  const filaEntrada = "fila.notificacao.entrada.camila";
  const filaSaida = "fila.notificacao.status.camila";

  await channel.assertQueue(filaEntrada, { durable: true });
  await channel.assertQueue(filaSaida, { durable: true });

  channel.consume(filaEntrada, async (msg) => {
    try {
      if (!msg) return;
      const payload = JSON.parse(msg.content.toString());
      const { mensagemId, conteudoMensagem } = payload;
      console.log("Consumer received:", mensagemId);

      // simula processamento assíncrono (1-2s)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const sucesso = Math.random() > 0.2;
      const status = sucesso ? "PROCESSADO_SUCESSO" : "FALHA_PROCESSAMENTO";

      statusMap.set(mensagemId, status);

      await channel.sendToQueue(filaSaida, Buffer.from(JSON.stringify({ mensagemId, status })), { persistent: true });

      channel.ack(msg);
      console.log("Processed", mensagemId, "status:", status);
    } catch (err) {
      console.error("Erro no consumer:", err);
      try { channel.nack(msg, false, false); } catch(e){ }
    }
  }, { noAck: false });

  console.log("Consumer iniciado, aguardando mensagens...");
}

module.exports = { startConsumer };
