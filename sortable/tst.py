import requests
from bs4 import BeautifulSoup
import json

def fetch_and_transform_grammar(word):
    # Запрашиваем данные с API
    url = f"https://dict.dhamma.gift/search_json?q={word}"
    response = requests.get(url)
    data = response.json()
    
    # Извлекаем HTML с грамматикой
    html_content = data.get("dpd_html", "")
    
    # Преобразуем таблицу с грамматикой
    transformed_html = transform_grammar_table(html_content)
    
    # Обновляем данные с преобразованным HTML
    data["dpd_html"] = transformed_html
    
    return data

def transform_grammar_table(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Находим таблицу с грамматикой
    grammar_table = soup.find('table', class_='grammar_dict')
    if not grammar_table:
        return html_content  # Возвращаем как есть, если таблица не найдена
    
    # Создаем новую таблицу
    new_table = BeautifulSoup("""
    <table>
        <thead>
            <tr>
                <th id="col1">Col 1</th>
                <th id="col2">Col 2</th>
                <th></th>
                <th></th>
                <th id="col5">Of</th>
                <th id="col6">Word</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    """, 'html.parser')
    
    tbody = new_table.find('tbody')
    
    # Обрабатываем каждую строку исходной таблицы
    for row in grammar_table.select('tbody tr'):
        pos = row.find('td').get_text(strip=True)
        grammar = row.find_all('td')[1].get_text(strip=True)
        word = row.find_all('td')[3].get_text(strip=True)
        
        # Разбираем грамматическую информацию
        grammar_parts = grammar.split()
        gender = ''
        case = ''
        number = ''
        
        if len(grammar_parts) >= 3:
            # Обработка для nt nom sg и подобных
            gender = grammar_parts[0]
            case = grammar_parts[1]
            number = grammar_parts[2]
        elif len(grammar_parts) == 2:
            # Обработка для случаев с двумя частями
            gender = grammar_parts[0]
            case = grammar_parts[1]
        else:
            # Обработка для особых случаев
            gender = grammar_parts[0] if grammar_parts else ''
        
        # Создаем новую строку
        new_row = new_table.new_tag('tr')
        
        # Добавляем ячейки
        td_pos = new_table.new_tag('td')
        td_pos.string = pos
        new_row.append(td_pos)
        
        td_gender = new_table.new_tag('td')
        td_gender.string = gender
        new_row.append(td_gender)
        
        td_case = new_table.new_tag('td')
        td_case.string = case
        new_row.append(td_case)
        
        td_number = new_table.new_tag('td')
        td_number.string = number
        new_row.append(td_number)
        
        td_of = new_table.new_tag('td')
        td_of.string = 'of'
        new_row.append(td_of)
        
        td_word = new_table.new_tag('td')
        td_word.string = word
        new_row.append(td_word)
        
        tbody.append(new_row)
    
    # Заменяем оригинальную таблицу на преобразованную
    grammar_table.replace_with(new_table)
    
    # Добавляем скрипт для сортировки
    script = soup.new_tag('script')
    script.string = """
    document.addEventListener('DOMContentLoaded', function () {
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody');
        const headers = table.querySelectorAll('th');

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const order = header.dataset.order === 'asc' ? 'desc' : 'asc';
                const colIndex = header.cellIndex;

                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.sort((a, b) => {
                    const aValue = a.cells[colIndex].textContent.toLowerCase();
                    const bValue = b.cells[colIndex].textContent.toLowerCase();
                    return (aValue > bValue) ? 1 : -1;
                });

                if (order === 'desc') {
                    rows.reverse();
                }

                tbody.innerHTML = '';
                rows.forEach(row => {
                    tbody.appendChild(row);
                });

                headers.forEach(header => {
                    header.dataset.order = '';
                });

                header.dataset.order = order;
            });
        });
    });
    """
    soup.append(script)
    
    return str(soup)

# Пример использования
word = "kacchapalakkhaṇaṃ"
result = fetch_and_transform_grammar(word)

# Сохраняем результат в файл или возвращаем как JSON
with open("transformed_output.html", "w", encoding="utf-8") as f:
    f.write(result["dpd_html"])

# Или возвращаем как JSON
print(json.dumps(result, ensure_ascii=False, indent=2))
