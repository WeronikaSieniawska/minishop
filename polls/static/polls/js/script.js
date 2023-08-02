document.addEventListener('DOMContentLoaded', function () {
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

  function handleAmountInputChange(event) {
    const input = event.target;
    const amount = parseFloat(input.value);

    if (!isNaN(amount)) {
      const itemId = input.dataset.itemId;
      const totalAmountCell = document.querySelector(`[data-item-id="${itemId}"] .total_amount`);

      if (totalAmountCell) {
        const unitPriceElement = document.querySelector(`[data-item-id="${itemId}"] td:nth-child(4)`);
        const quantityElement = document.querySelector(`[data-item-id="${itemId}"] td:nth-child(3)`);

        const unitPrice = unitPriceElement ? parseFloat(unitPriceElement.textContent) : 0;
        const quantity = quantityElement ? parseInt(quantityElement.textContent, 10) : 0;

        if (amount > quantity) {
          totalAmountCell.textContent = (quantity * unitPrice).toFixed(2);
        } else {
          const totalAmount = amount * unitPrice;
          totalAmountCell.textContent = totalAmount.toFixed(2);
        }

        updateTotalOrderAmount();
      }
    }
  }

  function updateTotalOrderAmount() {
    const amountInputs = document.querySelectorAll('.amountInput');
    let totalOrderAmount = 0;

    amountInputs.forEach(input => {
      const amount = parseFloat(input.value);
      if (!isNaN(amount)) {
        const itemId = input.dataset.itemId;
        const unitPriceElement = document.querySelector(`[data-item-id="${itemId}"] td:nth-child(4)`);

        if (unitPriceElement) {
          const unitPrice = parseFloat(unitPriceElement.textContent);
          const totalAmount = amount * unitPrice;
          totalOrderAmount += totalAmount;
        }
      }
    });

    const totalAmountField = document.getElementById('total');
    totalAmountField.value = totalOrderAmount.toFixed(2);
  }

  function saveCustomerItems() {
    const customerInput = document.getElementById('customerInput');
    const invoiceDate = document.getElementById('invoiceDate');
    const totalAmountField = document.getElementById('total');

    const customer = customerInput.value.trim();
    const date = invoiceDate.value;
    const totalAmount = parseFloat(totalAmountField.value);

    if (!customer) {
      showError("Please provide a customer name.");
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
    const amountInputs = document.querySelectorAll('.amountInput');
    amountInputs.forEach(input => {
      const itemId = input.dataset.itemId;
      const amount = parseFloat(input.value);
      if (!isNaN(amount) && amount > 0) {
        items.push({ item_id: itemId, amount: amount });
      }
    });

    if (items.length === 0) {
      showError("Please provide at least one valid item amount.");
      return;
    }

    const data = {
      customer: customer,
      iPubDate: date,
      iTotal: totalAmount,
      items: items,
    };

    fetch('/save_customer_items/', {
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
      showError("An error occurred. Please try again.");
    });
  }

  function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
  }

  function showSuccess(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.color = 'green';
  }

  // Listen for input changes in the amount fields
  const amountInputs = document.querySelectorAll('.amountInput');
  amountInputs.forEach(input => {
    input.addEventListener('input', handleAmountInputChange);
  });

  // Call updateTotalAmounts on page load
  updateTotalAmounts();

  // Calculate total and save customer items on button click
  const calculateButton = document.getElementById('calculateButton');
  const saveButton = document.getElementById('saveButton');
  calculateButton.addEventListener('click', updateTotalOrderAmount);
  saveButton.addEventListener('click', saveCustomerItems);
});
