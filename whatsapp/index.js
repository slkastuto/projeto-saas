require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

/* =========================
   ENV
========================= */

const PORT = process.env.PORT || 4000;
const BACKEND_URL = process.env.BACKEND_URL;
const COMPANY_ID = process.env.COMPANY_ID;

if (!BACKEND_URL || !COMPANY_ID) {
  console.error('❌ BACKEND_URL ou COMPANY_ID não definidos no .env');
  process.exit(1);
}

/* =========================
   EXPRESS
========================= */

const app = express();
app.use(cors());
app.use(express.json());

let lastQr = null;
let isReady = false;

/* =========================
   WHATSAPP CLIENT
========================= */

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'atendaflow',
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

/* =========================
   EVENTOS
========================= */

client.on('qr', (qr) => {
  lastQr = qr;
  console.log('\n📱 Escaneie o QR Code:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  isReady = true;
  console.log('✅ WhatsApp conectado com sucesso!');
});

client.on('disconnected', () => {
  isReady = false;
  console.log('❌ WhatsApp desconectado');
});

/* =========================
   RECEBER MENSAGENS
========================= */
client.on('message', async (msg) => {
  if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) {
    return;
  }

  try {
    const body = msg.body?.trim();
    if (!body) return;

    // 🔥 PEGA CONTATO UMA VEZ SÓ
    const contactData = await msg.getContact();

    // 🔥 Número normalizado
    
let phone;

if (msg.fromMe) {
  phone = msg.to.split('@')[0];
} else {
  phone = msg.from.split('@')[0];
}


    // 🔥 Nome normalizado
    const name =
      contactData?.pushname ||
      contactData?.name ||
      contactData?.shortName ||
      phone;

    // Avatar
    let avatarUrl = null;
    try {
      avatarUrl = await contactData.getProfilePicUrl();
    } catch (_) {
      avatarUrl = null;
    }

    const payload = {
      contact: phone,
      name,
      body,
      avatarUrl,
      companyId: COMPANY_ID,
    };

    console.log('\n📩 Nova mensagem recebida');
    console.log(payload);

    await axios.post(`${BACKEND_URL}/whatsapp/webhook`, payload);

    console.log('✅ Enviado para o backend com sucesso');
  } catch (error) {
    console.error('❌ Erro ao enviar para o backend');

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
});


/* =========================
   API AUXILIAR
========================= */

app.get('/status', (req, res) => {
  res.json({ connected: isReady });
});

app.get('/qr', (req, res) => {
  if (isReady) {
    return res.json({ message: 'WhatsApp já conectado' });
  }

  if (!lastQr) {
    return res.status(404).json({ message: 'QR Code ainda não gerado' });
  }

  res.json({ qr: lastQr });
});

/* =========================
   START
========================= */

client.initialize();

app.listen(PORT, () => {
  console.log(`🚀 Serviço WhatsApp rodando em http://localhost:${PORT}`);
});
