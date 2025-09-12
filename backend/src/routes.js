const express = require('express');
const { getChannel } = require('./rabbitmq');
const statusMap = require('./statusStore');

const router = express.Router();

router.post('/notificar', async (req, res) => {
  try {
    const { mensagemId, conteudoMensagem } = req.body;
    if (!mensagemId || !conteudoMensagem || !conteudoMensagem.trim()) {
      return res.status(400).json({ erro: "mensagemId e conteudoMensagem obrigatórios e não vazios" });
    }

    const channel = getChannel();
    const filaEntrada = "fila.notificacao.entrada.camila";

    await channel.assertQueue(filaEntrada, { durable: true });
    channel.sendToQueue(filaEntrada, Buffer.from(JSON.stringify({ mensagemId, conteudoMensagem })), { persistent: true });

    statusMap.set(mensagemId, "AGUARDANDO_PROCESSAMENTO");

    return res.status(202).json({ mensagemId, status: "AGUARDANDO_PROCESSAMENTO" });
  } catch (err) {
    console.error("Erro no /notificar:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
});

router.get('/notificacao/status/:id', (req, res) => {
  const id = req.params.id;
  const status = statusMap.get(id);
  if (!status) return res.status(404).json({ erro: "Mensagem não encontrada" });
  res.json({ mensagemId: id, status });
});

module.exports = router;
