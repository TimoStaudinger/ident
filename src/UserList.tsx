import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@material-ui/core'
import {User, DenormalizedUser} from './model/Config'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    height: 400
  },
  list: {}
}))

interface Props {
  filter: string | null
  currentUser: User | null
  users: DenormalizedUser[]
  selectCurrentUser: (user: User) => void
}

const UserList = ({filter, currentUser, users, selectCurrentUser}: Props) => {
  const classes = useStyles()

  const filteredUsers = filter
    ? users.filter(user => user.name.toLowerCase().includes(filter))
    : users

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {filteredUsers.map(user => (
          <ListItem
            key={user.name}
            button
            selected={currentUser !== null && currentUser.name === user.name}
            onClick={() => selectCurrentUser(user)}
          >
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
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
