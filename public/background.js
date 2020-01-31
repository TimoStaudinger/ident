/* global chrome */

const CHROME_VERSION = getChromeVersion()

let currentUser = null

chrome.runtime.onMessage.addListener(request => {
  console.log('message')
  if (request.scheme === 'dark') {
    console.log('setting darkMode')
    chrome.browserAction.setIcon({
      path: {
        '128': 'ident-128-dark.png',
        '48': 'ident-48-dark.png',
        '16': 'ident-16-dark.png'
      }
    })
  }
})

chrome.storage.sync.get(['currentUser'], result => {
  currentUser = result.currentUser
  console.log(currentUser)
})

chrome.storage.onChanged.addListener(changes => {
  let domain = null

  if (changes.currentUser) {
    console.log('Switching user...')
    currentUser = changes.currentUser.newValue
    console.log(currentUser)
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let tab = tabs[0]
    let url = new URL(tab.url)
    domain = url.hostname

    if (domain) {
      console.log('Clearing cookies...')
      chrome.cookies.getAll({domain: domain}, cookies => {
        cookies.forEach(cookie => {
          chrome.cookies.remove({url: tab.url, name: cookie.name})
        })

        console.log('Clearing local and session storage...')
        chrome.tabs.executeScript(
          {
            code: 'localStorage.clear(); sessionStorage.clear();'
          },
          () => {
            console.log('Refreshing...')
            chrome.tabs.reload()

            setUpHeaderListener()
            console.log('Done.')
          }
        )
      })
    }
  })
})

function modifyRequestHeaders(headersToInject, headers) {
  if (!headersToInject.length) {
    return
  }

  // Create an index map so that we can more efficiently override
  // existing header.
  const indexMap = {}
  for (const index in headers) {
    const header = headers[index]
    indexMap[header.name.toLowerCase()] = index
  }

  for (let header of headersToInject) {
    const index = indexMap[header.name.toLowerCase()]
    if (index !== undefined) {
      headers[index].value = header.value
    } else {
      headers.push({name: header.name, value: header.value})
      indexMap[header.name.toLowerCase()] = headers.length - 1
    }
  }
}

function modifyRequestHeaderHandler(details) {
  if (localStorage.isPaused || !currentUser) {
    return {}
  }

  modifyRequestHeaders(
    [{name: currentUser.headerName, value: currentUser.headerValue}],
    details.requestHeaders
  )

  return {requestHeaders: details.requestHeaders}
}

function getChromeVersion() {
  let pieces = navigator.userAgent.match(
    /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
  )
  if (pieces == null || pieces.length !== 5) {
    return {}
  }
  pieces = pieces.map(piece => parseInt(piece, 10))
  return {
    major: pieces[1],
    minor: pieces[2],
    build: pieces[3],
    patch: pieces[4]
  }
}

function setUpHeaderListener() {
  chrome.webRequest.onBeforeSendHeaders.removeListener(
    modifyRequestHeaderHandler
  )

  // Chrome 72+ requires 'extraHeaders' to be added for some headers to be modifiable.
  // Older versions break with it.
  if (currentUser) {
    let requiresExtraRequestHeaders = false
    if (CHROME_VERSION.major >= 72) {
      requiresExtraRequestHeaders = true
    }

    chrome.webRequest.onBeforeSendHeaders.addListener(
      modifyRequestHeaderHandler,
      {urls: ['<all_urls>']},
      requiresExtraRequestHeaders
        ? ['requestHeaders', 'blocking', 'extraHeaders']
        : ['requestHeaders', 'blocking']
    )
  }
}

// function onTabUpdated(tab) {
//   if (tab.active) {
//     delete localStorage.currentTabUrl
//     // Since we don't have access to the "tabs" permission, we may not have
//     // access to the url property all the time. So, match it against the URL
//     // found during request modification.
//     let url = tab.url
//     if (url) {
//       tabUrls[tab.id] = url
//     } else {
//       url = tabUrls[tab.id]
//     }
//     localStorage.activeTabId = tab.id

//     // Only set the currentTabUrl property if the tab is active and the window
//     // is in focus.
//     browser.windows.get(tab.windowId, {}, win => {
//       if (win.focused) {
//         localStorage.currentTabUrl = url
//       }
//     })
//     if (!url) {
//       return
//     }
//   }
// }

// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   onTabUpdated(tab)
// })

// browser.tabs.onActivated.addListener(activeInfo => {
//   browser.tabs.get(activeInfo.tabId, onTabUpdated)
// })

// browser.windows.onFocusChanged.addListener(windowId => {
//   if (windowId == browser.windows.WINDOW_ID_NONE) {
//     return
//   }
//   browser.windows.get(windowId, { populate: true }, win => {
//     for (let tab of win.tabs) {
//       onTabUpdated(tab)
//     }
//   })
// })

setUpHeaderListener()
