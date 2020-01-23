/* global chrome */
import {useState, useEffect} from 'react'

const useConfig = () => {
  const [configs, setConfigs] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const selectCurrentUser = user => {
    setCurrentUser(user)
    chrome && chrome.storage && chrome.storage.sync.set({currentUser: user})
  }

  useEffect(() => {
    if (chrome && chrome.storage) {
      chrome.storage.sync.get(['currentUser', 'configs'], result => {
        setCurrentUser(result.currentUser)
        setConfigs(result.configs)
      })

      let handleStorageChange = changes => {
        if (changes.currentUser) {
          setCurrentUser(changes.currentUser.newValue)
        }

        if (changes.configs) {
          setConfigs(changes.configs.newValue)
        }
      }
      chrome.storage.onChanged.addListener(handleStorageChange)

      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange)
      }
    } else {
      console.error('Unable to connect to configuration repository.')
    }
  }, [])

  const addConfig = async url => {
    const response = await fetch(url)
    const config = await response.json()

    const newConfigs = [...(configs || []), {...config, url}]

    setConfigs(newConfigs)
    chrome && chrome.storage && chrome.storage.sync.set({configs: newConfigs})
  }

  const removeConfig = url => {
    const newConfigs = (configs || []).filter(config => config.url !== url)

    setConfigs(newConfigs)
    chrome && chrome.storage && chrome.storage.sync.set({configs: newConfigs})
  }

  const refreshConfigs = async () => {
    const refreshedConfigs = []

    for (let config of configs) {
      const response = await fetch(config.url)
      const refreshedConfig = await response.json()
      refreshedConfigs.push({...refreshedConfig, url: config.url})
    }

    setConfigs(refreshedConfigs)
    chrome &&
      chrome.storage &&
      chrome.storage.sync.set({configs: refreshedConfigs})
  }

  const users = configs
    ? configs
        .map(config =>
          config.applications.reduce(
            (acc, curr) => [
              ...acc,
              ...curr.users.map(user => ({
                ...user,
                config: config.name,
                application: curr.name
              }))
            ],
            []
          )
        )
        .reduce((acc, curr) => [...acc, ...curr], [])
    : []
  return {
    currentUser,
    selectCurrentUser,
    users,
    configs: configs || [],
    addConfig,
    removeConfig,
    refreshConfigs
  }
}

export default useConfig
