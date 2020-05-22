import { createMuiTheme } from '@material-ui/core/styles'
import { teal, orange } from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette: {
      primary: {
      light: '#d6d2be',
      main: '#b4adef',
      dark: '#a79ebd',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fcfdaf',
      main: '#efd780',
      dark: '#dba159',
      contrastText: '#000',
    },
      openTitle: teal['600'],
      protectedTitle: orange['300'],
      type: 'light'
    }
  })

  export default theme  