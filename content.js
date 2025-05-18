const styles = `
.statement {
    margin: 0px 0px 12px 0px;
    font-size: 14px;
    color: #2c3e50;
    font-weight: 500;
    text-align: center;
    line-height: 1.4;
}

.ai-selector-popup {
    position: fixed !important;
    background-color: #ffffff !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 16px !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
    z-index: 2147483647 !important;
    max-width: 280px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    backdrop-filter: blur(8px) !important;
    animation: popupFadeIn 0.2s ease-out !important;
}

@keyframes popupFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ai-selector-popup.centered {
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
}

.ai-selector-button {
    padding: 12px 20px !important;
    margin: 0 !important;
    background-color: #f8f9fa !important;
    color: #2c3e50 !important;
    border: 1px solid #e9ecef !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
}

.ai-selector-button:hover {
    background-color: #e9ecef !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.ai-selector-button:active {
    transform: translateY(0) !important;
    box-shadow: none !important;
}

/* Custom styles for each AI button */
.ai-selector-button[data-ai="ChatGPT"] {
    background-color: #10a37f !important;
    color: white !important;
    border: none !important;
}

.ai-selector-button[data-ai="ChatGPT"]:hover {
    background-color: #0d8c6d !important;
}

.ai-selector-button[data-ai="Claude"] {
    background-color: #7c3aed !important;
    color: white !important;
    border: none !important;
}

.ai-selector-button[data-ai="Claude"]:hover {
    background-color: #6d28d9 !important;
}

.ai-selector-button[data-ai="Gemini"] {
    background-color: #4285f4 !important;
    color: white !important;
    border: none !important;
}

.ai-selector-button[data-ai="Gemini"]:hover {
    background-color: #3367d6 !important;
}

.ai-selector-button[data-ai="DeepSeek"] {
    background-color: #2563eb !important;
    color: white !important;
    border: none !important;
}

.ai-selector-button[data-ai="DeepSeek"]:hover {
    background-color: #1d4ed8 !important;
}`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

let isPopupVisible = false;
let lastClipboard = "";
let lastSelectedText = "";
let isInitialLoad = true;

async function checkClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        if (text !== lastClipboard && text.trim()) {
            if (isInitialLoad) {
                lastClipboard = text;
                isInitialLoad = false;
            } else {
                lastClipboard = text;
                console.log("Clipboard updated:", text);
                showOptions(text, null, true); 
            }
        }
    } catch (err) {
        console.error("Clipboard access denied:", err);
    }
}

setTimeout(() => {
    checkClipboard();
}, 500);

setInterval(checkClipboard, 1000);

window.addEventListener("mouseup", handleSelection);

// Add keyboard event listener for Ctrl+C
window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        // If popup is visible, prevent default copy behavior
        if (isPopupVisible) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
});

function handleSelection(e) {
    if (isPopupVisible || e.target?.closest('.ai-selector-popup')) {
        return;
    }

    removeExistingPopup();

    const text = window.getSelection().toString().trim();
    if (text) {
        showOptions(text, e, false); 
    }
}

function removeExistingPopup() {
    const existingPopup = document.querySelector('.ai-selector-popup');
    if (existingPopup) {
        existingPopup.remove();
        isPopupVisible = false;
    }
}

function showOptions(text, event, isClipboardTrigger) {
    console.log("showOptions called");
    removeExistingPopup();

    const popup = document.createElement('div');
    const statement = document.createElement('p');
    statement.textContent = isClipboardTrigger ? 
        'Select an AI assistant to use with the copied text :' : 
        'Copy the text (Ctrl C) and select the option :';
    statement.className = 'statement';

    popup.appendChild(statement);
    popup.className = 'ai-selector-popup';
    
    if (isClipboardTrigger) {
        popup.classList.add('centered');
    } else if (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let posX = mouseX + 10;
        let posY = mouseY + 10;
        
        document.body.appendChild(popup);
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        
        if (posX + popupWidth > viewportWidth) {
            posX = mouseX - popupWidth - 10;
        }
        
        if (posY + popupHeight > viewportHeight) {
            posY = mouseY - popupHeight - 10;
        }
        
        posX = Math.max(10, posX);
        posY = Math.max(10, posY);
        
        popup.style.left = `${posX}px`;
        popup.style.top = `${posY}px`;
    }
    
    if (isClipboardTrigger) {
        document.body.appendChild(popup);
    }
    
    const aiList = [
        { name: 'ChatGPT', url: 'https://chat.openai.com/' },
        { name: 'Claude', url: 'https://claude.ai/' },
        { name: 'Gemini', url: 'https://gemini.google.com/app' },
        { name: 'DeepSeek', url: 'https://chat.deepseek.com/' }
    ];
    
    for (let i = 0; i < aiList.length; i++) {
        const ai = aiList[i];
        const button = document.createElement('button');
        button.className = 'ai-selector-button';
        button.setAttribute('data-ai', ai.name);
        button.textContent = `Use ${ai.name}`;
        
        // Add AI icon based on the service
        const icon = document.createElement('span');
        icon.style.cssText = 'font-size: 16px;';
        switch(ai.name) {
            case 'ChatGPT':
                icon.textContent = '🤖';
                break;
            case 'Claude':
                icon.textContent = '🧠';
                break;
            case 'Gemini':
                icon.textContent = '✨';
                break;
            case 'DeepSeek':
                icon.textContent = '🔍';
                break;
        }
        button.insertBefore(icon, button.firstChild);
    
        button.addEventListener("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log(`${ai.name} button was clicked!`);
            try {
                console.log("Attempting to redirect...");
                redirectToAI(ai.url, text);
            } catch(error) {
                console.error("Error in click handler:", error);
            }
        });
    
        popup.appendChild(button);
    }
    
    isPopupVisible = true;
    
    setTimeout(() => {
        console.log("setTimeout triggered");
    
        function closePopup(e) {
            console.log("Event triggered:", e.type);
            
            if (!popup.contains(e.target)) {
                console.log("Target achieved");
                popup.remove();
                isPopupVisible = false;
    
                if (e.type === 'click') {
                    document.removeEventListener('click', closePopup);
                } else if (e.type === 'mousedown') {
                    document.removeEventListener('mousedown', closePopup);
                }
            }
        }
    
        document.addEventListener('click', closePopup);
        document.addEventListener('mousedown', closePopup);
    
    }, 0);
    
}

function redirectToAI(url, selectedText) {
    console.log("Redirect method called with:", url);
    const encodedText = encodeURIComponent(selectedText);
    console.log("Encoded text:", encodedText);
    
    try {
        const newWindow = window.open(url, '_blank');
        console.log("Window.open called successfully");

        const checkTextareaInterval = setInterval(function() {
            console.log("Checking if textarea is available...");

            const inputField = newWindow.document.querySelector('textarea');
            if (inputField) {
                console.log("Textarea found, injecting text");
                inputField.value = selectedText;

                const sendButton = newWindow.document.querySelector('button');
                if (sendButton) {
                    sendButton.click();
                }

                clearInterval(checkTextareaInterval);
            }
        }, 1000);

    } catch (error) {
        console.error("Error in redirect:", error);
    }
}