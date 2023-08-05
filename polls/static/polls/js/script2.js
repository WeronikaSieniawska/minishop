document.addEventListener('DOMContentLoaded', function () {
  // Function to get CSRF token
  function getCSRFToken() {
      const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
      if (csrfCookie) {
          return csrfCookie.split('=')[1];
      } else {
          return null;
      }
  }

  // Function to update total amounts for each item
  function updateTotalAmounts() {
      const rows = document.querySelectorAll('tbody tr');
      rows.forEach(row => {
          const quantity = parseInt(row.querySelector('td:nth-child(3)').textContent, 10);
          const unitPrice = parseFloat(row.querySelector('td:nth-child(4)').textContent);
          const totalAmountCell = row.querySelector('.total_amount');
          const totalAmount = quantity * unitPrice;
          totalAmountCell.textContent = totalAmount.toFixed(2);
      });
  }

  // Function to handle amount input changes
  function handleAmountInputChange(event, quantity) {
      const input = event.target;
      const amount = parseFloat(input.value);

      if (!isNaN(amount)) {
          const itemId = input.dataset.itemId;
          const totalAmountCell = document.querySelector(`[data-item-id="${itemId}"] .total_amount`);
          const unitPriceElement = document.querySelector(`[data-item-id="${itemId}"] td:nth-child(4)`);
          const unitPrice = unitPriceElement ? parseFloat(unitPriceElement.textContent) : 0;
          const totalAmount = amount * unitPrice;
          totalAmountCell.textContent = totalAmount.toFixed(2);
      }

      updateTotalOrderAmount();
  }

  // Function to update total order amount
  function updateTotalOrderAmount() {
      const rows = document.querySelectorAll('tbody tr');
      let totalOrderAmount = 0;

      rows.forEach(row => {
          const amountInput = row.querySelector('.amountInput');
          const amount = parseFloat(amountInput.value);

          if (!isNaN(amount) && amount >= 0) {
              const unitPrice = parseFloat(row.querySelector('td:nth-child(4)').textContent);
              const totalAmount = amount * unitPrice;
              totalOrderAmount += totalAmount;
          }
      });

      const totalAmountField = document.getElementById('total');
      totalAmountField.value = totalOrderAmount.toFixed(2);
  }

  // Function to save purchase order
  function savePurchaseOrder(supplier, date, totalAmount, items, newItems) {
      const data = {
          supplier: supplier,
          pubDate: date,
          total: totalAmount,
          items: items,
          new_items: newItems  // Add new items data
      };

      fetch('/save_supplier_items/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify(data),
      })
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  showError(data.error);
              } else {
                  showSuccess(data.message);
                  window.location.href = '/income-and-expenditure/';
              }
          })
          .catch(error => {
              showError("An error occurred while saving the purchase order. Please try again.");
          });
  }

  // Function to handle save button click and validate data before saving
  function saveSupplierItems() {
      const supplierInput = document.getElementById('supplierInput');
      const invoiceDate = document.getElementById('invoiceDate');
      const totalAmountField = document.getElementById('total');

      const supplier = supplierInput.value.trim();
      const date = invoiceDate.value;
      const totalAmount = parseFloat(totalAmountField.value);

      if (!supplier) {
          showError("Please provide a supplier name.");
          return;
      }

      if (!date) {
          showError("Please provide an invoice date.");
          return;
      }

      if (isNaN(totalAmount) || totalAmount <= 0) {
          showError("Please provide a valid total amount.");
          return;
      }

      const items = [];
      const newItems = [];  // Add new items data
      const amountInputs = document.querySelectorAll('.amountInput');
      amountInputs.forEach(input => {
          const itemId = input.dataset.itemId;
          const amount = parseFloat(input.value);
          if (!isNaN(amount) && amount > 0) {
              if (itemId.startsWith('new_item_')) {  // Check if it's a new item
                  newItems.push({ new_item: itemId, new_description: '', new_quantity: 0, new_purchase_price: 0, amount: amount });
              } else {
                  items.push({ item_id: itemId, amount: amount });
              }
          }
      });

      if (items.length === 0 && newItems.length === 0) {
          showError("Please provide at least one valid item amount greater than 0.");
          return;
      }

      savePurchaseOrder(supplier, date, totalAmount, items, newItems);
  }

  // Function to show error messages
  function showError(message) {
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = message;
      errorMessage.style.color = 'red';
  }

  // Function to show success messages
  function showSuccess(message) {
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = message;
      errorMessage.style.color = 'green';
  }

  // Call updateTotalAmounts on page load
  updateTotalAmounts();

  // Listen for input changes in the amount fields
  const amountInputs = document.querySelectorAll('.amountInput');
  amountInputs.forEach(input => {
      const quantity = parseInt(input.closest('tr').querySelector('td:nth-child(3)').textContent, 10);
      input.addEventListener('input', event => handleAmountInputChange(event, quantity));
  });

  // Calculate total and save supplier items on button click
  const calculateButton = document.getElementById('calculateButton');
  const saveButton = document.getElementById('saveButton');
  calculateButton.addEventListener('click', updateTotalOrderAmount);
  saveButton.addEventListener('click', saveSupplierItems);

  // Handle add new item button click
  const addNewItemButton = document.getElementById('addNewItemButton');
  const itemTableBody = document.getElementById('itemTableBody');
  let newItemId = 1;

  addNewItemButton.addEventListener('click', () => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <td contenteditable="true">New Item ${newItemId}</td>
          <td contenteditable="true">Description for New Item ${newItemId}</td>
          <td contenteditable="true">0</td>
          <td contenteditable="true">0.00</td>
          <td class="total_amount"></td>
          <td>
              <input type="number" class="amountInput" data-item-id="new_item_${newItemId}" min="0" step="1" name="amount_new_item_${newItemId}">
              <span class="error-message"></span>
          </td>
      `;

      itemTableBody.appendChild(newRow);

      // Increment the newItemId for the next new item
      newItemId++;
  });
});
