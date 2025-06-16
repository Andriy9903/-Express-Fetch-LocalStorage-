const express = require('express');
const router = express.Router();

// GET /users
router.get('/', (req, res) => {
  res.send('Список користувачів');
});

// POST /users
router.post('/', (req, res) => {
  res.send('Користувача створено');
});

module.exports = router;