
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



// конец сорт таблиц
