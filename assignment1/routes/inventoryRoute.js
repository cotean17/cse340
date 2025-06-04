const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

router.get("/add-classification", invController.showAddClassificationForm);
router.post("/add-classification", invController.addClassification);


router.get("/", invController.buildManagementView);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);
router.get("/error", (req, res) => {
    throw new Error("Intentional server error for testing.")
    
  });
  

router.get("/add-inventory", invController.showAddInventoryForm);
router.post("/add-inventory", invController.addInventory);

module.exports = router;
