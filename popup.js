document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cleanUrlButton').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: cleanAmazonUrl,
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const newUrl = results[0].result;
                    // Copy the cleaned URL to clipboard from the popup
                    navigator.clipboard.writeText(newUrl)
                        .then(() => {
                            console.log("URL copied to clipboard:", newUrl);
                        })
                        .catch(err => {
                            console.error("Failed to copy URL:", err);
                        });
                }
            });
        });
    });
});

function cleanAmazonUrl() {
    const url = new URL(window.location.href);
    const pathMatch = url.pathname.match(/\/dp\/([A-Z0-9]+)/i);
    if (url.host.includes("amazon") && pathMatch !== null) {
        const newUrl = `https://${url.host}/dp/${pathMatch[1]}`;
        
        // Redirect to the clean URL
        window.location.href = newUrl;
        
        // Return the cleaned URL to the popup script
        return newUrl;
    }
    return null;
}