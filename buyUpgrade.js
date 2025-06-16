const express = require('express');
const router = express.Router();

// Список доступних апгрейдів
const upgrades = [
  {
    id: 'click-accelerator',
    name: 'Click Accelerator',
    price: 40000,
    type: 'multiplyClick',
    value: 10
  },
  {
    id: 'passive-upgrade',
    name: 'Passive Income Booster',
    price: 20000,
    type: 'addPassive',
    value: 5
  }
];

// Тимчасове збереження користувачів (можна замінити на БД)
let users = [
  {
    id: 'user1',
    balance: 50000,
    coinsPerClick: 1,
    passiveIncomePerSecond: 0
  }
];

router.post('/buy-upgrade', (req, res) => {
  const { userId, upgradeId } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const upgrade = upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return res.status(404).json({ message: 'Upgrade not found' });

  if (user.balance < upgrade.price) {
    return res.status(400).json({ message: 'Not enough coins' });
  }

  user.balance -= upgrade.price;

  switch (upgrade.type) {
    case 'multiplyClick':
      user.coinsPerClick *= upgrade.value;
      break;
    case 'addClick':
      user.coinsPerClick += upgrade.value;
      break;
    case 'multiplyPassive':
      user.passiveIncomePerSecond *= upgrade.value;
      break;
    case 'addPassive':
      user.passiveIncomePerSecond += upgrade.value;
      break;
    default:
      return res.status(409).json({ message: 'Unsupported upgrade type' });
  }

  res.status(200).json({
    message: 'Upgrade purchased successfully',
    user
  });
});

module.exports = router;