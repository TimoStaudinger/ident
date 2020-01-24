import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  fade,
  makeStyles,
  IconButton,
  Tooltip
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import RefreshIcon from '@material-ui/icons/Refresh'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import Logo from './users.svg'

const useStyles = makeStyles(theme => ({
  header: {
    background: 'linear-gradient(45deg, #141E30 20%, #243B55 70%)'
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  logo: {
    height: '2rem',
    marginRight: '1rem'
  }
}))

const Header = ({
  filter,
  setFilter,
  refreshConfigs,
  currentUser,
  selectCurrentUser
}) => {
  const classes = useStyles()

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <img src={Logo} alt="Ident" className={classes.logo} />

        <Typography className={classes.title} variant="h6" noWrap>
          Ident
        </Typography>

        {currentUser && (
          <Tooltip title="Log out" aria-label="log out">
            <IconButton onClick={() => selectCurrentUser(null)} color="inherit">
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip
          title="Refresh all configurations"
          aria-label="refresh all configurations"
        >
          <IconButton onClick={refreshConfigs} color="inherit">
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            autoFocus
            placeholder="Filter…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{'aria-label': 'search'}}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header
