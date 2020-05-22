import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Container,Grid, Button ,TextField} from '@material-ui/core/'
import auth from './../auth/auth-helper'
import ChatGridLayout from './ChatGridLayout'

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
}))
export default function Messenger () {
  const classes = useStyles()
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    
    return function cleanup(){
      abortController.abort()
    }

  }, [])

  

    return (
        <ChatGridLayout></ChatGridLayout>
    )
}
