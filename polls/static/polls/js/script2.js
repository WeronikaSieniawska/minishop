function getCSRFToken() {
  const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  } else {
    return null;
  }
}

function updateTotalAmounts() {
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const quantity = parseInt(row.querySelector('td:nth-child(3)').textContent, 10);
    const unitPrice = parseFloat(row.querySelector('td:nth-child(4)').textContent);
    const totalAmountCell = row.querySelector('.total_amount');
    const totalAmount = quantity * unitPrice;
    console.log(quantity);
    totalAmountCell.textContent = totalAmount.toFixed(2);
  });
}

function handleAmountInputChange(event, quantity) {
  const input = event.target;
  const amount = parseFloat(input.value);
  console.log('handleAmountInputChange called');
  if (!isNaN(amount)) {
    const itemId = input.dataset.itemId;
    const totalAmountCell = document.querySelector(`[data-item-id="${itemId}"] .total_amount`);
    console.log(quantity);

    const unitPriceElement = document.querySelector(`[data-item-id="${itemId}"] td:nth-child(4)`);
    const unitPrice = unitPriceElement ? parseFloat(unitPriceElement.textContent) : 0;
    console.log(quantity);
    const totalAmount = amount * unitPrice;
    totalAmountCell.textContent = totalAmount.toFixed(2);
    }

    updateTotalOrderAmount();
  }


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

function savePurchaseOrder(supplier, date, totalAmount, items) {
  // Zapisujemy fakturę i jej elementy do bazy danych
  const data = {
    supplier: supplier,
    pubDate: date,
    total: totalAmount,
    items: items,
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
      showError("An error occurred while saving the invoice. Please try again.");
    });
}

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

  // Sprawdzenie, czy klient o podanej nazwie istnieje w bazie danych
  fetch(`/check_supplier_exists/?name=${encodeURIComponent(supplier)}`)
    .then(response => response.json())
    .then(data => {
      if (!data.exists) {
        // Jeśli dostawca nie istnieje, dodajemy nowy rekord do tabeli Suppliers
        fetch('/add_supplier/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify({ supplier: supplier }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              showError("An error occurred while adding the supplier to the database.");
            } else {
              // Po dodaniu klienta, zapisujemy fakturę
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
                showError("Please provide at least one valid item amount greater than 0.");
                return;
              }

              savePurchaseOrder(supplier, date, totalAmount, items);
            }
          })
          .catch(error => {
            showError("An error occurred while adding the supplier to the database.");
          });
      } else {
        // Jeśli dostawca istnieje, zapisujemy po prostu fakturę
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
          showError("Please provide at least one valid item amount greater than 0.");
          return;
        }

        savePurchaseOrder(supplier, date, totalAmount, items);
      }
    })
    .catch(error => {
      showError("An error occurred while checking if the supplier exists.");
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

document.addEventListener('DOMContentLoaded', function () {
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
  saveButton.addEventListener('click',saveSupplierItems);
});
