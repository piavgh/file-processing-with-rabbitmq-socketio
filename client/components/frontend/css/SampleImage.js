export const styles = theme => ({
  root: {
    paddingTop:10,
    margin: 'auto',
    textAlign:'center'
  },
  text: {
    fontSize:'1.1rem',
    paddingTop:10,   
    paddingBottom:10,
    [theme.breakpoints.up('md')]: {
      paddingTop:5,
      paddingBottom:15
    }
  },
  slider: {
    paddingBottom:30
  },
  sampleImage: {
    maxWidth: 250,
    maxHeight: 175,
    paddingRight:10,
    paddingLeft:10,
    paddingBottom:30,
    width: 'auto',
    height: 'auto',
    display: 'block',
    cursor:'pointer',
    [theme.breakpoints.up('md')]: {
      maxWidth: 310,
      maxHeight: 190
    }
  }  
});