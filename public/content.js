if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('darkMode')
  chrome.runtime.sendMessage({scheme: 'dark'})
}
