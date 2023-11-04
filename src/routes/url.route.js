const express = require('express');
const { home, newUrl, getShortUrl } = require('../controllers/url.controller');
const router = express.Router();

router.get('/', home);
router.post('/api/shorturl', newUrl);
router.get('/api/shorturl/:short_url', getShortUrl);

module.exports = router;
