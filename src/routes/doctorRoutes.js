const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.getDoctors);
router.get('/:id/slots', doctorController.getDoctorSlots);

module.exports = router;