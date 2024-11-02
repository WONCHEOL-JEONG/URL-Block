document.getElementById('blockButton').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    if (url) {
        chrome.storage.sync.get({blockedUrls: []}, function(data) {
            const blockedUrls = data.blockedUrls;
            if (!blockedUrls.includes(url)) {
                blockedUrls.push(url);
                chrome.storage.sync.set({blockedUrls: blockedUrls}, function() {
                    document.getElementById('status').textContent = `Blocked: ${url}`;
                    chrome.runtime.sendMessage({updateFilters: true});
                });
            }
        });
    }
});

document.getElementById('unblockButton').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    if (url) {
        chrome.storage.sync.get({blockedUrls: []}, function(data) {
            const blockedUrls = data.blockedUrls;
            const index = blockedUrls.indexOf(url);
            if (index > -1) {
                blockedUrls.splice(index, 1);
                chrome.storage.sync.set({blockedUrls: blockedUrls}, function() {
                    document.getElementById('status').textContent = `Unblocked: ${url}`;
                    chrome.runtime.sendMessage({updateFilters: true});
                });
            }
        });
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.updateFilters) {
        chrome.storage.sync.get({blockedUrls: []}, function(data) {
            updateFilters(data.blockedUrls);
        });
    }
});