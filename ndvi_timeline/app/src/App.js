import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'rodal/lib/rodal.css';
import FIS from './components/FIS';

import './App.scss';

class App extends Component {
  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      toolsVisible: window.innerWidth > 900,
      newLocation: false,
      isCompare: false,
      user: {},
    };
  }

  componentDidMount() {
    this.setState({ fisDialog: true, fisDialogAoiOrPoi: 'aoi' });
  }

  

  render() {
    const { fisDialog, fisDialogAoiOrPoi } = this.state;

    return (
     <div className="eocloudRoot">
      {fisDialog && (
        <FIS
          aoiOrPoi={fisDialogAoiOrPoi}
          drawDistribution={fisDialogAoiOrPoi === 'aoi'}
          onClose={() => this.setState({ fisDialog: false })}
        />
      )}
     </div>
  );
  }
}

export default connect(store => store)(App);
