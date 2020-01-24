import React, {useState} from 'react'
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
  BottomNavigation,
  BottomNavigationAction
} from '@material-ui/core'
import {amber} from '@material-ui/core/colors'
import PersonIcon from '@material-ui/icons/Person'
import SettingsIcon from '@material-ui/icons/Settings'

import UserList from './UserList'
import Header from './Header'
import ConfigList from './ConfigList'

import useConfig from './useConfig'

const useStyles = makeStyles(theme => ({
  root: {
    width: 600
  }
}))

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

  const [page, setPage] = useState('users')

  const handleSelectPage = page => {
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

        {page === 'users' ? (
          <UserList
            filter={normalizedFilter}
            currentUser={currentUser}
            users={users}
            selectCurrentUser={selectCurrentUser}
          />
        ) : (
          <ConfigList
            configs={configs}
            addConfig={addConfig}
            removeConfig={removeConfig}
            filter={normalizedFilter}
          />
        )}

        <BottomNavigation
          value={page}
          onChange={(event, page) => {
            handleSelectPage(page)
          }}
          showLabels
        >
          <BottomNavigationAction
            value="users"
            label="Users"
            icon={<PersonIcon />}
          />
          <BottomNavigationAction
            value="config"
            label="Configurations"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </div>
    </ThemeProvider>
  )
}

export default App
