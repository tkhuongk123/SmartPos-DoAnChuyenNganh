const express = require('express');
const router = express.Router();
const IngredientController = require("../controllers/IngredientController");

router.get('/layDsIngredient', IngredientController.layDsIngredient);
router.post('/deductIngredients', IngredientController.deductIngredients);

module.exports = router;

