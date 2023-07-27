document.addEventListener('DOMContentLoaded', function () {
  // Uchwyt do zakładek
  const invoiceTab = document.getElementById('invoiceTab');
  const purchaseTab = document.getElementById('purchaseTab');
  const incomeTab = document.getElementById('incomeTab');
  const reportsTab = document.getElementById('reportsTab');

  // Uchwyt do zawartości (tabeli i formularza)
  const invoiceForm = document.getElementById('invoiceForm');
  const invoiceTable = document.getElementById('invoiceTable');

  // Ukryj tabelę na starcie (pokazujemy formularz)
  invoiceTable.style.display = 'none';

  // Funkcja do przełączania między zakładkami
  function switchTab(tabId) {
      // Ukryj aktualnie widoczny element
      if (invoiceForm.style.display !== 'none') {
          invoiceForm.style.display = 'none';
      }
      if (invoiceTable.style.display !== 'none') {
          invoiceTable.style.display = 'none';
      }

      // Pokaż nowy element na podstawie tabId
      if (tabId === 'invoiceTab') {
          invoiceForm.style.display = 'block';
      } else {
          invoiceTable.style.display = 'block';
      }
  }

  // Obsługa kliknięcia na zakładki
  invoiceTab.addEventListener('click', () => {
      switchTab('invoiceTab');
  });
  purchaseTab.addEventListener('click', () => {
      switchTab('purchaseTab');
  });
  incomeTab.addEventListener('click', () => {
      switchTab('incomeTab');
  });
  reportsTab.addEventListener('click', () => {
      switchTab('reportsTab');
  });
});
