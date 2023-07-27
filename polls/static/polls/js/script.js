document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
  
    function showTabContent(tabId) {
      tabContents.forEach(content => {
        content.style.display = content.id === tabId ? 'block' : 'none';
      });
    }
  
    function setActiveTab(link) {
      tabLinks.forEach(tabLink => {
        tabLink.classList.remove('active');
      });
      link.classList.add('active');
    }
  
    function handleTabClick(link) {
      const tabId = link.dataset.tab;
      showTabContent(tabId);
      setActiveTab(link);
  
      // Aktualizacja adresu URL w zależności od wybranej zakładki
      const currentURL = window.location.href;
      const baseURL = currentURL.split('?')[0];
      const newURL = `${baseURL}?tab=${tabId}`;
      window.history.pushState({ path: newURL }, '', newURL);
    }
  
    tabLinks.forEach(link => {
      link.addEventListener('click', () => {
        handleTabClick(link);
      });
    });
  
    // Pobranie aktywnej zakładki z adresu URL
    const urlParams = new URLSearchParams(window.location.search);
    const activeTabId = urlParams.get('tab');
  
    // Pokaż zawartość dla aktywnej zakładki i ustaw ją jako aktywną
    const activeTab = document.querySelector(`[data-tab="${activeTabId}"]`);
    if (activeTab) {
      showTabContent(activeTabId);
      setActiveTab(activeTab);
    }
  });
  