import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ToolTip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import ChatIcon from '@material-ui/icons/Chat'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#e8efad'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(({history}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Social Network
      </Typography>
      <Link to="/">
        <ToolTip title="Home">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon/>
        </IconButton>
        </ToolTip>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <ToolTip title="My profile">
            <IconButton aria-label="My Profile" style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>
              <PersonIcon />
            </IconButton>
            </ToolTip>
          </Link>
          <Link to={"/chat/"}>
            <ToolTip title="Messages">
            <IconButton aria-label="Messages" style={isActive(history, "/chat/")}>
              <ChatIcon />
            </IconButton>
            </ToolTip>
          </Link>
          <ToolTip title="Sign out">
          <IconButton aria-label="Sign out" color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}><ExitToAppIcon/>
            </IconButton>
            </ToolTip>
        </span>)
      }
    </Toolbar>
  </AppBar>
))

export default Menu
