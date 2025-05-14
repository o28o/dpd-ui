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
    <p class="message"><b>Lookup words on any sites or apps</b>: Chrome Mobile menu → "Add to Home screen" → Install. Then: select the word → in OS "share" menu choose Dict.DG.</p>
  </div>

  <input type="checkbox" id="toggle-messages" class="toggle-checkbox">
  
  <div class="collapsible">
    <p class="message"><b>Footer links</b>: DG to search the word in Suttas, DPD - on Dpdict.net</p>
    <p class="message">Adjust <b>Settings</b> as needed including changing language. <b>Refresh</b> page if issues occur.</p>
    <p class="message"><b>Double-click</b> any word to search. e.g.: kāmarāgapariyuṭṭhitena peace kar gacchatīti Root✓</p>
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
<p class="message"><b>Переводите слова на любых сайтов и в приложениях</b>: Меню Chrome Mobile → "Добавить на главную" → Install. Затем: выделите слово → в ОС меню "поделиться" выберите Dict.DG.</p>
  </div>

  <input type="checkbox" id="toggle-messages" class="toggle-checkbox">
  
  <div class="collapsible">
<p class="message"><b>Ссылки в футере</b> DG - поиск слова в Суттах, DPD - на Dpdict.net</p>
<p class="message">Попробуйте разные <b>Настройки</b>, включая смену языка. При возникновении проблем <b>Обновите</b> страницу.</p>
<p class="message"><b>Двойной клик</b> по любому слову для поиска. К примеру: kāmarāgapariyuṭṭhitena мир kar gacchatīti Root✓</p>
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

  // Удаляем все существующие вхождения '/ru' из пути
  path = path.replace(/^\/ru/, '');

  // Если выбран язык 'ru', добавляем '/ru' в начало пути
  if (lang === 'ru') {
    path = '/ru' + path;
  }

  // Обновляем путь в URL
  url.pathname = path;

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

// Обработчик ввода в поисковой строке
searchBoxForFooter.addEventListener('input', () => {
  updateLink('fdg-link', window.location.href.includes('/ru') ? 'https://dhamma.gift/ru/?p=-kn' : 'https://dhamma.gift?p=-kn');
  updateLink('dpd-link', window.location.href.includes('/ru') ? 'https://ru.dpdict.net' : 'https://dpdict.net');
});

// Инициализация ссылок при загрузке
  updateLink('fdg-link', window.location.href.includes('/ru') ? 'https://dhamma.gift/ru/?p=-kn' : 'https://dhamma.gift?p=-kn');
updateLink('dpd-link', window.location.href.includes('/ru') ? 'https://ru.dpdict.net' : 'https://dpdict.net');
//ссылки в футере конец

/* первый вариант
//ссылки в футере
//const searchBoxForFooter = document.getElementById('search-box');

function updateFooterLinks(query) {
  // FDG
  const fdgUrl = `https://dhamma.gift?p=-kn&q=${encodeURIComponent(query)}`;
  document.getElementById('fdg-link').href = fdgUrl;

  // DPD
  const dpdUrl = new URL(window.location.href);
  dpdUrl.hostname = 'dpdict.net';
  dpdUrl.protocol = 'https:';
  dpdUrl.port = '';
  dpdUrl.searchParams.set('q', query);
  document.getElementById('dpd-link').href = dpdUrl.toString();
}

// обновляем при вводе текста
searchBoxForFooter.addEventListener('input', () => {
  const query = searchBoxForFooter.value;
  updateFooterLinks(query);
});

// при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const initQuery = new URL(window.location.href).searchParams.get('q') || '';
  updateFooterLinks(initQuery);
});
//ссылки в футере конец
*/

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

document.addEventListener('DOMContentLoaded', function() {
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

//        transform: scaleX(-1);


    function updateButton() {
        const isMobileOrTablet = window.innerWidth <= 1024;
        const isDark = document.body.classList.contains('dark-mode');
        
        // Настройки иконки
        icon.style.filter = isDark ? 'invert(0)' : 'invert(1)';

        if (isMobileOrTablet) {
            // Круглая кнопка с отступом
            button.innerHTML = '';
            button.appendChild(icon);
            button.style.cssText = `
                width: 30px !important;
                height: 30px !important;
                padding: 0;
                border-radius: 50%;
                margin-left: 8px !important; // Отступ от инпута
                border: none !important; // Убираем границы, если они есть
                display: flex;
                align-items: center;
                justify-content: center;
            `;
        } else {
            // Исходный вид
            button.innerHTML = originalHTML;
            button.style.cssText = ''; // Сброс стилей
        }
    }

    // Запуск при изменении размера окна и смене темы
//    window.addEventListener('resize', updateButton);
//    document.getElementById('theme-toggle')?.addEventListener('change', updateButton);
    
//    updateButton(); // Инициализация
});

document.addEventListener("DOMContentLoaded", function () {

/*
// Переопределяем поведение после загрузки home.js
// Ждем когда home.js выполнит свою инициализацию
    setTimeout(function() {
        const dpdResults = document.getElementById('dpd-results');
        if (!dpdResults) return;
        
        // Устанавливаем свой текст независимо от содержимого
        const language = document.documentElement.lang || 'en';
        
        if (language === 'en') {
            dpdResults.innerHTML = `
                <p class="message">Search in Pāḷi or English using <b>Autocomplete</b>, <b>Unicode</b> or <b>Velthuis</b>.</p>
                <p class="message"><b>Double-click</b> any word to search.</p>
                <p class="message">Adjust <b>Settings</b> as needed.</p>
                <p class="message"><b>Refresh</b> if issues occur.</p>
                <p class="message">
                    More info about: <a href="https://docs.dpdict.net/webapp/" target="_blank">Site</a> or 
                    <a href="https://docs.dpdict.net/" target="_blank">DPD in general</a>.
                </p>
                <p class="message">Try: <b>Double-click</b> words below:</p>
                <p class="message">atthi kāmarāgapariyuṭṭhitena peace kar gacchatīti Root✓</p>
            `;
        } else if (language === 'ru') {
            dpdResults.innerHTML = `
                <p class="message">Ищите на пали или русском с <b>Автоподсказками</b>, <b>Unicode</b> или <b>Velthuis</b>.</p>
                <p class="message"><b>Двойной клик</b> по слову для поиска.</p>
                <p class="message"><b>Настройки</b> — доп. функции.</p>
                <p class="message"><b>Обновите</b> страницу при проблемах.</p>
                <p class="message">
                    Подробнее о: <a href="https://docs.dpdict.net/webapp/" target="_blank">Сайте</a> или
                    <a href="https://docs.dpdict.net/" target="_blank">DPD в целом</a>.
                </p>
                <p class="message">Попробуйте: <b>двойной клик</b> по словам ниже:</p>
                <p class="message">atthi kāmarāgapariyuṭṭhitena peace kar gacchatīti Root✓</p>
            `;
        }
    }, 50); // Короткая задержка для гарантии выполнения home.js

*/

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

// Проверяем, существуют ли элементы перед выполнением кода
if (!tabsToggle || !tabContainer) {
    return;
}

// Функция для обновления видимости табов
function updateTabVisibility() {
    const tabsHidden = localStorage.getItem("tabsHidden");

    // Если состояние скрытых табов равно "true", скрываем табы, иначе показываем
    if (tabsHidden === "true") {
        tabContainer.style.display = 'none';  // Скрываем табы
        tabsToggle.checked = true;  // Устанавливаем флажок
    } else {
        tabContainer.style.display = 'flex';  // Показываем табы
        tabsToggle.checked = false;  // Убираем флажок
    }
}

// Проверяем состояние в localStorage и устанавливаем видимость табов при загрузке
updateTabVisibility();

// Обработчик переключения состояния
tabsToggle.addEventListener("change", function () {
    const isHidden = this.checked;

    // Обновляем состояние видимости табов
    if (isHidden) {
        tabContainer.style.display = 'none';  // Скрываем табы
        localStorage.setItem("tabsHidden", "true"); // Сохраняем состояние в localStorage
    } else {
        tabContainer.style.display = 'flex';  // Показываем табы
        localStorage.setItem("tabsHidden", "false"); // Сохраняем состояние в localStorage
    }
});

});


// улучшенные функции двойных кликов и тапов.
// Конфигурация
const TAP_DELAY = 300; // Максимальный интервал между тапами
const SELECTION_CHECK_DELAY = 100; // Задержка проверки выделения

// Переменные состояния
let lastTapTime = 0;
let lastTapTarget = null;
let tapCount = 0;
let pendingSelectionCheck = null;

// Основной обработчик выделения
function processSelection(event) {
    if (event.target.closest('th')) return;
    
    const selection = getValidSelection();
    if (!selection) return;
    
    applySelection(selection, event);
}

// Фолбэк-обработчик тапов
function handleTapWithFallback(event) {
    const now = Date.now();
    const isSameTarget = event.target === lastTapTarget;
    const isDoubleTap = (now - lastTapTime < TAP_DELAY) && isSameTarget;

    // Обновляем состояние тапов
    if (isDoubleTap) {
        tapCount++;
    } else {
        tapCount = 1;
    }
    
    lastTapTime = now;
    lastTapTarget = event.target;

    // Пытаемся обработать как двойной тап
    if (tapCount === 2) {
        event.preventDefault();
        
        // 1. Пытаемся эмулировать dblclick
        try {
            const clickEvent = new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: event.changedTouches?.[0]?.clientX,
                clientY: event.changedTouches?.[0]?.clientY
            });
            event.target.dispatchEvent(clickEvent);
        } catch (e) {
            console.log('Double click emulation failed', e);
        }

        // 2. Фолбэк: прямая обработка через задержку
        clearTimeout(pendingSelectionCheck);
        pendingSelectionCheck = setTimeout(() => {
            const selection = getValidSelection();
            if (selection && !event.defaultPrevented) {
                applySelection(selection, event);
            }
            tapCount = 0;
        }, SELECTION_CHECK_DELAY);
    }
}

// Вспомогательные функции
function getValidSelection() {
    const selection = window.getSelection().toString().trim();
    return selection && !selection.includes('\n') ? selection : null;
}

function applySelection(selection, event) {
    // Отменяем дальнейшую обработку
    if (event) event.preventDefault();
    
    // Применяем выделение
    searchBox.value = selection;
    handleFormSubmit();
    
    // Пытаемся обновить историю
    try {
        history.pushState({ selectedText: selection }, '', `#${encodeURIComponent(selection)}`);
    } catch (e) {
        console.log('History update failed', e);
    }
}

// Инициализация
function initSelectionHandlers() {
    // Стандартные обработчики
    dpdPane.addEventListener('dblclick', processSelection);
    historyPane.addEventListener('dblclick', processSelection);

    // Тач-обработчики с фолбэком
    const touchOptions = { passive: false };
    dpdPane.addEventListener('touchend', handleTapWithFallback, touchOptions);
    historyPane.addEventListener('touchend', handleTapWithFallback, touchOptions);

    // Предотвращаем масштабирование
    document.addEventListener('touchstart', e => {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
}

// Запускаем с проверкой зависимостей
if (window.getSelection && searchBox && typeof handleFormSubmit === 'function') {
    try {
        initSelectionHandlers();
        console.log('Selection handlers initialized');
    } catch (e) {
        console.error('Initialization failed', e);
    }
} else {
    console.error('Required dependencies not found');
}

// NEW: handle browser back/forward
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.selectedText) {
        const selectedText = event.state.selectedText;
        searchBox.value = selectedText;
        handleFormSubmit();
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



//PWA installation
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  }

  let deferredPrompt;
  const installButtons = document.querySelectorAll('.installButton');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Показываем все кнопки с классом installButton
    installButtons.forEach(button => {
      button.style.display = 'inline-block';
    });
  });

  // Добавляем обработчик события click для каждой кнопки
  installButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Пользователь принял предложение установки');
          } else {
            console.log('Пользователь отклонил предложение установки');
          }
          deferredPrompt = null;
        });
      }
    });
  });
