const baseController = require("./controllers/baseController");
const invController = require("./controllers/inventoryController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/"); // ✅ Make sure this is required

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // ✅ Required for Render

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", baseController.buildHome);
app.get("/inv/type/:classificationId", invController.buildByClassificationId);
app.get("/inv/detail/:invId", invController.buildByInventoryId);
app.use("/inv", inventoryRoute);

// Middleware for 500 error
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const nav = await utilities.getNav();
  res.status(500).render("error", {
    title: "Server Error",
    nav,
    message: "Oh no! Something went wrong. Please try again later.",
  });
});

// Middleware for 404 error
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("error", {
    title: "Page Not Found",
    nav,
    message: "Sorry, we couldn't find that page.",
  });
});




app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
