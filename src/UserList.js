import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    height: 400
  },
  list: {}
}))

const UserList = ({filter, currentUser, users, selectCurrentUser}) => {
  const classes = useStyles()

  const normalizedFilter =
    filter && filter.trim().length ? filter.trim().toLowerCase() : null
  const filteredUsers = normalizedFilter
    ? users.filter(user => user.name.toLowerCase().includes(normalizedFilter))
    : users

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {filteredUsers.map(user => (
          <ListItem
            button
            selected={currentUser && currentUser.name === user.name}
            onClick={() => selectCurrentUser(user)}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary={user.name}
              secondary={
                <>
                  {user.config}
                  {' • '}
                  {user.application}
                  {' — '}
                  {user.role}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default UserList
