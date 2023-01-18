const { Router } = require('express');
const router = Router();
const { getItems } = require("../controllers/api.controller")

router.get('/api/', getItems );

module.exports = router;