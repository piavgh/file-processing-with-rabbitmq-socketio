import React from 'react';
import Header from '../../containers/app/Header';
import Upload from '../../containers/app/Upload';
import ProcessButton from '../../containers/app/ProcessButton';
import SampleImage from '../../containers/app/SampleImage';

class Home extends React.Component {
  
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header />
        <Upload />
        <SampleImage />
        <ProcessButton />
      </div>
    );
  }
}
export default Home;