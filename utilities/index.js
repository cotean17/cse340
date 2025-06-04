const invModel = require("../database/models/inventory-model");

// Define the Util object first
const Util = {};

// Attach methods to it
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

// ✅ This is the corrected version of the function that caused the error
Util.buildClassificationGrid = function (data) {
  let grid;
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}">
      <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
       </a>
    
        <div class="namePrice">
        <h2>
        <a href="/inv/detail/${vehicle.inv_id}">
          ${vehicle.inv_make} ${vehicle.inv_model}
        </a>
        </h2>
      
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = "<p class='notice'>No inventory found for this classification.</p>";
  }
  return grid;
};

Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Export the object at the end
module.exports = Util;
