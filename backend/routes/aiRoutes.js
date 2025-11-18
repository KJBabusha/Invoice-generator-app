const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const{parseInvoiceFormText, generateRemiderEmail, getDashboardSummary} = require('../controllers/aiController');

const router = express.Router();

router.post('/parse-text', protect, parseInvoiceFormText);
router.post('/generate-reminder-email', protect, generateRemiderEmail);
router.get('/dashboard-summary', protect, getDashboardSummary);

module.exports = router;