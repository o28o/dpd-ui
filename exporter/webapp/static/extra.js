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
  updateLink('fdg-link', 'https://dhamma.gift?p=-kn');
  updateLink('dpd-link', 'https://dpdict.net');
});

// Инициализация ссылок при загрузке
updateLink('fdg-link', 'https://dhamma.gift?p=-kn');
updateLink('dpd-link', 'https://dpdict.net');
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
    // Ищем ближайшую ссылку (даже если кликнули на <span> внутри <a>)
    const link = event.target.closest('a');
    
    // Проверяем только нужные ссылки
    if (link && link.href.includes('thebuddhaswords.net')) {
        event.preventDefault();
        link.href = link.href
            .replace('www.thebuddhaswords.net', 'dhamma.gift/bw')
            .replace('thebuddhaswords.net', 'dhamma.gift/bw');
        
        // Программный переход (аналогично обычному клику)
        window.location.href = link.href;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    function transformToSortable(table) {
        if (table.classList.contains('sortable-processed')) return;
        table.classList.add('sortable-processed');

        const oldTbody = table.querySelector('tbody');
        if (!oldTbody) return; // вдруг пустая таблица
        
        const oldRows = oldTbody.querySelectorAll('tr');
        table.innerHTML = '';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        ['Pos', 'Gen', 'Case', 'Num', 'Of', 'Word'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.setAttribute('data-sort', 'string');
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        oldRows.forEach(oldRow => {
            const cells = oldRow.querySelectorAll('td');
            if (cells.length < 4) return;
            
            const pos = cells[0].textContent.trim();
            const grammar = cells[1].textContent.trim();
            const word = cells[3].textContent.trim();
            
            const grammarParts = grammar.split(/\s+/);
            const gender = grammarParts[0] || '';
            const case_ = grammarParts[1] || '';
            const number = grammarParts[2] || '';
            
            const newRow = document.createElement('tr');
            
            [pos, gender, case_, number, 'of', word].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                newRow.appendChild(td);
            });
            
            tbody.appendChild(newRow);
        });

        setupSorting(table);
    }

    function setupSorting(table) {
        const tbody = table.querySelector('tbody');
        const headers = table.querySelectorAll('th');

        headers.forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const order = header.dataset.order === 'asc' ? 'desc' : 'asc';
                const colIndex = header.cellIndex;
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                rows.sort((a, b) => {
                    const aValue = a.cells[colIndex].textContent.trim().toLowerCase();
                    const bValue = b.cells[colIndex].textContent.trim().toLowerCase();
                    return aValue.localeCompare(bValue);
                });
                
                if (order === 'desc') {
                    rows.reverse();
                }
                
                tbody.innerHTML = '';
                rows.forEach(row => tbody.appendChild(row));
                
                headers.forEach(h => h.dataset.order = '');
                header.dataset.order = order;
            });
        });
    }

    // Делегирование события клика
    document.addEventListener('click', function(event) {
        // Ищем, был ли клик по таблице с классом grammar_dict
        const table = event.target.closest('table.grammar_dict');
        if (table) {
            transformToSortable(table);
        }
    });
});
