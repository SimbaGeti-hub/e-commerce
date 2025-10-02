
// const form = document.querySelector('form');
// const messageContainer = document.createElement('p');
// messageContainer.classList.add('alert', 'success');

// form.addEventListener('submit', function(e) {
//   e.preventDefault();

//   // Clear old errors and success
//   form.querySelectorAll('.input-error').forEach(err => err.remove());
//   const oldSuccess = form.parentNode.querySelector('.alert.success');
//   if (oldSuccess) oldSuccess.remove();

//   let hasError = false;
//   const requiredFields = ["name", "category", "price", "stock", "color"];
//   requiredFields.forEach(name => {
//     const input = form.querySelector(`[name="${name}"]`);
//     if (!input || !input.value.trim()) {
//       const errorP = document.createElement("p");
//       errorP.classList.add("input-error");
//       errorP.textContent = "Invalid field";
//       if (input && input.parentNode) input.parentNode.appendChild(errorP);
//       hasError = true;
//     }
//   });

//   const imageInput = form.querySelector('[name="image"]');
//   if (!imageInput || !imageInput.files.length) {
//     const errorP = document.createElement("p");
//     errorP.classList.add("input-error");
//     errorP.textContent = "Invalid field";
//     if (imageInput && imageInput.parentNode) imageInput.parentNode.appendChild(errorP);
//     hasError = true;
//   }

//   if (hasError) return;

//   const formData = new FormData(form);

//   fetch(form.action, {
//     method: form.method,
//     body: formData
//   })
//   .then(response => {
//     if (response.ok) return response.json(); // Expect JSON from backend
//     throw new Error("Server error");
//   })
//   .then(product => {
//     // Show success message once
//     messageContainer.textContent = "Product has been added successfully";
//     if (!form.parentNode.querySelector('.alert.success')) {
//       form.parentNode.insertBefore(messageContainer, form);
//     }
//     form.reset();

//     // Append new product row to table body
//     const tbody = document.querySelector('table tbody');
//     if (tbody) {
//       const newRow = document.createElement('tr');
//       const newIndex = tbody.rows.length;
//       newRow.innerHTML = `
//         <td>#${645341 + newIndex}</td>
//         <td>${product.name}</td>
//         <td>${product.category}</td>
//         <td>${parseFloat(product.price).toFixed(2)}</td>
//         <td>${product.stock}</td>
//       `;
//       tbody.appendChild(newRow);
//     }
//   })
//   .catch(error => {
//     console.error(error);
//   });
// });

// // Cancel button handler
// const cancelBtn = document.getElementById("cancelBtn");
// cancelBtn.addEventListener("click", () => {
//   form.reset();
//   form.querySelectorAll(".input-error").forEach(err => err.remove());
//   const oldSuccess = form.parentNode.querySelector('.alert.success');
//   if (oldSuccess) oldSuccess.remove();
// });



const form = document.querySelector('form');
const messageContainer = document.createElement('p');
messageContainer.classList.add('alert', 'success');

// === Card Updater Function ===
function updateCards() {
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;

  let totalPrice = 0;
  let totalOrders = 0;

  [...tbody.rows].forEach(row => {
    const priceCell = row.cells[3]; // Price column
    const stockCell = row.cells[4]; // Quantity column

    if (priceCell && stockCell) {
      const price = parseFloat(priceCell.textContent.replace(/[^0-9.]/g, '')) || 0;
      const stock = parseInt(stockCell.textContent) || 0;

      totalPrice += price * stock; // multiply price by stock
      totalOrders++; // each row = one order/product
    }
  });

  // Update DOM
  document.getElementById("totalAmount").textContent = totalPrice.toFixed(2) + " UGX";
  document.getElementById("totalOrders").textContent = totalOrders;
}

// === On Page Load ===
document.addEventListener("DOMContentLoaded", updateCards);

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Clear old errors and success
  form.querySelectorAll('.input-error').forEach(err => err.remove());
  const oldSuccess = form.parentNode.querySelector('.alert.success');
  if (oldSuccess) oldSuccess.remove();

  let hasError = false;
  const requiredFields = ["name", "category", "price", "stock", "color"];
  requiredFields.forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input || !input.value.trim()) {
      const errorP = document.createElement("p");
      errorP.classList.add("input-error");
      errorP.textContent = "Invalid field";
      if (input && input.parentNode) input.parentNode.appendChild(errorP);
      hasError = true;
    }
  });

  const imageInput = form.querySelector('[name="image"]');
  if (!imageInput || !imageInput.files.length) {
    const errorP = document.createElement("p");
    errorP.classList.add("input-error");
    errorP.textContent = "Invalid field";
    if (imageInput && imageInput.parentNode) imageInput.parentNode.appendChild(errorP);
    hasError = true;
  }

  if (hasError) return;

  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData
  })
    .then(response => {
      if (response.ok) return response.json(); // Expect JSON from backend
      throw new Error("Server error");
    })
    .then(product => {
      // Show success message once
      messageContainer.textContent = "Product has been added successfully";
      if (!form.parentNode.querySelector('.alert.success')) {
        form.parentNode.insertBefore(messageContainer, form);
      }
      form.reset();

      // Append new product row to table body
      const tbody = document.querySelector('table tbody');
      if (tbody) {
        const newRow = document.createElement('tr');
        const newIndex = tbody.rows.length;
        newRow.innerHTML = `
          <td>#${645341 + newIndex}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${parseFloat(product.price).toFixed(2)}</td>
          <td>${product.stock}</td>
        `;
        tbody.appendChild(newRow);
      }

      // 🔥 Update cards after adding new row
      updateCards();
    })
    .catch(error => {
      console.error(error);
    });
});

// Cancel button handler
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  form.reset();
  form.querySelectorAll(".input-error").forEach(err => err.remove());
  const oldSuccess = form.parentNode.querySelector('.alert.success');
  if (oldSuccess) oldSuccess.remove();
});

