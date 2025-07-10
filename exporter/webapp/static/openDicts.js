// Helper functions
function closeAllDropdowns(currentDropdown) {
  document.querySelectorAll('.dict-dropdown-menu.show').forEach(el => {
    if (el !== currentDropdown) {
      el.classList.remove('show', 'dropdown-up', 'dropdown-down');
      el.closest('.dict-dropdown-container').classList.remove('show');
    }
  });
}

function showDropdown(container, dropdown, triggerElement) {
  container.classList.add('show');
  dropdown.classList.add('show');
  positionDropdown(dropdown, triggerElement);
}

function closeDropdown(container, dropdown) {
  container.classList.remove('show');
  dropdown.classList.remove('show', 'dropdown-up', 'dropdown-down');
}

function positionDropdown(dropdown, triggerElement) {
  const triggerRect = triggerElement.getBoundingClientRect();
  const dropdownHeight = dropdown.offsetHeight;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  
  dropdown.classList.remove('dropdown-up', 'dropdown-down');
  
  if (spaceBelow >= dropdownHeight + 20 || spaceBelow >= spaceAbove) {
    dropdown.classList.add('dropdown-down');
    dropdown.style.left = `${triggerRect.left}px`;
    dropdown.style.top = `${triggerRect.bottom}px`;
  } else {
    dropdown.classList.add('dropdown-up');
    dropdown.style.left = `${triggerRect.left}px`;
    dropdown.style.bottom = `${window.innerHeight - triggerRect.top}px`;
  }
}

function setupCloseHandler(container, dropdown) {
  const closeHandler = (e) => {
    if (!container.contains(e.target)) {
      closeDropdown(container, dropdown);
      document.removeEventListener('click', closeHandler);
    }
  };
  document.addEventListener('click', closeHandler);
}

// Main dropdown functions
function toggleDictDropdown(event, button) {
  event.preventDefault();
  event.stopPropagation();
  const container = button.closest('.dict-dropdown-container');
  const dropdown = container.querySelector('.dict-dropdown-menu');
  closeAllDropdowns(dropdown);
  
  const isShowing = container.classList.contains('show');
  if (!isShowing) {
    showDropdown(container, dropdown, button);
  } else {
    closeDropdown(container, dropdown);
  }
  setupCloseHandler(container, dropdown);
}

function toggleRemoteDictDropdown(event, button) {
  event.preventDefault();
  event.stopPropagation();
  const container = document.querySelector('.dict-dropdown-container');
  const dropdown = container.querySelector('.dict-dropdown-menu');
  closeAllDropdowns(dropdown);
  showDropdown(container, dropdown, button);
  setupCloseHandler(container, dropdown);
}

// Dictionary functions
function openDictionaries(event) {
  event.preventDefault();
  const query = document.getElementById('search-box')?.value.trim().toLowerCase();

  if (query) {
    navigator.clipboard.writeText(query).catch(err => {
      console.warn('Clipboard copy failed:', err);
    });
  }

  const dictionaries = [
    {
      name: 'PTS',
      method: 'GET',
      base: 'https://dsal.uchicago.edu/cgi-bin/app/pali_query.py?searchhws=yes&matchtype=default&qs=',
      fallback: 'https://dsal.uchicago.edu/dictionaries/pali/'
    },
    {
      name: 'Gandhari',
      method: 'GET',
      base: 'https://gandhari.org/dictionary?section=dop&search=',
      fallback: 'https://gandhari.org/dop'
    },
    {
      name: 'CPD', 
      method: 'POST',
      base: 'https://cpd.uni-koeln.de/search',
      params: { getText: '' },
      fallback: 'https://cpd.uni-koeln.de/search'
    },
    {
      name: 'Glosbe',
      method: 'GET',
      base: 'https://glosbe.com/pi/sa/',
      fallback: 'https://glosbe.com/pi/sa/'
    },
    {
      name: 'MWScan',
      method: 'GET',
      base: 'https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/indexcaller.php?transLit=roman&key=',
      fallback: 'https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/index.php'
    },
    {
      name: 'APScan',
      method: 'GET',
      base: 'https://www.sanskrit-lexicon.uni-koeln.de/scans/APScan/2020/web/webtc/indexcaller.php?transLit=roman&key=',
      fallback: 'https://www.sanskrit-lexicon.uni-koeln.de/scans/APScan/2020/web/index.php'
    },
    {
      name: 'MDScan',
      method: 'GET',
      base: 'https://www.sanskrit-lexicon.uni-koeln.de/scans/MDScan/2020/web/webtc/indexcaller.php?transLit=roman&key=',
      fallback: 'https://www.sanskrit-lexicon.uni-koeln.de/scans/MDScan/2020/web/index.php'
    },
    {
      name: 'Wisdomlib',
      method: 'GET',
      base: 'https://www.wisdomlib.org/index.php?type=search&division=glossary&item=&mode=text&input=',
      fallback: 'https://www.wisdomlib.org/'
    }
  ];

  dictionaries.forEach(dict => {
    if (!query) {
      window.open(dict.fallback, '_blank');
      return;
    }

    if (dict.method === 'GET') {
      window.open(dict.base + encodeURIComponent(query), '_blank');
    } else if (dict.method === 'POST') {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = dict.base;
      form.target = '_blank';
      form.style.display = 'none';

      for (const key in dict.params) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = (key === 'key' || key === 'getText') ? query : dict.params[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }
  });
}

function openWithQuery(event, baseUrl) {
  event.preventDefault();
  const searchInput = document.getElementById('search-box');
  const query = searchInput?.value.trim().toLowerCase() || '';
  
  if (query) {
    navigator.clipboard.writeText(query)
      .then(() => console.log('Скопировано:', query))
      .catch(err => console.error('Ошибка:', err));
  }

  const finalUrl = baseUrl + encodeURIComponent(query);
  console.log('Открываю:', finalUrl);
  window.open(finalUrl, '_blank');
  return false;
}

function openWithQueryMulti(event, baseUrls) {
  event.preventDefault();
  const searchInput = document.getElementById('search-box');
  const query = searchInput?.value.trim().toLowerCase() || '';
  
  if (!query) {
    showBubbleNotification('Please enter a search query');
    return false;
  }

  navigator.clipboard.writeText(query)
    .then(() => showBubbleNotification('Query copied: ' + query))
    .catch(err => console.error('Copy failed:', err));

  const encodedQ = encodeURIComponent(query);
  baseUrls.forEach((baseUrl, index) => {
    const finalUrl = baseUrl + encodedQ;
    setTimeout(() => {
      console.log('Opening:', finalUrl);
      window.open(finalUrl, '_blank');
    }, 1 * index);
  });

  return false;
}

// Make sure functions are available when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.toggleDictDropdown = toggleDictDropdown;
  window.toggleRemoteDictDropdown = toggleRemoteDictDropdown;
  window.openDictionaries = openDictionaries;
  window.openWithQuery = openWithQuery;
  window.openWithQueryMulti = openWithQueryMulti;
});