import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from '../components';
import { partial } from '../../../util';
import { verticalUiClass } from '../../styles';

function mapStateToProps(state, ownProps) {
  return {
    currentScreen: state.app.currentScreen,
    path: ownProps.location.pathname,
    routes: state.app.routes,
  };
}

function mapDispatchToProps(dispatch)  {
  return {};
}

export const App = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({
  render() {
    return (<div>
      <div>
        { this.props.children }
      </div>
    </div>);
  },
})));

