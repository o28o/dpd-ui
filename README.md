Dhammma.gift edition of webapp Dpdict.net

Used as a full mode popup dictionary in Dhamma.gift Read.

or as a standalone site for those who prefer minimalistic or mobile friendly ui

List of improvements:

1. autofocus on search bar on page load
2. "clear" button added to search bar
3. autocomplete pali words in search bar
4. added sortable table for grammar dict on the client side
5. transform history pane into collapsible/expandable button on mobile breakpoints
6. transform settings pane into collapsible/expandable button on mobile breakpoints
7. extra link to open current search term on dhamma.gift sutta search
8. extra link to open current search term on dpdict.net sutta search
9. auto replace links to DG hosted tbw on the client side
10. clickable logo and site name on main page desktop and talbet leading to / or /ru/ or acts like clear button.
11. other improvements mostly on css side to make site mobile user friendly. Related to input sizes and saving extra space
12. disabled slow 1s transition of the dark/light theme for popup mode as it makes popup load look glitchy
13. spinner while waiting for results in site mode

technically it is a modified dpd-db repo where dpdict.net is used as backend instead of direct calls to dpd-db.

files added to original exporter/webapp/static

static
├── extrastyles.css
├── jquery-ui.css
├── jquery-ui.min.css

├── autopali.js
├── extra.js
├── jquery-3.7.0.min.js
├── jquery-ui.js
├── jquery-ui.min.js
├── sortableTable.js

├── circle-notch.svg
├── clock-rotate-left.svg
├── gear.svg

├── sutta_words.txt

and 

├── home.js is modified

main.py, home.html and home_simple.html are modified (in both templates and ru_templates in case of html)
 
