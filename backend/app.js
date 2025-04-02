require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chefRoutes = require('./routes/chefRoutes');
const receitasRoutes = require('./routes/receitasRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI; // Pegando a URL do banco a partir do .env

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Conectando ao MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Conectado ao MongoDB Atlas!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); // Sai do processo se não conseguir conectar
    }
};

// Inicia conexão com o banco
connectDB();

// Definindo rotas
app.use('/api/chef', chefRoutes);
app.use('/api/receitas', receitasRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
