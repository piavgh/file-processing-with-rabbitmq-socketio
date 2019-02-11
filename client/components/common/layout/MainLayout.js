import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import {styles} from './css/main';

import Logo from '../../frontend/Logo';

class MainLayout extends Component {
    render() {
        const classes = this.props.classes;

        return (
          <Grid container className={classes.root} justify="center">
            <Grid item xs={12} className={classes.body}>
              <ToastContainer />
              <Logo />
              {this.props.children}  
            </Grid>
          </Grid>
        );
    }

}

MainLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.element
};

export default withStyles(styles)(MainLayout)
