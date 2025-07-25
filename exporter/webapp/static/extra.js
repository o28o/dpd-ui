// Проверяем, есть ли параметр source=pwa в URL
const urlParams = new URLSearchParams(window.location.search);
const isPWA = urlParams.get('source') === 'pwa';

// Если это PWA и нужно принудительно задать язык
if (isPWA) {
    // Удаляем параметр source=pwa (чтобы он не дублировался после редиректа)
    urlParams.delete('source');

    // Сохраняем оставшиеся параметры в строку (если они есть)
    const remainingQuery = urlParams.toString();
    const queryString = remainingQuery ? `?${remainingQuery}` : '';

    // Проверяем язык в localStorage или определяем его
    let siteLanguage = localStorage.getItem('siteLanguage');

    if (!siteLanguage) {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/ru/')) {
            siteLanguage = 'ru';
        } else if (currentPath.includes('/th/')) {
            siteLanguage = 'th';
        } else {
            const browserLang = navigator.language || navigator.userLanguage;
            siteLanguage = browserLang.startsWith('ru') ? 'ru' : 
                          browserLang.startsWith('th') ? 'th' : 'en';
        }
        localStorage.setItem('siteLanguage', siteLanguage);
    }

    // Получаем текущий путь и хэш
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    // Делаем редирект с сохранением всех параметров (кроме source=pwa) и хэша
    if (siteLanguage === 'ru' && !currentPath.includes('/ru/')) {
        window.location.href = `/ru/${queryString}${currentHash}`;
    } else if (siteLanguage === 'th' && !currentPath.includes('/th/')) {
        window.location.href = `/th/${queryString}${currentHash}`;
    } else if (siteLanguage === 'en' && currentPath !== '/') {
        window.location.href = `/${queryString}${currentHash}`;
    }
}
// ======== Конфигурация ========
const LANGUAGE_PREFIX = '/ru'; // Префикс для русского языка
const DEFAULT_LANG = 'en';     // Язык по умолчанию

// ======== Основной код ========
//document.addEventListener("DOMContentLoaded", applySavedLanguage);
document.addEventListener('keydown', function(event) {
  const isCtrl3 = event.ctrlKey && event.code === 'Digit3';
  const isAlt3 = event.altKey && event.code === 'Digit3';

  if (isCtrl3 || isAlt3) {
    event.preventDefault();

    const currentUrl = window.location.href;
    const currentParams = window.location.search; // включает ? и все параметры

    let targetUrl;

    if (
      currentUrl.includes('/ru') ||
      currentUrl.includes('/r') ||
      currentUrl.includes('/ml')
    ) {
      targetUrl = 'https://dhamma.gift/ru/';
    } else {
      targetUrl = 'https://dhamma.gift/';
    }

    // Добавляем параметры, если есть
    if (currentParams) {
      targetUrl += currentParams;
    }

    window.location.href = targetUrl;
  }
});


document.addEventListener('keydown', function(event) {
  const isCtrl2 = event.ctrlKey && event.code === 'Digit2';
  const isAlt2 = event.altKey && event.code === 'Digit2';

  if (isCtrl2 || isAlt2) {
    event.preventDefault();

    const currentUrl = window.location.href;
    let targetUrl;

    if (
      currentUrl.includes('/ru') ||
      currentUrl.includes('/r') ||
      currentUrl.includes('/ml')
    ) {
      targetUrl = 'https://dhamma.gift/ru/read.php';
    } else {
      targetUrl = 'https://dhamma.gift/read.php';
    }

    window.location.href = targetUrl;
  }
});


document.addEventListener("keydown", handleLanguageShortcut);

// Применяем сохраненный язык при загрузке
/* function applySavedLanguage() {
    const savedLang = localStorage.getItem("preferredLanguage");
    const currentPath = window.location.pathname;
    
    // Если язык не совпадает с сохраненным
    if (savedLang === 'ru' && !currentPath.startsWith(LANGUAGE_PREFIX)) {
        redirectWithLanguage(LANGUAGE_PREFIX + currentPath);
    } else if (savedLang !== 'ru' && currentPath.startsWith(LANGUAGE_PREFIX)) {
        redirectWithLanguage(currentPath.slice(LANGUAGE_PREFIX.length));
    }
}*/

// Обработка горячих клавиш
function handleLanguageShortcut(event) {
    if ((event.altKey || event.ctrlKey) && event.code === "Digit1") {
        event.preventDefault();
        toggleLanguage();
    }
}

// Переключение языка
function toggleLanguage() {
    const currentPath = window.location.pathname;
    let newPath, newLang;
    
    if (currentPath.startsWith(LANGUAGE_PREFIX)) {
        newPath = currentPath.slice(LANGUAGE_PREFIX.length) || '/';
        newLang = DEFAULT_LANG;
    } else {
        newPath = LANGUAGE_PREFIX + (currentPath === '/' ? '' : currentPath);
        newLang = 'ru';
    }
    
    localStorage.setItem("preferredLanguage", newLang);
    redirectWithLanguage(newPath);
}

// Безопасный редирект
function redirectWithLanguage(newPath) {
    // Проверяем, не пытаемся ли перейти на тот же URL
    if (window.location.pathname !== newPath) {
        const newUrl = new URL(window.location.href);
        newUrl.pathname = newPath;
        window.location.href = newUrl.toString();
    }
}


// Add this with other hotkey listeners
document.addEventListener('keydown', function(event) {
  if (event.altKey && event.code === 'KeyT') {
    event.preventDefault();
    toggleThemeProgrammatically();
  }
});

// Add this function to programmatically toggle the theme
function toggleThemeProgrammatically() {
  themeToggle.checked = !themeToggle.checked;
  const event = new Event('change');
  themeToggle.dispatchEvent(event);
}

document.addEventListener('keydown', (event) => {
  if (event.altKey && (event.code === 'Period' || event.code === 'KeyQ')) {
    event.preventDefault();

openDictionaries(event);
  }
});

//установка фокуса в инпуте по нажатию / 
document.addEventListener('keydown', function(event) {
    // Проверяем именно символ / (код 191 или Slash)
    if (event.key === '/' || event.code === 'Slash') {
        // Ищем все возможные инпуты
        const inputs = document.querySelectorAll(
            '#search-box[type="search"], #paliauto[type="text"], .dtsb-value.dtsb-input'
        );
		        
        // Если нет ни одного подходящего инпута - выходим
        if (inputs.length === 0) return;
        
        // Берем первый подходящий инпут (или можно реализовать более сложную логику выбора)
        const input = inputs[0];
        
        // Предотвращаем действие по умолчанию только если нашли инпут
        event.preventDefault();
        
        // Фокусируемся и перемещаем курсор в конец
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
});

// Отключаем перехват / когда фокус уже в инпуте
const handleInputKeydown = (event) => {
    if (event.key === '/' || event.code === 'Slash') {
        event.stopPropagation();
    }
};

// Вешаем обработчики на все существующие и будущие инпуты
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', handleInputKeydown);
});

// Наблюдатель для динамически добавляемых инпутов
new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'INPUT') {
                node.addEventListener('keydown', handleInputKeydown);
            } else if (node.querySelectorAll) {
                node.querySelectorAll('input').forEach(input => {
                    input.addEventListener('keydown', handleInputKeydown);
                });
            }
        });
    });
}).observe(document.body, { childList: true, subtree: true });

//конец фокуса в инпуте по нажатию / 


let startMessage;
//<p class="message"><a class="installButton" >Install Dict.DG</a> to enable lookup by sharing words from any site of app</p>
//<p class="message">
//    More info: <a href="https://docs.dpdict.net/webapp/" target="_blank">Site</a> or 
//    <a href="https://docs.dpdict.net/" target="_blank">DPD in general</a>.
//</p>


function initStartMessage(lang) {
    if (language === 'en') {
        startMessage = `
<div class="message-container">
  <div class="messages-content">
    <p class="message">Search in Pāḷi using <b>Autocomplete</b> or <b>Velthuis</b>, or use English.</p>
    <p class="message"><b>Click the Grammar Dictionary table</b> and it'll become sortable.</p>
    <p class="message">For <b>Pali Lookup on any sites</b>: <a title='Chrome, Opera, Brave, Edge or Yandex Browser. Also available in Firefox Add-ons' target="_blank" href='https://chromewebstore.google.com/detail/dhammagift-search-and-wor/dnnogjdcmhbiobpnkhdbfnfjnjlikabd?authuser=1&hl=en'>Browser Extention</a>, <a href='#' title='Chrome Android menu → "Add to Home screen"' id='installLink'>Web</a> or <a target="" href="https://dhamma.gift/assets/apk/dict.dhamma.gift-latest.apk" title="Latest APK file for Dict.Dhamma.Gift TWA">Android</a> App. Then: select the word → in OS "share" menu choose Dict.DG.</p>
  </div>

  <input type="checkbox" id="toggle-messages" class="toggle-checkbox">
  
  <div class="collapsible">
    <p class="message">
    
    </p>
    <p class="message">
  <b>Available Hotkeys:</b> press <strong>/</strong> to activate the search bar<br>
  <strong>Ctrl+1</strong> or <strong>Alt+1</strong> — Toggle English/Russian<br>
  <strong>Ctrl+2</strong> or <strong>Alt+2</strong> — Open <em>Dhamma.Gift Read</em><br>
  <strong>Ctrl+3</strong> or <strong>Alt+3</strong> — Open <em>Dhamma.Gift Search</em><br>
  <strong>Alt+Q</strong> — Look up word in multiple dictionaries<br>
  <strong>Alt+T</strong> — Toggle Theme
</p>
    <p class="message"><b>Footer links</b>: Dict - to search the word in other dicts, DG - with Dhamma.Gift, DPD - in Dpdict.net</p>
    <p class="message">Adjust <b>Settings</b> as needed including changing language. <b>Refresh</b> page if issues occur.</p>
    <p class="message"><b>Double-click</b> any word to search. e.g.: kāmarāgapariyuṭṭhitena peace kar gacchatīti Root✓</p>
 <p class="message">
<strong>Autosuggestions</strong>: from the Four Nikāyas (DN, MN, SN, AN), parts of the KN (Dhp, Iti, Ud, Snp), and all sections of the Vinaya, Mahāsaṅgīti edition; exc variants readings .<br>
<strong>Match count</strong> (e.g., mettā 27) shows how many times the word appears in these texts.
</p>


  </div>
  
  <div class="toggle-button-container">
    <label for="toggle-messages" class="toggle-button">
      <span class="more-text">More</span>
      <span class="hide-text">Hide</span>
    </label>
  </div>
</div>
`;
    } else if (language === 'ru') {
        startMessage = `
        <div class="message-container">
  <div class="messages-content">
<p class="message">Ищите на пали с <b>Автоподсказками</b> или <b>Velthuis</b>, или русском .</p>
<p class="message"><b>Кликните по таблице</b> в Словаре Грамматики, её можно сортировать.</p>
<p class="message">Для <b>словаря на любом сайте</b> есть: <a target='_blank' title='Chrome, Opera, Brave, Edge или Yandex Browser. Также есть в Fierfox Add-ons' href='https://chromewebstore.google.com/detail/dhammagift-search-and-wor/dnnogjdcmhbiobpnkhdbfnfjnjlikabd?authuser=1&hl=ru'>Расширение</a>, и <a title='также через Меню Chrome Android → "Добавить на главную" → Установить' href='#' id='installLink'>Web</a> или <a target="" href="https://dhamma.gift/assets/apk/dict.dhamma.gift-latest.apk" title="Последнее оновление APK для Dict.Dhamma.Gift TWA">Android</a> приложения. 
Затем: выделите слово → в ОС меню "поделиться" выберите Dict.DG.</p>
  </div>
  <input type="checkbox" id="toggle-messages" class="toggle-checkbox">
  
  <div class="collapsible">
<p class="message"><b>Горячие Клавиши</b>: нажмите <strong>/</strong> чтобы активировать строку поиска<br>
<strong>Ctrl+1</strong> или <strong>Alt+1</strong> переключить Рус/Англ<br>
<strong>Ctrl+2</strong> или <strong>Alt+2</strong> открыть Dhamma.Gift Read<br>
<strong>Ctrl+3</strong> или <strong>Alt+3</strong> открыть Dhamma.Gift Search<br>
<strong>Alt+Q</strong> открыть слово в нескольких словарях<br>
<strong>Alt+T</strong> переключить тему

</p>
<p class="message"><b>Ссылки в футере</b> Dict - поиск слова в разных словарях, DG - через Dhamma.Gift, DPD - на Dpdict.net</p>
<p class="message">Попробуйте разные <b>Настройки</b>, включая смену языка. При возникновении проблем <b>Обновите</b> страницу.</p>
<p class="message"><b>Двойной клик</b> по любому слову для поиска. К примеру: kāmarāgapariyuṭṭhitena мир kar gacchatīti Root✓</p>
  
<p class="message">
<strong>Автоподсказки</strong>: слова из Четырёх Никай (DN, MN, SN, AN), части KN (Dhp, Iti, Ud, Snp) и всех разделов Винаи, редакции Mahasangiti, варианты не выводятся.<br>
<strong>Кол-во совпадений</strong> (например, mettā 27) показывает, сколько раз слово встречается в этих текстах.
</p>
  </div>
  
  <div class="toggle-button-container">
    <label for="toggle-messages" class="toggle-button">
      <span class="more-text">Ещё</span>
      <span class="hide-text">Скрыть</span>
    </label>
  </div>
</div>

`;
    }
}


  // Модифицированная функция changeLanguage
function changeLanguage(lang) {

  // Получаем текущий URL и разбиваем его на части
  const url = new URL(window.location.href);
  let path = url.pathname; // Путь (например, "/ru")
  const searchParams = url.search; // Параметры запроса (например, "?q=dukkha")
  const hash = url.hash; // Хэш (например, "#section")
let siteLanguage = '';
  // Удаляем все существующие вхождения '/ru' из пути
  path = path.replace(/^\/ru/, '');

  // Если выбран язык 'ru', добавляем '/ru' в начало пути
  if (lang === 'ru') {
    path = '/ru' + path;
    siteLanguage = 'ru'; 
  } else {
siteLanguage = 'en';
  }

  // Обновляем путь в URL
  url.pathname = path;

    localStorage.setItem('siteLanguage', siteLanguage);

  // Принудительно обновляем страницу с новым URL
  window.location.href = url.toString();
}



//ссылки в футере
const searchBoxForFooter = document.getElementById('search-box');

// Функция для обновления конкретной ссылки
function updateLink(linkId, baseUrl) {
  const link = document.getElementById(linkId);
  if (!link) return;
  
  // Берем текущее значение из поисковой строки
  let query = searchBoxForFooter.value.trim();
  
  // Если поиск пустой, пробуем взять из URL
  if (!query) {
    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('q') || '';
  }
  
  // Создаем URL с параметром
  const url = new URL(baseUrl);
  url.searchParams.set('q', query);
  link.href = url.toString();
}

// Инициализация ссылок при загрузке
//  updateLink('fdg-link', window.location.href.includes('/ru') ? 'https://dhamma.gift/ru/?p=-kn' : 'https://dhamma.gift?p=-kn');
// updateLink('dpd-link', window.location.href.includes('/ru') ? 'https://ru.dpdict.net' : 'https://dpdict.net');

//и обновление при клике
document.getElementById('fdg-link')?.addEventListener('click', () => {
  updateLink('fdg-link', window.location.href.includes('/ru') ? 'https://dhamma.gift/ru/?p=-kn' : 'https://dhamma.gift?p=-kn');
});
document.getElementById('dpd-link')?.addEventListener('click', () => {
  updateLink('dpd-link', window.location.href.includes('/ru') ? 'https://ru.dpdict.net' : 'https://dpdict.net');
});

//ссылки в футере конец



function toggleSettings() {
  const settingsContent = document.getElementById('settings-content');
  
  // Проверяем, является ли устройство мобильным (ширина экрана меньше 769px)
  if (window.innerWidth < 769) {
    // Переключаем видимость панели
    if (settingsContent.style.display === 'none' || !settingsContent.style.display) {
      settingsContent.style.display = 'block';
    } else {
      settingsContent.style.display = 'none';
    }
  }
}

// Обработчик события для изменения размера окна
window.addEventListener('resize', function() {
  const settingsContent = document.getElementById('settings-content');
  
  // Если окно больше 769px (десктоп), автоматически раскроем панель
  if (window.innerWidth >= 769) {
    settingsContent.style.display = 'block';
  } else {
    // Если окно меньше 769px (мобильное), скрываем панель
    settingsContent.style.display = 'none';
  }
});


function toggleHistory() {
  const historyContent = document.getElementById('history-content');
  
  // Проверяем, является ли устройство мобильным (ширина экрана меньше 769px)
  if (window.innerWidth < 769) {
    // Переключаем видимость панели
    if (historyContent.style.display === 'none' || !historyContent.style.display) {
      historyContent.style.display = 'block';
    } else {
      historyContent.style.display = 'none';
    }
  }
}

// Обработчик события для изменения размера окна
window.addEventListener('resize', function() {
  const historyContent = document.getElementById('history-content');
  
  // Если окно больше 769px (десктоп), автоматически раскроем панель
  if (window.innerWidth >= 769) {
    historyContent.style.display = 'block';
  } else {
    // Если окно меньше 769px (мобильное), скрываем панель
    historyContent.style.display = 'none';
  }
});



function setOneButtonToggleDefault() {
    const toggleId = "one-button-toggle";
    const savedState = localStorage.getItem(toggleId);
    
    if (savedState === null) {
        const toggleElement = document.getElementById(toggleId);
        if (toggleElement) {
            toggleElement.checked = true;
            // Опционально: сохраняем в localStorage, чтобы при следующей загрузке
            // поведение было согласованным
            localStorage.setItem(toggleId, 'true');
        }
    }
}



document.addEventListener('DOMContentLoaded', function() {
   
setOneButtonToggleDefault();

    const button = document.getElementById('search-button');
    if (!button) return;

    const originalHTML = button.innerHTML; // Сохраняем исходное содержимое
    const icon = document.createElement('img');
    icon.src = '/static/magnifying-glass.svg';
    icon.alt = 'Search';
    icon.style.cssText = `
        width: 16px !important;
        height: 16px !important;
        vertical-align: middle;
    `;

// Инициализация - устанавливаем начальное значение из URL
  const urlParams = new URLSearchParams(window.location.search);
  searchBoxForFooter.value = urlParams.get('q') || '';


/*
// Обнуляем существующую функцию changeLanguage
if (typeof changeLanguage === 'function') {
  changeLanguage = function() {}; // Заменяем на пустую функцию
}
*/ 

const tabsToggle = document.getElementById("tabs-toggle");
const tabContainer = document.getElementById("tab-container");

// Проверяем, существуют ли элементы
if (!tabsToggle || !tabContainer) {
    return;
}


// Функция для обновления видимости табов
function updateTabVisibility() {
    const tabsHidden = localStorage.getItem("tabsHidden");

    // Если состояние не задано — считаем, что табы СКРЫТЫ по умолчанию
    if (tabsHidden === "true" || tabsHidden === null) {
        tabContainer.style.display = 'none';     // Скрываем табы
        tabsToggle.checked = false;              // Переключатель ВЫКЛЮЧЕН (hide)
    } else {
        tabContainer.style.display = 'flex';     // Показываем табы
        tabsToggle.checked = true;               // Переключатель ВКЛЮЧЁН (show)
    }
}

// Применяем начальное состояние
updateTabVisibility();

// Обработчик изменения переключателя
tabsToggle.addEventListener("change", function () {
    const isShown = this.checked;

    if (isShown) {
        tabContainer.style.display = 'flex';          // show
        localStorage.setItem("tabsHidden", "false");
    } else {
        tabContainer.style.display = 'none';          // hide
        localStorage.setItem("tabsHidden", "true");
    }
});

//PWA installation
let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e; // Сохраняем событие для будущей установки
  });

const installLink = document.getElementById('installLink');

if (installLink) {
  document.getElementById('installLink').addEventListener('click', async (e) => {
    e.preventDefault();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
    } 
  });
}

});



 function showSpinner() {
    const currentPath = window.location.pathname;
    const isRootPath = currentPath === '/' || currentPath === '/ru/';
    
    if (isRootPath) {
        // Создаем полупрозрачный спиннер
        dpdResults.insertAdjacentHTML('beforeend', `
            <div class="spinner-container transparent-spinner">
                <img src="/static/circle-notch.svg" class="loading-spinner">
            </div>
        `);
        //<div class="loading-text">${language === 'en' ? "Loading..." : "Загрузка..."}</div>
    }
}





  