const express = require("express");
const router = require("./routes");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}...`);
});

app.use('/api', router);

app.use( (req, res) => {
    res.status(400).json({error:['URL desconhecida']});
});