const express = require('express');
const cors = require('cors');
const { encodePassword, generateToken } = require('./auth');

const app = express();
const PORT = 3000;
const users = [];

app.use(cors());
app.use(express.json());

// ✅ Додали перевірку, що сервер працює
app.get('Ура победа', (req, res) => {
    res.send('Сервер працює! 🎉');
});

// 📌 Реєстрація
app.post('/sign-up', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email і пароль обов’язкові.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Пароль повинен містити щонайменше 8 символів.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Користувач з таким email вже існує.' });
    }

    const hashedPassword = encodePassword(password);
    users.push({ email, password: hashedPassword });

    res.status(201).json({ message: 'Реєстрація успішна!' });
});

// 📌 Авторизація
app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email і пароль обов’язкові.' });
    }

    const user = users.find(user => user.email === email);
    if (!user || user.password !== encodePassword(password)) {
        return res.status(401).json({ message: 'Невірний email або пароль.' });
    }

    const token = generateToken(email);
    res.status(200).json({ token });
});

// 🚀 Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
