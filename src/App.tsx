import React, {useState} from 'react'
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
  BottomNavigation,
  BottomNavigationAction,
  Box
} from '@material-ui/core'
import {amber} from '@material-ui/core/colors'
import PersonIcon from '@material-ui/icons/Person'
import SettingsIcon from '@material-ui/icons/Settings'

import UserList from './UserList'
import Header from './Header'
import ConfigList from './ConfigList'

import useConfig from './useConfig'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600
  }
}))

enum Page {
  users = 'users',
  configs = 'configs'
}

const theme = createMuiTheme({
  palette: {
    primary: {main: '#243B55'},
    secondary: amber
  },
  typography: {
    fontFamily: 'Raleway'
  }
})

const App = () => {
  const {
    currentUser,
    users,
    selectCurrentUser,
    configs,
    addConfig,
    removeConfig,
    refreshConfigs
  } = useConfig()

  const classes = useStyles()

  const [filter, setFilter] = useState('')
  const normalizedFilter =
    filter && filter.trim().length ? filter.trim().toLowerCase() : null

  const [page, setPage] = useState(Page.users)

  const handleSelectPage = (page: Page) => {
    setPage(page)
    setFilter('')
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Header
          filter={filter}
          setFilter={setFilter}
          refreshConfigs={refreshConfigs}
          currentUser={currentUser}
          selectCurrentUser={selectCurrentUser}
        />

        {page === Page.users ? (
          <UserList
            currentUser={currentUser}
            users={users}
            selectCurrentUser={selectCurrentUser}
            filter={normalizedFilter}
          />
        ) : (
          <ConfigList
            configs={configs}
            addConfig={addConfig}
            removeConfig={removeConfig}
            filter={normalizedFilter}
          />
        )}

        <Box boxShadow={3}>
          <BottomNavigation
            value={page}
            onChange={(_, page: Page) => {
              handleSelectPage(page)
            }}
            showLabels
          >
            <BottomNavigationAction
              value={Page.users}
              label="Users"
              icon={<PersonIcon />}
            />
            <BottomNavigationAction
              value={Page.configs}
              label="Configurations"
              icon={<SettingsIcon />}
            />
          </BottomNavigation>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
