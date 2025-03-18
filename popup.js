document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cleanUrlButton').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: cleanAmazonUrl,
            });
        });
    });
});

function cleanAmazonUrl() {
    const url = new URL(window.location.href);
    const pathMatch = url.pathname.match(/\/dp\/([A-Z0-9]+)/i);
    if (url.host.includes("amazon") && pathMatch !== null) {
        const newUrl = `https://${url.host}/dp/${pathMatch[1]}`;

        // Copy the cleaned URL to the clipboard
        navigator.clipboard.writeText(newUrl)
            .then(() => {
                console.log("Clean URL copied to clipboard");
            })
            .catch(err => {
                console.error("Failed to copy URL: ", err);
            });

        window.location.href = newUrl;
    }
}