
//  <a href="#" onclick="openDictionaries(event)">Dict</a>

function openDictionaries(event) {
  event.preventDefault();
const query = document.getElementById('search-box')?.value.trim().toLowerCase();


 // Копирование в буфер обмена
  if (query) {
    navigator.clipboard.writeText(query).catch(err => {
      console.warn('Clipboard copy failed:', err);
    });
  }

  const dictionaries = [
    // GET-поиск
    {
      name: 'PTS',
      method: 'GET',
      base: 'https://dsal.uchicago.edu/cgi-bin/app/pali_query.py?searchhws=yes&matchtype=default&qs=',
      fallback: 'https://dsal.uchicago.edu/dictionaries/pali/'
    },
   /*   {
      name: 'DPD',
      method: 'GET',
      base: 'https://dict.dhamma.gift/search_html?source=pwa&q=',
      fallback: 'https://dict.dhamma.gift/?source=pwa'
    },*/
    
    {
      name: 'Gandhari', // Нет поддержки поиска извне
      method: 'GET',
      base: 'https://gandhari.org/dictionary?section=dop&search=',
      fallback: 'https://gandhari.org/dop'
    },
    {
      name: 'CPD', 
      method: 'POST', // POST-поиск: CPD доделать 
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
    } else if (dict.method === 'NONE') {
      window.open(dict.fallback, '_blank');
    }
  });
}

function openWithQuery(event, baseUrl) {
  event.preventDefault();
  
  // 1. Получаем текущее значение из поля поиска
  const searchInput = document.getElementById('search-box');
  const query = searchInput?.value.trim().toLowerCase() || '';
  
  // 2. Копируем в буфер обмена
  if (query) {
    navigator.clipboard.writeText(query)
      .then(() => console.log('Скопировано:', query))
      .catch(err => console.error('Ошибка:', err));
  }

  // 3. Формируем URL (просто добавляем query в конец)
  const finalUrl = baseUrl + encodeURIComponent(query);
  console.log('Открываю:', finalUrl);
  
  // 4. Открываем в новой вкладке
  window.open(finalUrl, '_blank');
  
  return false;
}

function openWithQueryMulti(event, baseUrls) {
  event.preventDefault();
  
  // 1. Получаем текущее значение из поля поиска
  const searchInput = document.getElementById('search-box');
  const query = searchInput?.value.trim().toLowerCase() || '';
  
  if (!query) {
    showBubbleNotification('Please enter a search query');
    return false;
  }

  // 2. Копируем в буфер обмена
  navigator.clipboard.writeText(query)
    .then(() => showBubbleNotification('Query copied: ' + query))
    .catch(err => console.error('Copy failed:', err));

  // 3. Формируем и открываем URL для каждого словаря
  const encodedQ = encodeURIComponent(query);
  baseUrls.forEach((baseUrl, index) => {
    const finalUrl = baseUrl + encodedQ;
    
    setTimeout(() => {
      console.log('Opening:', finalUrl);
      window.open(finalUrl, '_blank');
    }, 1 * index); // Небольшая задержка между открытием вкладок
  });

  return false;
}

function toggleDictDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const container = event.currentTarget.closest('.dict-dropdown-container');
  const dropdown = container.querySelector('.dict-dropdown-menu');
  
  // Закрыть все открытые dropdowns
  document.querySelectorAll('.dict-dropdown-menu.show').forEach(el => {
    if (el !== dropdown) {
      el.classList.remove('show', 'dropdown-up', 'dropdown-down');
      el.closest('.dict-dropdown-container').classList.remove('show');
    }
  });
  
  // Переключить текущий dropdown
  const isShowing = container.classList.contains('show');
  
  if (!isShowing) {
    // Показываем dropdown перед расчетами
    container.classList.add('show');
    dropdown.classList.add('show');
    
    // Получаем позиции элементов
    const toggleRect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;
    
    // Проверяем доступное пространство
    const spaceBelow = window.innerHeight - toggleRect.bottom;
    const spaceAbove = toggleRect.top;
    
    // Определяем направление (с запасом в 20px)
    if (spaceBelow >= dropdownHeight + 20 || spaceBelow >= spaceAbove) {
      dropdown.classList.remove('dropdown-up');
      dropdown.classList.add('dropdown-down');
    } else {
      dropdown.classList.remove('dropdown-down');
      dropdown.classList.add('dropdown-up');
    }
  } else {
    // Закрываем dropdown
    container.classList.remove('show');
    dropdown.classList.remove('show', 'dropdown-up', 'dropdown-down');
  }
  
  // Закрытие при клике вне дропдауна
  const closeHandler = (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove('show');
      dropdown.classList.remove('show', 'dropdown-up', 'dropdown-down');
      document.removeEventListener('click', closeHandler);
    }
  };
  
  document.addEventListener('click', closeHandler);
}