export const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor:'white',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 110,
      paddingRight: 110,
      backgroundColor:'#313131'
    }
  },
  body: {
    backgroundColor:'white'
  }
});