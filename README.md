# Dict.Dhamma.Gift
## Dhamma.gift edition of Dpdict.net interface

This interface used as a full mode popup dictionary on Dhamma.gift Read. 
e.g. open https://dhamma.gift/mn150
tap: settings (gear) -> popup dictionary -> DPD online -> apply

or as a standalone site https://dict.dhamma.gift for those who need it's unique features, need mobile friendly or minimalistic ui.

List of improvements:

1. added sortable table for grammar dict on the client side 
2. example links opened on Dhamma.gift with word from example highlighted and with autoscroll to the first match. added for mn dn sn an dhp snp ud  
3. type with autocomplete pali words in search bar
4. PWA lookup words from any apps using share from context menu, if app installed as PWA. (chrome mobile -> menu -> add to home screen)
5. PWA shortcuts (long press installed app icon on Home screen) for quick access to Dhamma.gift and Russian/English version of Dict.Dhamma.Gift
6. type / to bring up autofocus on search bar. also autofocus added on page load 
7. "clear" button added to search bar
8. transform history pane and settings pane into collapsible/expandable button on mobile breakpoints.
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

Following files added to original exporter/webapp/static

├── extrastyles.css
├── jquery-ui.css
├── jquery-ui.min.css


├── openDG.html


├── autopali.js
├── extra.js
├── jquery-3.7.0.min.js
├── jquery-ui.js
├── jquery-ui.min.js
├── sortableTable.js
├── sw.js


├── manifest-ru.json
├── manifest.json


├── sutta_words.txt


├── dg_icon_white-192-diamond.png
├── dg_icon_white-192-fullLogo.png
├── circle-notch.svg
├── clock-rotate-left.svg
├── gear.svg
├── globe.svg
├── magnifying-glass.svg
└── dg_icon_white-192.png -> dg_icon_white-192-diamond.png


and 

├── home.js is modified



in exporter/webapp/templates and exporter/webapp/ru_templates
├── home.html are modified
├── home_simple.html are modified 

modified in both folders

exporter/webapp/
├── main.py is heavily modified for the frontend functionality

 
