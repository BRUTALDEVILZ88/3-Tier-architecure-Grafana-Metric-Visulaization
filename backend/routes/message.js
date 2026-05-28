const express = require('express');
const router = express.Router();

router.get('/message', (req, res) => {
  res.json({
    message: "Hello from the backend! 🚀 oggy",
    app: "CloudOps Backend",
    status: "Healthy",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;