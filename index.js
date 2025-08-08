const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY // variável de ambiente
});

app.post("/comando", async (req, res) => {
const { chao, distancia } = req.body;

const prompt = `O carro está recebendo os seguintes dados:
- Chão detectado: ${chao}
- Distância à frente: ${distancia} cm

Com base nisso, diga o que o carro deve fazer em uma única palavra: frente, parar, ré ou virar.`;

try {
const completion = await openai.chat.completions.create({
model: "gpt-4o", // ou "gpt-3.5-turbo" se preferir
messages: [{ role: "user", content: prompt }],
});

const resposta = completion.choices[0].message.content;
res.json({ acao: resposta.trim().toLowerCase() });

} catch (err) {
console.error(err);
res.status(500).send("Erro ao consultar ChatGPT");
}
});

// Rota raiz apenas informativa
app.get("/", (req, res) => {
res.send("Servidor funcionando. Use /comando via POST.");
});

app.listen(3000, () => {
console.log("Servidor rodando na porta 3000");
});
