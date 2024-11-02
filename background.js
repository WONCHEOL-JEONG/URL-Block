chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({blockedUrls: []}, function(data) {
    updateFilters(data.blockedUrls);
  });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.blockedUrls) {
    updateFilters(changes.blockedUrls.newValue);
  }
});

function updateFilters(blockedUrls) {
  const removeRuleIds = Array.from({ length: 1000 }, (_, i) => i + 1); // 최대 1000개의 규칙 제거
  const rules = blockedUrls.map((url, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: url, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeRuleIds,
      addRules: rules
  });
}