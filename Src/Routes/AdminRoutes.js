const router = require('express').Router();
const { getAdminStats } = require('../Controllers/AdminController');

router.get("/stats", getAdminStats);

module.exports = router;
