# Dict.Dhamma.Gift
## Dhammma.gift edition of Dpdict.net interface

This interface used as a full mode popup dictionary in Dhamma.gift Read. e.g. https://dhamma.gift/mn150

settings gear -> popup dictionary -> DPD online -> apply

or as a standalone site https://dict.dhamma.gift for those who need it's unique features, prefer mobile friendly or minimalistic ui.

List of improvements:

1. added sortable table for grammar dict on the client side 
2. example links opened on Dhamma.gift with word from example highlighted and with autoscroll to the first match. added for mn dn sn an dhp snp ud  
3. type with autocomplete pali words in search bar
4. PWA lookup words from any apps using share from context menu, if app installed as PWA. (chrome mobile -> menu -> add to home screen)
5. PWA shortcuts (long press installed app icon on Home screen) for quick access to Dhamma.gift and Russian/English version of Dict.Dhamma.Gift
6. type / to bring up autofocus on search bar. also autofocus added on page load 
7. "clear" button added to search bar
8. transform history pane amd settings pane into collapsible/expandable button on mobile breakpoints.
9. added extra links in the footer to open current search term on dhamma.gift sutta search and on dpdict.net
10. added spinner while waiting for results in site mode
11. auto replace links to DG hosted tbw on the client side
12. clickable logo and site name on main page desktop and talbet leading to / or /ru/ — acts like clear button.
13. disabled slow 1s transition of the dark/light theme for popup mode as it makes popup load look glitchy
14. added protection against repeated form submits
15. other improvements mostly on css side to make site mobile user friendly. Related to input sizes and saving extra space

## installation 

1. clone this repo
2. cd into it
3. creat virtual environment and install dependencies and start
   
   ```
   python -m venv .venv
   .venv/bin/pip install -r requirements.tx
   # start with
   nohup ./start.sh &
   ```
   
4. to stop use
   ```
   ./stop.sh
   ```
   
## Details

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
 
