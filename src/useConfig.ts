import {useState, useEffect} from 'react'
import Config, {User, DenormalizedUser} from './model/Config'

import dummyConfig from './dummyConfig.json'

interface UseConfig {
  currentUser: User | null
  selectCurrentUser: (user: User | null) => void
  users: DenormalizedUser[]
  configs: Config[]
  addConfig: (url: string) => Promise<void>
  removeConfig: (url: string) => void
  refreshConfigs: () => Promise<void>
}

const useConfig = (): UseConfig => {
  const [configs, setConfigs] = useState<Config[] | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const selectCurrentUser = (user: User | null) => {
    setCurrentUser(user || null)
    chrome && chrome.storage && chrome.storage.sync.set({currentUser: user})
  }

  useEffect(() => {
    if (chrome && chrome.storage) {
      chrome.storage.sync.get(
        ['currentUser', 'configs'],
        (result: {[key: string]: any}) => {
          setCurrentUser(result.currentUser || null)
          setConfigs(result.configs)
        }
      )

      let handleStorageChange = (changes: {
        [key: string]: chrome.storage.StorageChange
      }) => {
        if (changes.currentUser) {
          setCurrentUser(changes.currentUser.newValue || null)
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
      console.error(
        'Unable to connect to configuration repository. Using dummy data.'
      )
      setConfigs([
        {...dummyConfig, url: 'https://example.org/my/configuration.json'}
      ])
    }
  }, [])

  const addConfig = async (url: string) => {
    const response = await fetch(url)
    const config = await response.json()

    const newConfigs: Config[] = [...(configs || []), {...config, url}]

    setConfigs(newConfigs)
    chrome && chrome.storage && chrome.storage.sync.set({configs: newConfigs})
  }

  const removeConfig = (url: string) => {
    const newConfigs = (configs || []).filter(config => config.url !== url)

    setConfigs(newConfigs)
    chrome && chrome.storage && chrome.storage.sync.set({configs: newConfigs})
  }

  const refreshConfigs = async () => {
    const refreshedConfigs = []

    for (let config of configs || []) {
      const response = await fetch(config.url)
      const refreshedConfig = await response.json()
      refreshedConfigs.push({...refreshedConfig, url: config.url})
    }

    setConfigs(refreshedConfigs)
    chrome &&
      chrome.storage &&
      chrome.storage.sync.set({configs: refreshedConfigs})
  }

  const users = (configs || [])
    .map(config =>
      config.applications.reduce(
        (acc: DenormalizedUser[], curr) => [
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
