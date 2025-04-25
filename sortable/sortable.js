// static/sortable.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing sorting...');
    initializeSorting();
});

function initializeSorting() {
    console.log('Initializing sorting...');
    
    const tables = document.querySelectorAll('table.sortable-grammar-table');
    console.log(`Found ${tables.length} sortable tables`);

    if (tables.length === 0) {
        console.warn('No sortable tables found! Check the table class name.');
        return;
    }

    tables.forEach((table, tableIndex) => {
        console.log(`Processing table ${tableIndex + 1}`, table);
        
        const headers = table.querySelectorAll('th[data-sort]');
        const tbody = table.querySelector('tbody');
        
        if (!tbody) {
            console.warn(`No tbody found in table ${tableIndex + 1}`);
            return;
        }

        console.log(`Found ${headers.length} sortable headers in table ${tableIndex + 1}`);
        
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.title = 'Click to sort';
            
            header.addEventListener('click', () => {
                console.log(`Sorting table ${tableIndex + 1}, column ${index + 1} (${header.textContent.trim()})`);
                
                const order = header.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
                const type = header.getAttribute('data-sort');
                
                // Reset other headers
                headers.forEach(h => {
                    if (h !== header) {
                        h.removeAttribute('data-order');
                        h.classList.remove('sorted-asc', 'sorted-desc');
                    }
                });
                
                header.setAttribute('data-order', order);
                header.classList.add(`sorted-${order}`);
                
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                console.log(`Sorting ${rows.length} rows in ${order} order by ${type}`);
                
                rows.sort((a, b) => {
                    const aVal = a.cells[index]?.textContent?.trim()?.toLowerCase() || '';
                    const bVal = b.cells[index]?.textContent?.trim()?.toLowerCase() || '';
                    
                    if (type === 'string') {
                        return order === 'asc' 
                            ? aVal.localeCompare(bVal) 
                            : bVal.localeCompare(aVal);
                    }
                    return 0;
                });
                
                // Rebuild table
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }
                
                rows.forEach(row => {
                    tbody.appendChild(row);
                });
                
                console.log(`Sorting completed for table ${tableIndex + 1}`);
            });
        });
    });
}