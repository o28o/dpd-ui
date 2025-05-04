
let startMessage;
//<p class="message"><a class="installButton" >Install Dict.DG</a> to enable lookup by sharing words from any site of app</p>

function initStartMessage(lang) {
    if (language === 'en') {
        startMessage = `
<p class="message">Search in Pāḷi or English using <b>Autocomplete</b>, <b>Unicode</b>, or <b>Velthuis</b>.</p>
<p class="message"><b>Click the grammar table</b> in Grammar Dictionary seciton. it'll become sortable.</p>
<p class="message"><b>Double-click</b> any word to search.</p>
<p class="message">To lookup words on <b>any sites or apps</b>:</p>
<p class="message">Chrome Mobile menu → "Add to Home screen" → Install. </p>
<p class="message">After that: select the word → tap "share" from OS context menu → choose Dict.DG.</p>

<p class="message">Adjust the <b>Settings</b> as needed.</p>
<p class="message"><b>Refresh</b> if any issues occur.</p>
<p class="message">
    For more information, visit: <a href="https://docs.dpdict.net/webapp/" target="_blank">Site</a> or 
    <a href="https://docs.dpdict.net/" target="_blank">DPD in general</a>.
</p>
<p class="message">Try: <b>Double-click</b> words below:</p>
<p class="message">atthi kāmarāgapariyuṭṭhitena peace kar gacchatīti Root✓</p>

`;
    } else if (language === 'ru') {
        startMessage = `
<p class="message">Ищите на пали или русском с <b>Автоподсказками</b>, <b>Unicode</b> или <b>Velthuis</b>.</p>
<p class="message"><b>Клик по грамматической таблице</b> в разделе Словарь Грамматики, делает таблицу сортируемойвки.</p>
<p class="message"><b>Двойной клик</b> по любому слову для поиска.</p>
<p class="message">Чтобы использовать словарь <b>на любых сайтах и в приложениях</b>:</p>
<p class="message">Меню Chrome Mobile → "Добавить на главный экран" → Install. </p>
<p class="message">После этого: выбрать слово → в контекстном меню ОС нажать "поделиться" → выбрать Dict.DG.</p>

<p class="message">Используйте <b>Настройки</b> для дополнительных функций.</p>
<p class="message"><b>Обновите</b> страницу при возникновении проблем.</p>
<p class="message">
    Подробнее о: <a href="https://docs.dpdict.net/webapp/" target="_blank">Сайте</a> или 
    <a href="https://docs.dpdict.net/" target="_blank">DPD в целом</a>.
</p>
<p class="message">Попробуйте: <b>двойной клик</b> по словам ниже:</p>
<p class="message">atthi kāmarāgapariyuṭṭhitena peace kar gacchatīti Root✓</p>
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

    // Проверяем состояние в localStorage или скрываем по умолчанию
    if (localStorage.getItem("tabsHidden") === null || localStorage.getItem("tabsHidden") === "true") {
        tabContainer.classList.add("hidden");
        tabsToggle.checked = true;
        localStorage.setItem("tabsHidden", "true"); // Запоминаем состояние
    }

    // Обработчик переключения
    tabsToggle.addEventListener("change", function () {
        const isHidden = this.checked;
        tabContainer.classList.toggle("hidden", isHidden);
        localStorage.setItem("tabsHidden", isHidden ? "true" : "false");
    });
});

// Вешаем обработчик на document (не на ссылки!)
document.addEventListener('click', function(event) {
  const link = event.target.closest('a');
  if (!link || !link.href) return;

  // Проверяем, нужно ли обрабатывать эту ссылку
  const isSuttaLink = link.classList.contains('sutta_link');
  const isOldSite = link.href.includes('thebuddhaswords.net');
  
  if (!isSuttaLink && !isOldSite) return;

  event.preventDefault();
  let newUrl = link.href;

  // 1. Замена домена для старых ссылок
  if (isOldSite) {
    newUrl = newUrl
      .replace('www.thebuddhaswords.net', 'dhamma.gift/bw')
      .replace('thebuddhaswords.net', 'dhamma.gift/bw');
  }

  // 2. Определение параметра s
  let sParam = '';

  // Случай для sutta_link: ищем bold в предыдущих элементах
  if (isSuttaLink) {
    const parentParagraph = link.closest('p');
    if (parentParagraph) {
      // Ищем ближайший предыдущий элемент с bold
      let prevElement = parentParagraph.previousElementSibling;
      while (prevElement) {
        const boldElement = prevElement.querySelector('b');
        if (boldElement) {
          sParam = boldElement.textContent.trim();
          break;
        }
        prevElement = prevElement.previousElementSibling;
      }
    }
  }

  // Если не нашли bold, берем q из URL
  if (!sParam) {
    sParam = new URLSearchParams(window.location.search).get('q') || '';
  }

  // 3. Добавляем параметр s (если есть значение)
  if (sParam) {
    const separator = newUrl.includes('?') ? '&' : '?';
    newUrl += `${separator}s=${encodeURIComponent(sParam.replace(/ṃ/g, "ṁ"))}`;
  }

  window.location.href = newUrl;
});
// улучшенные функции двойных кликов и табов.

dpdPane.addEventListener("dblclick", processSelection);
historyPane.addEventListener("dblclick", processSelection);

let lastTap = 0;
const doubleTapDelay = 300; // milliseconds

dpdPane.addEventListener("touchend", handleTouchEnd);
historyPane.addEventListener("touchend", handleTouchEnd);

function handleTouchEnd(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    // Detect double-tap
    if (tapLength < doubleTapDelay && tapLength > 0) {
        event.preventDefault();

        // NEW: skip if touched element is a table header (TH)
        if (event.target.closest('th')) {
            return;
        }

        const selection = window.getSelection().toString();
        if (selection.trim() !== "") {
            searchBox.value = selection;
            handleFormSubmit();
        }
    }

    lastTap = currentTime;
}


function processSelection(event) {
    if (event.target.closest('th')) {
        return;
    }

    const selection = window.getSelection().toString();
    if (selection.trim() !== "") {
        const selectedText = selection.trim();
        history.pushState({ selectedText }, "", `#${encodeURIComponent(selectedText)}`);
        searchBox.value = selection;
        handleFormSubmit();
    }
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
