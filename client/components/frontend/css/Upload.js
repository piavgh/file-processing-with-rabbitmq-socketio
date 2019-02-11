export const styles = theme => ({
  root: {
    paddingTop:20,
    margin:'auto'
  },
  button: {
    boxShadow: 'none',
    width: '100%',
    backgroundColor:'#86AD54',
    color:'white'
  },
  dropZone: {
    height: 'auto',
    border: '1px dotted black',
    padding: 10,
    textAlign:'center'
  },
  uploadImageDivContainer: {
    flexDirection:'row-reverse',
    height:'100%',
    paddingLeft:10,
    marginLeft: 'auto'
  },
  uploadImageDiv: {
    border: '1px dotted black',
    width:250,
    height:'98%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  previewImage: {
    maxWidth: 170,
    maxHeight:225,
    width: 'auto',
    height: 'auto',
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 250
    }
  },
  previewImageError: {
    textAlign:'right',
    justifyContent:'right',
    '& > p': {
      marginLeft:'auto',
      maxWidth: '100%',
      [theme.breakpoints.up('md')]: {
        maxWidth: '50%'
      }
    }
  }
});