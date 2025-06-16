const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

// Використання маршрутів users
app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('Сервер запущено на порті 3000');
});