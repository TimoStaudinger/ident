import React, {useState} from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {
  List,
  Fab,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DescriptionIcon from '@material-ui/icons/Description'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    height: 400,
    position: 'relative'
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  }
}))

const ConfigList = ({filter, configs, addConfig, removeConfig}) => {
  const theme = useTheme()
  const classes = useStyles()

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  }

  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [newConfigURL, setNewConfigURL] = useState('')

  const handleRemoveConfig = url => {
    removeConfig(url)
  }
  const handleAddConfig = () => {
    addConfig(newConfigURL)
    setShowSettingsDialog(false)
  }

  return (
    <div className={classes.root}>
      <List>
        {configs.map(config => (
          <ListItem>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary={config.name} secondary={config.url} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit">
                <DeleteIcon onClick={() => handleRemoveConfig(config.url)} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Add a new Configuration
        </DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              label="Configuration File URL"
              fullWidth
              value={newConfigURL}
              onChange={e => setNewConfigURL(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
          <Button onClick={handleAddConfig} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Zoom
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `0ms`
        }}
        unmountOnExit
      >
        <Fab
          color="secondary"
          className={classes.addButton}
          onClick={() => setShowSettingsDialog(true)}
        >
          <AddIcon className={classes.extendedIcon} />
        </Fab>
      </Zoom>
    </div>
  )
}

export default ConfigList
