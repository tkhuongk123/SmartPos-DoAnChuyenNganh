const express = require('express');
const router = express.Router();
const IngredientController = require("../controllers/IngredientController");

router.get('/layDsIngredient', IngredientController.layDsIngredient);
router.post('/checkIngredients', IngredientController.checkIngredients);
router.post('/deductIngredients', IngredientController.deductIngredients);
router.post('/create', IngredientController.createIngredient);
router.put('/update/:id', IngredientController.updateIngredient);
router.delete('/delete/:id', IngredientController.deleteIngredient);

module.exports = router;

