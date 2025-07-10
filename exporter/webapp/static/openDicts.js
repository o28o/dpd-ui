
//  <a href="#" onclick="openDictionaries(event)">Dict</a>
// Показать уведомление
function showBubbleNotification(text) {
  const bubble = document.getElementById('bubbleNotification');
  if (!bubble) return;
  
  bubble.textContent = text;
  bubble.classList.add('show');
  
  setTimeout(() => {
    bubble.classList.remove('show');
  }, 2000);
}


function openDictionaries(event) {
  event.preventDefault();
const query = document.getElementById('search-box')?.value.trim().toLowerCase().replace(/ṁ/g, 'ṃ');


 // Копирование в буфер обмена
if (query) {
    showBubbleNotification('Copied to clipboard');
  navigator.clipboard.writeText(query).catch(err => {
    console.warn('Clipboard copy failed:', err);
  });
}

  const dictionaries = [
    // GET-поиск
    {
      name: 'PTS',
      method: 'GET',
      base: 'https://dsal.uchicago.edu/cgi-bin/app/pali_query.py?matchtype=default&qs=',
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
  const query = searchInput?.value.trim().toLowerCase().replace(/ṁ/g, 'ṃ') || '';
  
  // 2. Копируем в буфер обмена

if (query) {
    showBubbleNotification('Copied to clipboard');
  navigator.clipboard.writeText(query).catch(err => {
    console.warn('Clipboard copy failed:', err);
  });
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
  const query = searchInput?.value.trim().toLowerCase().replace(/ṁ/g, 'ṃ') || '';
  

  // 2. Копируем в буфер обмена
  
  if (query) {
    showBubbleNotification('Copied to clipboard');
    navigator.clipboard.writeText(query).catch(err => {
      console.warn('Clipboard copy failed:', err);
    });
  }

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



function createDropdowns() {
  const dictionaryData = {
    ru: {
      groups: "Группы Словарей",
      pali: "Палийские словари",
      sanskrit: "Санскритские словари",
      other: "Другие ресурсы",
    },
    en: {
      groups: "Dictionary Groups",
      pali: "Pali Dictionaries",
      sanskrit: "Sanskrit Dictionaries",
      other: "Other Resources",
    },
  };

  const lang = document.documentElement.lang === "ru" ? "ru" : "en";
  const texts = dictionaryData[lang];

  const dropdownHTML = `
    <div class="dropdown-section">
      <div class="dropdown-header">${texts.groups}</div>
      <a class="dropdown-item" href="javascript:void(0)" onclick="openDictionaries(event)">
        <span class="dropdown-icon">📚</span> 4 Pali + 4 Skr + Wlib
      </a>
      <a class="dropdown-item" target="_blank" href="#" 
        title="PTS Pali Dictionary + Critical Pali Dictionary + Gandhari Dictionary"
        onclick="return openWithQueryMulti(event, [
          'https://dsal.uchicago.edu/cgi-bin/app/pali_query.py?matchtype=default&qs=',
          'https://gandhari.org/dictionary?section=dop&search='
          'https://cpd.uni-koeln.de/search?query=',
        ])">
        <span class="dropdown-icon">📚</span> Pali PTS, Cone, CPD
      </a>
      <a class="dropdown-item" target="_blank" href="#" 
        title="Monier-Williams + Shabda-Sagara + Apte Practical + Macdonell"
        onclick="return openWithQueryMulti(event, [
          'https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/indexcaller.php?transLit=roman&key=',
          'https://www.sanskrit-lexicon.uni-koeln.de/scans/SHSScan/2020/web/webtc/indexcaller.php?transLit=roman&key=',
          'https://www.sanskrit-lexicon.uni-koeln.de/scans/APScan/2020/web/webtc/indexcaller.php?transLit=roman&key=',
          'https://www.sanskrit-lexicon.uni-koeln.de/scans/MDScan/2020/web/webtc/indexcaller.php?transLit=roman&key='
        ])">
        <span class="dropdown-icon">📚</span> Skr MW, SHS, AP, MD
      </a>
    </div>
    
    <div class="dropdown-section">
      <div class="dropdown-header">${texts.pali}</div>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://dsal.uchicago.edu/cgi-bin/app/pali_query.py?matchtype=default&qs=')">
        <span class="dropdown-icon">🏛️</span> PTS Dictionary
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://gandhari.org/dictionary?section=dop&search=')">
        <span class="dropdown-icon">🏛️</span> Cone Gandhari.org
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://cpd.uni-koeln.de/search?query=')">
        <span class="dropdown-icon">🏛️</span> Critical Pali Dict (CPD)
      </a>
    </div>
    
    <div class="dropdown-section">
      <div class="dropdown-header">${texts.sanskrit}</div>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/indexcaller.php?transLit=roman&key=')">
        <span class="dropdown-icon">📜</span> Monier-Williams
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://www.sanskritdictionary.com/?iencoding=iast&lang=sans&action=Search&q=')">
        <span class="dropdown-icon">📜</span> Sanskrit Dictionary
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://www.learnsanskrit.cc/translate?dir=au&search=')">
        <span class="dropdown-icon">📜</span> LearnSanskrit
      </a>
    </div>
    
    <div class="dropdown-section">
      <div class="dropdown-header">${texts.other}</div>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://dharmamitra.org/?target_lang=english-explained&input_sentence=')">
        <span class="dropdown-icon">🌍</span> Mitra Translator
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://www.wisdomlib.org/index.php?type=search&division=glossary&item=&mode=text&input=')">
        <span class="dropdown-icon">🌍</span> Wisdomlib
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://glosbe.com/pi/sa/')">
        <span class="dropdown-icon">🌍</span> Glosbe Pli-Skr
      </a>
      <a class="dropdown-item" target="_blank" href="javascript:void(0)" onclick="return openWithQuery(event, 'https://www.aksharamukha.com/converter?target=&text=')">
        <span class="dropdown-icon">🌍</span> Aksharamukha
      </a>
    </div>
  `;

  document.querySelectorAll(".dict-dropdown-menu-down, .dict-dropdown-menu").forEach(
    (el) => (el.innerHTML = dropdownHTML)
  );
}

document.addEventListener("DOMContentLoaded", createDropdowns);


function toggleDictDropdown(event) {
  event.preventDefault();
  event.stopPropagation();

  const container = event.currentTarget.closest('.dict-dropdown-container');
  if (!container) return;

  const dropdown = container.querySelector('.dict-dropdown-menu, .dict-dropdown-menu-down');
  if (!dropdown) return;

  // Закрываем другие открытые меню
  document.querySelectorAll('.dict-dropdown-menu.show, .dict-dropdown-menu-down.show').forEach(el => {
    if (el !== dropdown) el.classList.remove('show');
  });

  // Переключаем видимость текущего меню
  dropdown.classList.toggle('show');

  // === Адаптация max-height при открытии ===
  if (dropdown.classList.contains('show')) {
    adjustDropdownHeight(container, dropdown);
  }

  // Удаляем предыдущий обработчик закрытия
  if (container._closeHandler) {
    document.removeEventListener('click', container._closeHandler);
  }

  // Назначаем новый обработчик закрытия
  container._closeHandler = function(e) {
    if (!container.contains(e.target)) {
      dropdown.classList.remove('show');
      document.removeEventListener('click', container._closeHandler);
      window.removeEventListener('resize', container._resizeHandler);
      delete container._closeHandler;
      delete container._resizeHandler;
    }
  };

  document.addEventListener('click', container._closeHandler);

  // === Добавляем обработчик resize ===
  container._resizeHandler = function() {
    if (dropdown.classList.contains('show')) {
      adjustDropdownHeight(container, dropdown);
    }
  };
  window.addEventListener('resize', container._resizeHandler);
}


function adjustDropdownHeight(container, dropdown) {
  const rect = container.getBoundingClientRect();
  const margin = 8;
  const padding = 16;

  // Высота окна и ограничение 70% от неё
  const maxVhHeight = window.innerHeight * 0.7;

  let availableSpace;

  if (dropdown.classList.contains('dict-dropdown-menu-down')) {
    availableSpace = window.innerHeight - rect.bottom - margin - padding;
  } else {
    availableSpace = rect.top - margin - padding;
  }

  // Ограничим меньшим из двух: доступным и 70vh
  const finalHeight = Math.max(100, Math.min(availableSpace, maxVhHeight));

  dropdown.style.maxHeight = `${finalHeight}px`;
}
