(function () {
  /*–––– 1. Вспомогательная функция для поиска sParam ––––*/
  function getSParam(link) {
    // a) bold в предыдущих абзацах
    const parentP = link.closest('p');
    if (parentP) {
      let prev = parentP.previousElementSibling;
      while (prev) {
        const bold = prev.querySelector('b');
        if (bold) return bold.textContent.trim();
        prev = prev.previousElementSibling;
      }
    }
    // b) fallback – q из адресной строки
    return new URLSearchParams(location.search).get('q') || '';
  }

  /*–––– 2. Основная обработка одной ссылки ––––*/
  function rewrite(link) {
    if (!link.href) return;

    const isSutta = link.classList.contains('sutta_link') || link.closest('.sutta');
    const isOld   = link.href.includes('thebuddhaswords.net');
    if (!isSutta && !isOld) return;

    let url = link.href;

    // замена домена/пути
    if (isOld) {
      const m = url.match(/\/(mn|dn|sn|an|dhp|snp|ud)([^/]+?)\.html$/i);
      if (m) {
        const suttaCode = m[1].toLowerCase() + m[2];
        url = location.href.includes('/ru/')
          ? `https://dhamma.gift/r/?q=${suttaCode}`
          : `https://dhamma.gift/read/?q=${suttaCode}`;
      } else {
        url = url
          .replace('www.thebuddhaswords.net', 'dhamma.gift/bw')
          .replace('thebuddhaswords.net',  'dhamma.gift/bw');
      }
    }

    // s‑параметр
    const s = getSParam(link)
      .replace(/ṃ/g, "ṁ")
      .replace(/'/g, "");
    if (s) {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}s=${encodeURIComponent(s)}`;
    }

    link.href = url;
  }

  /*–––– 3. Запуск в «свободное» время ––––*/
  function rewriteAll() {
    document.querySelectorAll('a').forEach(rewrite);
  }

  const idle = window.requestIdleCallback
    ? cb => requestIdleCallback(cb, { timeout: 2000 })
    : cb => setTimeout(cb, 0);

  window.addEventListener('DOMContentLoaded', () => idle(rewriteAll));
})();


// переделать в сортируемую таблицу 

    function transformToSortable(table) {
        if (table.classList.contains('sortable-processed')) return;
        table.classList.add('sortable-processed');

        const oldTbody = table.querySelector('tbody');
        if (!oldTbody) return; // вдруг пустая таблица
        
        const oldRows = oldTbody.querySelectorAll('tr');
        table.innerHTML = '';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
    const urlLanguage = window.location.pathname.split('/')[1];
    const lang = urlLanguage === 'ru' ? 'ru' : 'en';

    const tableHeaders = lang === 'ru' 
        ? ['ЧР⇅', '⇅', '⇅', '⇅', 'от', 'слово⇅']
        : ['pos⇅', '⇅', '⇅', '⇅', 'of', 'word⇅'];
        
        tableHeaders.forEach(text => {
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



// конец сорт таблиц

// Вешаем обработчик на document (не на ссылки!)
/*
document.addEventListener('click', function(event) {
  const link = event.target.closest('a');
  if (!link || !link.href) return;

  // Проверяем, нужно ли обрабатывать эту ссылку
  const isSuttaLink = link.classList.contains('sutta_link') || link.closest('.sutta'); // Добавили проверку на родителя с классом sutta
  const isOldSite = link.href.includes('thebuddhaswords.net');
  
  if (!isSuttaLink && !isOldSite) return;

  event.preventDefault();
  let newUrl = link.href;

  // 1. Замена домена для старых ссылок
  if (isOldSite) {
    // Регулярное выражение для поиска сутт (MN, DN, SN, AN) с диапазонами или без
    const suttaMatch = newUrl.match(/\/(mn|dn|sn|an|dhp|snp|ud)([^\/]+?)\.html$/i);
    
    if (suttaMatch) {
      const suttaType = suttaMatch[1].toLowerCase();
      const suttaNum = suttaMatch[2];
      const suttaCode = suttaType + suttaNum;
      
      // Проверяем текущий URL страницы на наличие /ru/
      if (window.location.href.includes('/ru/')) {
        newUrl = `https://dhamma.gift/r/?q=${suttaCode}`;
      } else {
        newUrl = `https://dhamma.gift/read/?q=${suttaCode}`;
      }
    } else {
      // Обычная замена для не-сутт
      newUrl = newUrl
        .replace('www.thebuddhaswords.net', 'dhamma.gift/bw')
        .replace('thebuddhaswords.net', 'dhamma.gift/bw');
    }
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
    newUrl += `${separator}s=${encodeURIComponent(sParam.replace(/ṃ/g, "ṁ").replace(/'/g, ""))}`;
  }

  window.location.href = newUrl;
});
*/

