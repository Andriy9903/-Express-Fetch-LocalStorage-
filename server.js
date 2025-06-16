const express = require('express');
const cors = require('cors');
const { encodePassword, generateToken } = require('./auth.js');
const app = express();
const buyUpgradeRoute = require('./routes/buyUpgrade');

app.use(cors());
app.use(express.json());
app.use('/api', buyUpgradeRoute);

const users = [];
let userData = {
  balance: 19593,
  coinsPerClick: 20,
  passiveIncomePerSecond: 1
};

const upgrades = [
  { id: "click-accelerator", name: "Click Accelerator", price: 40000, type: "multiplyClick", value: 10 },
  { id: "click-boost", name: "Click Boost", price: 20000, type: "addClick", value: 10 },
  { id: "passive-plus", name: "Passive Plus", price: 30000, type: "addPassive", value: 2 },
  { id: "passive-x", name: "Passive x2", price: 50000, type: "multiplyPassive", value: 2 }
];

app.post('/sign-up', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required!' });
  if (password.length < 8) return res.status(400).json({ message: 'Password length should be minimum 8 symbols!' });
  if (users.find(user => user.email === email)) return res.status(400).json({ message: 'User with this email already exists!' });

  const hashedPassword = encodePassword(password);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ message: 'Реєстрація успішна!' });
});

app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required!' });

  const user = users.find(u => u.email === email);
  if (!user || user.password !== encodePassword(password)) return res.status(401).json({ message: 'Incorrect email or password!' });

  const token = generateToken(email);
  res.status(200).json({ token });
});

app.post('/click', (req, res) => {
  userData.balance += userData.coinsPerClick;
  res.status(200).json({ balance: userData.balance });
});

app.post('/passive-income', (req, res) => {
  userData.balance += userData.passiveIncomePerSecond;
  res.status(200).json({ balance: userData.balance });
});

app.post('/buy-upgrade', (req, res) => {
  const { upgradeId } = req.body;
  const upgrade = upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return res.status(404).json({ message: 'Upgrade not found' });
  if (userData.balance < upgrade.price) return res.status(400).json({ message: 'Not enough balance' });

  userData.balance -= upgrade.price;
  switch (upgrade.type) {
    case 'multiplyClick':
      userData.coinsPerClick *= upgrade.value;
      break;
    case 'addClick':
      userData.coinsPerClick += upgrade.value;
      break;
    case 'multiplyPassive':
      userData.passiveIncomePerSecond *= upgrade.value;
      break;
    case 'addPassive':
      userData.passiveIncomePerSecond += upgrade.value;
      break;
    default:
      return res.status(409).json({ message: 'Unsupported upgrade type' });
  }

  res.status(200).json({
    balance: userData.balance,
    coinsPerClick: userData.coinsPerClick,
    passiveIncomePerSecond: userData.passiveIncomePerSecond
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
