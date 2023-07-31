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
    const itemId = input.dataset.itemId;
    const totalAmountCell = document.querySelector(`[data-item-id="${itemId}"] .total_amount`);
    const unitPrice = parseFloat(document.querySelector(`[data-item-id="${itemId}"] td:nth-child(4)`).textContent);

    const quantity = parseInt(document.querySelector(`[data-item-id="${itemId}"] td:nth-child(3)`).textContent, 10);
    const errorMessage = document.querySelector(`[data-item-id="${itemId}"] .error-message`);

    if (isNaN(amount) || amount < 0) {
      errorMessage.textContent = 'Invalid input';
      totalAmountCell.textContent = (0).toFixed(2);
    } else if (amount > quantity) {
      errorMessage.textContent = `Exceeded quantity (${quantity})`;
      totalAmountCell.textContent = (quantity * unitPrice).toFixed(2);
    } else {
      errorMessage.textContent = '';
      const totalAmount = amount * unitPrice;
      totalAmountCell.textContent = totalAmount.toFixed(2);
    }

    updateTotalOrderAmount();
  }

  function updateTotalOrderAmount() {
    const amountInputs = document.querySelectorAll('.amountInput');
    let totalOrderAmount = 0;
    amountInputs.forEach(input => {
      const amount = parseFloat(input.value);
      if (!isNaN(amount)) {
        const itemId = input.dataset.itemId;
        const unitPrice = parseFloat(document.querySelector(`[data-item-id="${itemId}"] td:nth-child(4)`).textContent);
        const totalAmount = amount * unitPrice;
        totalOrderAmount += totalAmount;
      }
    });
    const totalAmountField = document.getElementById('total');
    totalAmountField.value = totalOrderAmount.toFixed(2);
  }

  // Listen for input changes in the amount fields
  const amountInputs = document.querySelectorAll('.amountInput');
  amountInputs.forEach(input => {
    input.addEventListener('input', handleAmountInputChange);
  });

  // Calculate Total Order Amount on Calculate Total button click
  const calculateButton = document.getElementById('calculateButton');
  calculateButton.addEventListener('click', function () {
    updateTotalOrderAmount();
  });

  // Call updateTotalAmounts on page load
  updateTotalAmounts();
});
