
//// listen for button clicks

document.addEventListener("click", function(event) {
    var target = event.target;
    const classNames = ["button"]
    if (classNames.some(className => target.classList.contains(className))) {
        button_click(target);
        event.preventDefault();
    }
});

//// handle button clicks

function button_click(el) {
    let oneButtonToggleEnabled = false;
    try {
        oneButtonToggleEnabled = localStorage.getItem("one-button-toggle") === "true";
    } catch (e) {
        console.log("LocalStorage is not available.");
    }
    const target_id = el.getAttribute("data-target");
    var target = document.getElementById(target_id);
    
    if (target) {
        if (target.textContent.includes("loading...")) {
            loadData()
        };

        //// only open one button at a time

        if (oneButtonToggleEnabled) {
            var allButtons = document.querySelectorAll('.button');
            allButtons.forEach(function(button) {
                if (button !== el) { 
                    button.classList.remove("active");
                }
            });

            var allContentAreas = document.querySelectorAll('.content');
            allContentAreas.forEach(function(contentArea) {
                if (contentArea !== target && !contentArea.classList.contains("summary")) {
                    contentArea.classList.add("hidden");
                }
            });

            if (!target.classList.contains('summary')) {
                target.classList.toggle("hidden");
            }
        } else {
            target.classList.toggle("hidden");
        }

        if (el.classList.contains("close")) {
            var target_control = document.querySelector('a.button[data-target="' + target_id + '"]');
            if (target_control) {
                target_control.classList.toggle("active");
            }
        } else {
            el.classList.toggle("active");
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Находим все таблицы грамматики на странице
        const grammarTables = document.querySelectorAll('table.grammar_dict');
	    
	        if (grammarTables.length === 0) return;
		    
		        // Функция для преобразования одной таблицы
			    function transformGrammarTable(oldTable) {
			            // Создаем новую таблицу
				            const newTable = document.createElement('table');
					            newTable.className = 'sortable-grammar-table';
						            
							            // Создаем заголовок таблицы
								            const thead = document.createElement('thead');
									            const headerRow = document.createElement('tr');
										            
											            const headers = [
												                {text: 'Pos', sort: 'string'},
														            {text: 'Gen', sort: 'string'},
															                {text: 'Case', sort: 'string'},
																	            {text: 'Num', sort: 'string'},
																		                {text: 'Of', sort: 'string'},
																				            {text: 'Word', sort: 'string'}
																					            ];
																						            
																							            headers.forEach(header => {
																								                const th = document.createElement('th');
																										            th.textContent = header.text;
																											                th.setAttribute('data-sort', header.sort);
																													            headerRow.appendChild(th);
																														            });
																															            
																																            thead.appendChild(headerRow);
																																	            newTable.appendChild(thead);
																																		            
																																			            // Создаем тело таблицы
																																				            const tbody = document.createElement('tbody');
																																					            newTable.appendChild(tbody);
																																						            
																																							            // Заполняем таблицу данными из старой таблицы
																																								            const oldRows = oldTable.querySelectorAll('tbody tr');
																																									            
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
																																																																													            
																																																																														            // Заменяем старую таблицу новой
																																																																															            oldTable.replaceWith(newTable);
																																																																																            
																																																																																	            // Добавляем обработчики сортировки
																																																																																		            setupSorting(newTable);
																																																																																			        }
																																																																																				    
																																																																																				        // Функция для настройки сортировки
																																																																																					    function setupSorting(table) {
																																																																																					            const tbody = table.querySelector('tbody');
																																																																																						            const headers = table.querySelectorAll('th');
																																																																																							            
																																																																																								            headers.forEach(header => {
																																																																																									                header.addEventListener('click', () => {
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
																																																																																																																																						    
																																																																																																																																						        // Преобразуем все найденные таблицы
																																																																																																																																							    grammarTables.forEach(table => {
																																																																																																																																							            transformGrammarTable(table);
																																																																																																																																								        });
																																																																																																																																									});

