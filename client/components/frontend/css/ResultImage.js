export const styles = theme => ({
  imageSectionTitle: {
    color:'blue',
    fontSize:'1.5em',
    textAlign:'center'
  },
  imageSection: {
    paddingBottom:5,
  },
  image: {
    textAlign:'center',
    '&:first-child': {
      paddingLeft:10,
      paddingRight:10
    },
    '&:nth-child(2)': {
      paddingRight:10,
      paddingLeft:10
    },
    '& > div': {
      border:'2px solid blue',
      minHeight:300
    },
    '& > div > img': {
      maxHeight:430,
      maxWidth:'100%',
      paddingTop:10,
      paddingBottom:10,
      textAlign:'center',
      color:'#69ddef'
    },
    [theme.breakpoints.up('md')]: {
      '&:first-child': {
        paddingLeft:30,
        paddingRight:40,
        '& > div': {  
          height:'99.5%'
        }
      },
      '&:nth-child(2)': {
        paddingRight:30,
        paddingLeft:40,
        '& > div': {  
          height:'99.5%'
        }
      }
    }
  },
  processButton: {
    textAlign:'center',
    backgroundColor: '#e8e5e5',
    marginTop:40,
    paddingBottom:20,
    width:'100%',
    
    '& > button': {
      backgroundColor:'#86AD54',
      color:'white',
      marginTop:50,
      marginBottom:20,
      padding:'10px 50px 10px 50px'
    }
  }
});
