import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

function mapStateToProps(state, ownProps) {
  return {
    currentScreen: state.app.currentScreen,
    path: ownProps.location.pathname,
    routes: state.app.routes,
  };
}

function mapDispatchToProps() {
  return {};
}

export const App = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    React.createClass({
      render() {
        return (
          <div className='flex flex-auto flex-column'>
            <hr
              className='ma0 bn shadow-react-blue bg-react-blue h0-25 h0-5-l' />
            {this.props.children}
          </div>
        );
      },
    }),
  ),
);
