
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
  
  const searchInput = document.getElementById('search-box');
  const query = searchInput?.value.trim().toLowerCase() || '';
  
  if (query) {
    navigator.clipboard.writeText(query)
      .then(() => console.log('Скопировано:', query))
      .catch(err => console.error('Ошибка:', err));
  }

  // Исправлено: правильно добавляем query к URL
  const finalUrl = baseUrl + (baseUrl.includes('?') ? '&' : '?') + 'q=' + encodeURIComponent(query);
  console.log('Открываю:', finalUrl);
  
  window.open(finalUrl, '_blank');
  
  return false;
}

function openWithQueryMulti(event, baseUrls) {
  event.preventDefault();
  
  const searchInput = document.getElementById('search-box');
  const query = searchInput?.value.trim().toLowerCase() || '';
  
  navigator.clipboard.writeText(query)
    .then(() => showBubbleNotification('Query copied: ' + query))
    .catch(err => console.error('Copy failed:', err));

  const encodedQ = encodeURIComponent(query);
  baseUrls.forEach((baseUrl, index) => {
    // Просто заменяем {{q}} в URL на закодированный запрос
    const finalUrl = baseUrl.replace('{{q}}', encodedQ);
    
    setTimeout(() => {
      console.log('Opening:', finalUrl);
      window.open(finalUrl, '_blank');
    }, 100 * index); // Небольшая задержка между открытием вкладок
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
    if (el !== dropdown) el.classList.remove('show');
  });
  
  // Переключить текущий dropdown
  container.classList.toggle('show');
  dropdown.classList.toggle('show');
  
  // Закрытие при клике вне дропдауна
  const closeHandler = function(e) {
    if (!container.contains(e.target)) {
      container.classList.remove('show');
      dropdown.classList.remove('show');
      document.removeEventListener('click', closeHandler);
    }
  };
  
  document.addEventListener('click', closeHandler);
}
