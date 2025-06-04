const pool = require("../index");

// Get all classifications
async function getClassifications() {
  return await pool.query("SELECT * FROM classification ORDER BY classification_name");
}

// Get inventory by classification ID
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data;
  } catch (error) {
    console.error("getInventoryByClassificationId error", error);
    throw error;
  }
}

// Get vehicle by inventory ID
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data;
  } catch (error) {
    console.error("getInventoryById error", error);
    throw error;
  }
}

// Add a classification
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    console.error("addClassification error", error);
    return null;
  }
}

// Add inventory vehicle
async function addInventory(vehicle) {
  const sql = `
    INSERT INTO inventory 
      (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;
  const values = [
    vehicle.inv_make,
    vehicle.inv_model,
    vehicle.inv_description,
    vehicle.inv_image,
    vehicle.inv_thumbnail,
    vehicle.inv_price,
    vehicle.inv_year,
    vehicle.inv_miles,
    vehicle.inv_color,
    vehicle.classification_id
  ];
  try {
    return await pool.query(sql, values);
  } catch (error) {
    console.error("addInventory error", error);
    return null;
  }
}

// NEW: Get all inventory
async function getAllInventory() {
  try {
    const sql = `
      SELECT inv_id, inv_make, inv_model 
      FROM inventory 
      ORDER BY inv_make, inv_model
    `;
    return await pool.query(sql);
  } catch (error) {
    console.error("getAllInventory error", error);
    throw error;
  }
}

// ✅ Export all functions
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  getAllInventory,
};
