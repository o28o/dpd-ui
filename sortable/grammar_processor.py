from bs4 import BeautifulSoup

def transform_grammar_table(html_content: str, static_url_prefix: str = "/static") -> str:
    """Преобразует таблицу с грамматикой в нужный формат"""
    if not html_content:
        return html_content

    soup = BeautifulSoup(html_content, 'html.parser')
    
    grammar_table = soup.find('table', class_='grammar_dict')
    if not grammar_table:
        return html_content
    
    # Создаем новую таблицу
    new_table = BeautifulSoup(f"""
    <table class="sortable-grammar-table">
        <thead>
            <tr>
                <th data-sort="string">Pos</th>
                <th data-sort="string">Gen</th>
                <th data-sort="string">Case</th>
                <th data-sort="string">Num</th>
                <th data-sort="string">Of</th>
                <th data-sort="string">Word</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    <script src="{static_url_prefix}/sortable.js"></script>
    """, 'html.parser')
    
    tbody = new_table.find('tbody')
    
    # Заполняем таблицу данными
    for row in grammar_table.select('tbody tr'):
        pos = row.find('td').get_text(strip=True)
        grammar = row.find_all('td')[1].get_text(strip=True)
        word = row.find_all('td')[3].get_text(strip=True)
        
        grammar_parts = grammar.split()
        gender = grammar_parts[0] if len(grammar_parts) > 0 else ''
        case = grammar_parts[1] if len(grammar_parts) > 1 else ''
        number = grammar_parts[2] if len(grammar_parts) > 2 else ''
        
        new_row = new_table.new_tag('tr')
        
        for value in [pos, gender, case, number, 'of', word]:
            td = new_table.new_tag('td')
            td.string = value
            new_row.append(td)
        
        tbody.append(new_row)
    
    grammar_table.replace_with(new_table)
    return str(soup)

def process_dpd_data(data: dict, static_url_prefix: str = "/static") -> dict:
    """Обрабатывает данные DPD, преобразуя таблицу с грамматикой"""
    if not data or not isinstance(data, dict):
        return data
    
    if 'dpd_html' in data:
        data['dpd_html'] = transform_grammar_table(data['dpd_html'], static_url_prefix)
    
    return data


