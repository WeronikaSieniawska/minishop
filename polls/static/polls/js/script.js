document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
  
    function showTabContent(tabId) {
      tabContents.forEach(content => {
        content.style.display = content.id === tabId ? 'block' : 'none';
      });
  
      // Przekierowanie użytkownika na odpowiedni adres URL na podstawie tabId
      switch (tabId) {
        case 'invoice-of-sales':
          window.location.href = "{% url 'polls:invoice_of_sales' %}";
          break;
        case 'purchase-order':
          window.location.href = "{% url 'polls:purchase_order' %}";
          break;
        case 'income-and-expenditure':
          window.location.href = "{% url 'polls:income_and_expenditure' %}";
          break;
        case 'reports':
          window.location.href = "{% url 'polls:reports' %}";
          break;
        default:
          break;
      }
    }
  
    function setActiveTab(link) {
      tabLinks.forEach(tabLink => {
        tabLink.classList.remove('active');
      });
      link.classList.add('active');
    }
  
    tabLinks.forEach(link => {
      link.addEventListener('click', () => {
        const tabId = link.dataset.tab;
        showTabContent(tabId);
        setActiveTab(link);
      });
    });
  
    // Get the current URL path and extract the active tab from it
    const currentPath = window.location.pathname;
    const activeTabId = currentPath.split('/').pop();
  
    // Show the content for the active tab and set it as active
    const activeTab = document.querySelector(`[data-tab="${activeTabId}"]`);
    if (activeTab) {
      showTabContent(activeTabId);
      setActiveTab(activeTab);
    }
  });
  