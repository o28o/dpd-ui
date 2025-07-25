const c = console.log

//// elements

const docBody = document.body
const titleClear = document.getElementById("title-clear")
const mainPane = document.getElementById("main-pane");
const dpdPane = document.getElementById("dpd-pane");
const summaryResults = document.getElementById("summary-results");
const dpdResults = document.getElementById("dpd-results");
const historyPane = document.getElementById("history-pane");
const historyListPane = document.getElementById("history-list-pane");
const subTitle = document.getElementById("subtitle")
const searchBox = document.getElementById("search-box")
const entryBoxClass = document.getElementsByClassName("search-box")
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-button");
const footerText = document.getElementById("footer");

const themeToggle = document.getElementById("theme-toggle");
const sansSerifToggle = document.getElementById("sans-serif-toggle");
const niggahitaToggle = document.getElementById("niggahita-toggle");
const grammarToggle = document.getElementById("grammar-toggle");
const exampleToggle = document.getElementById("example-toggle");
const oneButtonToggle = document.getElementById("one-button-toggle");
// const sbsexampleToggle = document.getElementById("sbs-example-toggle");
const summaryToggle = document.getElementById("summary-toggle");
const sandhiToggle = document.getElementById("sandhi-toggle");
var fontSize
const fontSizeUp = document.getElementById("font-size-up");
const fontSizeDown = document.getElementById("font-size-down");
var fontSizeDisplay = document.getElementById("font-size-display");

let dpdResultsContent = "";
let language;

//// uri utils

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
}

//// load state

function loadToggleState(id) {
    var savedState = localStorage.getItem(id);
    if (savedState !== null) {
        document.getElementById(id).checked = JSON.parse(savedState);
    }
}

//// Page load
document.addEventListener("DOMContentLoaded", function() {
    const htmlElement = document.documentElement;
    language = htmlElement.lang || 'en';

// Инициализация при загрузке
    initStartMessage(language);

    if (dpdResults.innerHTML.trim() === "") {
        dpdResults.innerHTML = startMessage;
    } 
  
    applySavedTheme();
    populateHistoryBody();
    loadToggleState("theme-toggle");
    loadToggleState("sans-serif-toggle");
    loadToggleState("niggahita-toggle");
    loadToggleState("grammar-toggle");
    loadToggleState("example-toggle");
    loadToggleState("one-button-toggle");
    // loadToggleState("sbs-example-toggle");
    loadToggleState("summary-toggle");
    loadToggleState("sandhi-toggle");
    loadFontSize();
    toggleClearHistoryButton();
    swopSansSerif();
    applyUrlQuery();

    // Language switcher dropdown control
    const languageIcon = document.querySelector(".language-icon");
    const dropdown = document.querySelector(".dropdown");

    // Ensure both elements exist before adding event listeners
    if (languageIcon && dropdown) {
        // Show or hide dropdown on icon click
        languageIcon.addEventListener("click", function () {
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        // Hide dropdown if clicked outside
        document.addEventListener("click", function (e) {
            if (!languageIcon.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });
    } else {
        console.error("Error: .language-icon or .dropdown element not found in the DOM.");
    }
});

//// listeners

//// back button

window.onpopstate = function(e) {
    if (e.state !=null) {
        searchBox.value = e.state.q;
        handleFormSubmit().then();
    }
};

//// trigger title clear - go home

titleClear.addEventListener("dblclick", function() {
	dpdPane.innerHTML = ""; 
});

/// DELETE THE TOUCH AND TAP DOUBLE CLICK FROM THIS FILE
/// moved to extra.js

// Original double-click functionality

dpdPane.addEventListener("dblclick", processSelection);

historyPane.addEventListener("dblclick", processSelection);

// Add touch double-tap functionality
let lastTap = 0;
const doubleTapDelay = 300; // milliseconds between taps to count as double-tap


dpdPane.addEventListener("touchend", handleTouchEnd);
historyPane.addEventListener("touchend", handleTouchEnd);


function handleTouchEnd(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    // Detect double-tap
    if (tapLength < doubleTapDelay && tapLength > 0) {
        // Prevent default behavior (like zooming)
        event.preventDefault();

        // Get the selection and process it
        const selection = window.getSelection().toString();
        if (selection.trim() !== "") {
          searchBox.value = selection;
            handleFormSubmit();
        }
    }

    lastTap = currentTime;

}

function processSelection() {

    const selection = window.getSelection().toString();
    if (selection.trim() !== "") {
        searchBox.value = selection;
        handleFormSubmit();
    }
}


//// font size ////

function loadFontSize() {
    fontSize = localStorage.getItem("fontSize");
    if (fontSize === null) {
        bodyStyle = window.getComputedStyle(document.body);
        fontSize = parseInt(bodyStyle.getPropertyValue('font-size'), 10);
    } else {
        setFontSize()
    }
}

function saveFontSize() {
    localStorage.setItem("fontSize", fontSize);
}

function setFontSize() {
    document.body.style.fontSize = fontSize + "px"
    fontSizeDisplay.innerHTML =`${fontSize}px`
}

fontSizeUp.addEventListener("click", increaseFontSize)
fontSizeDown.addEventListener("click", decreaseFontSize)

function increaseFontSize() {
    fontSize = parseInt(fontSize, 10) + 1
    setFontSize()
    saveFontSize()
}

function decreaseFontSize() {
    fontSize = parseInt(fontSize, 10) - 1
    setFontSize()
    saveFontSize()
}

//// enter or click button to search 

searchForm.addEventListener("submit", handleFormSubmit);
searchButton.addEventListener("submit", handleFormSubmit);

//// submit search
let isSubmitting = false; // Флаг для отслеживания состояния отправки

async function handleFormSubmit(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Если уже выполняется, игнорируем новый вызов
    if (isSubmitting) {
        return;
    }
    
    let searchQuery = searchBox.value || "";
    
        // Очистка текста при шейринге
    if (searchQuery.includes('http://') || searchQuery.includes('https://')) {
        // Берем только первое слово до пробела/URL
        searchQuery = searchQuery.split(/\s+/)[0];
    }
    
    // Удаляем все кавычки (двойные и одинарные)
    searchQuery = searchQuery.replace(/["']/g, '');

    
    
    if (searchQuery.trim() !== "") {
        try {
            isSubmitting = true; // Устанавливаем флаг
            
            // Закрываем выпадающий список автоподсказок
            if ($("#search-box").hasClass("ui-autocomplete-input")) {
                $("#search-box").autocomplete("close");
            }
            
            showSpinner(); 
            addToHistory(searchQuery);
            
            // Adjust the search URL based on the current language
            let searchUrl = '/search_json';
            if (language === 'ru') {
                searchUrl = '/ru/search_json';
            }
            
            const response = await fetch(`${searchUrl}?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            //// add the summary_html
            if (data.summary_html.trim() != "") {
                if (language === 'en') {
                    summaryResults.innerHTML = "<h3>Summary</h3>";
                } else {
                    summaryResults.innerHTML = "<h3>Сводка</h3>";
                }
                summaryResults.innerHTML += data.summary_html; 
                summaryResults.innerHTML += "<hr>";
            } else {
                summaryResults.innerHTML = "";
            }
            showHideSummary();

            //// add dpd_html
            const dpdDiv = document.createElement("div");
            dpdDiv.innerHTML += data.dpd_html;
            
            //// niggahita toggle
            if (niggahitaToggle.checked) {
                niggahitaUp(dpdDiv);
            }
    
            //// grammar button toggle
            if (grammarToggle.checked) {
                const grammarButtons = dpdDiv.querySelectorAll('[name="grammar-button"]');
                const grammarDivs = dpdDiv.querySelectorAll('[name="grammar-div"]');
                grammarButtons.forEach(button => {
                    button.classList.add("active");
                });
                grammarDivs.forEach(div => {
                    div.classList.remove("hidden");
                });
            };
    
            //// example button toggle
            if (exampleToggle.checked) {
                const exampleButtons = dpdDiv.querySelectorAll('[name="example-button"]');
                const exampleDivs = dpdDiv.querySelectorAll('[name="example-div"]');
                exampleButtons.forEach(button => {
                    button.classList.add("active");
                });
                exampleDivs.forEach(div => {
                    div.classList.remove("hidden");
                });
            };

            dpdResults.innerHTML = dpdDiv.innerHTML;
            dpdResultsContent = dpdDiv.innerHTML;

//rewriteLinksWhenIdle();  

            //// sandhi button toggle
            showHideSandhi();
            
            populateHistoryBody();
   
 //************************** 
 // добавлено чтобы починить проблему с неожиданным скроллом
 //****************************

if (!window.location.href.includes('search_html')) {
    dpdPane.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
    dpdPane.scrollTo({ top: 0, behavior: "smooth" });
}

            // Update the URL with the search query
            let url = `/?q=${encodeURIComponent(searchQuery)}`;
            if (language === 'ru') {
                url = `/ru/?q=${encodeURIComponent(searchQuery)}`;
            }            
            history.pushState({ q: searchQuery }, "", url);
            
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            isSubmitting = false; // Сбрасываем флаг в любом случае
        }
    } else {
    // Clear the URL and reset results if search query is empty
    if (language === 'en') {
        history.pushState({ q: '' }, "", "/");
    } else if (language === 'ru') {
        history.pushState({ q: '' }, "", "/ru/");
    }
    
    // Reset UI to initial state
    dpdResults.innerHTML = startMessage;
    summaryResults.innerHTML = "";
    hideSpinner();
}
    
}

//// url query param

function applyUrlQuery() {
    const query = getQueryVariable('q');
    if(!query) return;
    searchBox.value = query;
    window.history.replaceState({'q': query}, '', '?q='+encodeURIComponent(query));
    handleFormSubmit().then();
}

//// populate history

function addToHistory(word) {
    let historyList = JSON.parse(localStorage.getItem("history-list")) || [];
    const index = historyList.indexOf(word);
    if (index !== -1) {
        historyList.splice(index, 1);
    }
    historyList.unshift(word);
    if (historyList.length > 50) {
        historyList.pop();
    }
    localStorage.setItem("history-list", JSON.stringify(historyList));
    if (getQueryVariable('q') !== word) {
        window.history.pushState({'q': word}, '', '?q='+encodeURIComponent(word));
    }
    toggleClearHistoryButton()
}

function populateHistoryBody() {
    let historyList = JSON.parse(localStorage.getItem("history-list")) || [];
    let listElement = document.createElement("ul");
    listElement.id = "history-list";

    historyList.forEach(item => {
        let listItem = document.createElement("li");
        listItem.textContent = item;
        listElement.appendChild(listItem);
    });

    historyListPane.innerHTML = ""; 
    historyListPane.appendChild(listElement);
}

document.getElementById("clear-history-button").addEventListener("click", function() {
    localStorage.removeItem("history-list");
    document.getElementById("history-list").innerHTML = "";
    toggleClearHistoryButton()
});

function toggleClearHistoryButton() {
    let historyList = JSON.parse(localStorage.getItem("history-list")) || [];
    let clearHistoryButton = document.getElementById("clear-history-button");

    if (historyList.length === 0) {
        clearHistoryButton.style.display = "none";
    } else {
        clearHistoryButton.style.display = "inline-block";
    }
}


//// save settings on toggle

themeToggle.addEventListener("change", saveToggleState);
sansSerifToggle.addEventListener("change", saveToggleState);
niggahitaToggle.addEventListener("change", saveToggleState);
grammarToggle.addEventListener("change", saveToggleState);
exampleToggle.addEventListener("change", saveToggleState);
oneButtonToggle.addEventListener("change", saveToggleState);
// sbsexampleToggle.addEventListener("change", saveToggleState);
summaryToggle.addEventListener("change", saveToggleState);
sandhiToggle.addEventListener("change", saveToggleState);

function saveToggleState(event) {
    localStorage.setItem(event.target.id, event.target.checked);
}

//// theme

function toggleTheme(event) {
    document.body.classList.toggle("dark-mode", event.target.checked);
    localStorage.setItem("theme", event.target.checked ? "dark" : "light");
}

//// Event listener for theme toggle
themeToggle.addEventListener("change", toggleTheme);

//// Function to apply the saved theme state
function applySavedTheme() {
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.remove("dark-mode", "light-mode"); // Remove both classes
        document.body.classList.add(savedTheme + "-mode"); // Add the saved theme class
        themeToggle.checked = savedTheme === "dark"; // Sync toggle state
    }
}

//// toggle sans / serif

sansSerifToggle.addEventListener("change", function() {
    swopSansSerif()
});

function swopSansSerif() {
    const serifFonts = '"Noto Serif", "Dejavu Serif", "Garamond", "Georgia", "serif"';
    const sansFonts = '"Roboto", "Dejavu Sans", "Noto Sans", "Helvetica", "Verdana", "sans-serif"';
    if (sansSerifToggle.checked) {
        document.body.style.fontFamily = serifFonts;
        searchBox.style.fontFamily = serifFonts
        searchButton.style.fontFamily = serifFonts
    } else {
        document.body.style.fontFamily = sansFonts;
        searchBox.style.fontFamily = sansFonts
        searchButton.style.fontFamily = sansFonts
    }

} 


//// niggahita

function niggahitaUp(element) {
    element.innerHTML = element.innerHTML.replace(/ṃ/g, "ṁ");
}

function niggahitaDown(element) {
    element.innerHTML = element.innerHTML.replace(/ṁ/g, "ṃ");
}

niggahitaToggle.addEventListener("change", function() {
    if (this.checked) {
        niggahitaUp(dpdPane);
        niggahitaUp(historyPane);
    } else {
        niggahitaDown(dpdPane);
        niggahitaDown(historyPane);

    }
});

//// grammar button closed / open

grammarToggle.addEventListener("change", function() {
    const grammarButtons = document.getElementsByName("grammar-button");
    const grammarDivs = document.getElementsByName("grammar-div");
    if (this.checked) {
        grammarButtons.forEach(button => {
            button.classList.add("active");
        });
        grammarDivs.forEach(div => {
            div.classList.remove("hidden");
        });
    } else {
        grammarButtons.forEach(button => {
            button.classList.remove("active");
        });
        grammarDivs.forEach(div => {
            div.classList.add("hidden");
        });
    }
});

//// examples button toggle

exampleToggle.addEventListener("change", function() {
    const exampleButtons = document.getElementsByName("example-button");
    const exampleDivs = document.getElementsByName("example-div");
    if (this.checked) {
        exampleButtons.forEach(button => {
            button.classList.add("active");
        });
        exampleDivs.forEach(div => {
            div.classList.remove("hidden");
        });
    } else {
        exampleButtons.forEach(button => {
            button.classList.remove("active");
        });
        exampleDivs.forEach(div => {
            div.classList.add("hidden");
        });
    }
});


// //// sbs examples button toggle
// sbsexampleToggle.addEventListener("change", function() {
//     const sbsexampleButtons = document.getElementsByName("sbs-example-button");
//     const sbsexampleDivs = document.getElementsByName("sbs-example-div");
//     if (this.checked) {
//         sbsexampleButtons.forEach(button => {
//             button.classList.add("active");
//         });
//         sbsexampleDivs.forEach(div => {
//             div.classList.remove("hidden");
//         });
//     } else {
//         sbsexampleButtons.forEach(button => {
//             button.classList.remove("active");
//         });
//         sbsexampleDivs.forEach(div => {
//             div.classList.add("hidden");
//         });
//     }
// });

//// summary 

summaryToggle.addEventListener("change", function() {
    showHideSummary()
});

function showHideSummary() {
    if (summaryToggle.checked) {
        summaryResults.style.display = "block";
    } else {
        summaryResults.style.display = "none";
    }
}

//// sandhi ' toggle

sandhiToggle.addEventListener("change", function() {
    showHideSandhi()
});

function showHideSandhi() {
    if (sandhiToggle.checked) {
        dpdResults.innerHTML = dpdResultsContent;
    } else {
        dpdResults.innerHTML = dpdResultsContent.replace(/'/g, "");
        
    }
}

//// text to unicode

searchBox.addEventListener("input", function() {
    let textInput = searchBox.value;
    let convertedText = uniCoder(textInput);
    searchBox.value = convertedText;
});
