const invModel = require("../../database/models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildManagementView = async function (req, res, next) {
    const nav = await utilities.getNav();
    const inventoryData = await invModel.getAllInventory();
  
    let tableBody = "";
    if (inventoryData.rows.length > 0) {
      tableBody = `<table>
        <thead>
          <tr><th>Vehicle</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${inventoryData.rows.map(row => `
            <tr>
              <td>${row.inv_make} ${row.inv_model}</td>
              <td>
                <a href="/inv/edit/${row.inv_id}" title="Edit">Edit</a> |
                <a href="/inv/delete/${row.inv_id}" title="Delete">Delete</a>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;
    } else {
      tableBody = "<p class='notice'>No vehicles found.</p>";
    }
  
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      table: tableBody,
    });
  };
  

// Controller for /inv/type/:classificationId
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const nav = await utilities.getNav();

  if (!data || data.rows.length === 0) {
    return res.render("inventory/classification", {
      title: "No Inventory Found",
      nav,
      grid: "<p class='notice'>No inventory found for this classification.</p>",
    });
  }

  const grid = await utilities.buildClassificationGrid(data.rows);
  const className = data.rows[0].classification_name;

  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// Controller for /inv/detail/:invId
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);
  const nav = await utilities.getNav();
  const vehicle = data.rows[0];

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle,
  });
};

// Show form
invCont.showAddClassificationForm = async function (req, res, next) {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  };

  invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body;
    const nav = await utilities.getNav();
  
    if (!classification_name) {
      return res.status(400).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: "Please provide a classification name.",
      });
    }
  
    const result = await invModel.addClassification(classification_name);
  
    if (result) {
      res.redirect("/inv");
    } else {
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: "Failed to add classification.",
      });
    }
  };
  
  // Show Add Inventory Form
invCont.showAddInventoryForm = async function (req, res, next) {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications(); // use existing model
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classifications: classifications.rows,
    });
  };
  
  // Handle Inventory Form Submission
  invCont.addInventory = async function (req, res) {
    const nav = await utilities.getNav();
    const result = await invModel.addInventory(req.body);
  
    if (result) {
      res.redirect("/inv");
    } else {
      res.status(500).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        message: "Failed to add vehicle.",
      });
    }
  };
  
module.exports = invCont;

