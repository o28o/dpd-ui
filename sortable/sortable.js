// static/sortable.js
console.log('Sortable script loaded'); // Добавим лог загрузки

function initializeSorting() {
    console.log('Initializing sorting...'); // Лог инициализации
    
    const tables = document.querySelectorAll('table.sortable-grammar-table');
    console.log(`Found ${tables.length} sortable tables`); // Лог количества таблиц

    tables.forEach((table, tableIndex) => {
        const headers = table.querySelectorAll('th[data-sort]');
        const tbody = table.querySelector('tbody');
        
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.title = 'Click to sort';
            
            header.addEventListener('click', () => {
                console.log(`Sorting table ${tableIndex + 1}, column ${index + 1}`); // Лог клика
                
                const order = header.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
                const type = header.getAttribute('data-sort');
                
                // Сброс сортировки у других заголовков
                headers.forEach(h => {
                    h.removeAttribute('data-order');
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });
                
                header.setAttribute('data-order', order);
                header.classList.add(`sorted-${order}`);
                
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                rows.sort((a, b) => {
                    const aVal = a.cells[index].textContent.trim().toLowerCase();
                    const bVal = b.cells[index].textContent.trim().toLowerCase();
                    
                    if (type === 'string') {
                        return order === 'asc' 
                            ? aVal.localeCompare(bVal) 
                            : bVal.localeCompare(aVal);
                    }
                    return 0;
                });
                
                // Очистка и перезаполнение
                tbody.innerHTML = '';
                rows.forEach(row => tbody.appendChild(row));
                
                console.log(`Sorted ${rows.length} rows in ${order} order`); // Лог результата
            });
        });
    });
}

// Проверяем, что DOM уже загружен
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeSorting();
} else {
    document.addEventListener('DOMContentLoaded', initializeSorting);
}