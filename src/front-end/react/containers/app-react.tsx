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
      <div className={ verticalUiClass }>
        {
          this.props.routes
            .map((route, i) => (<Button key = {i}
                                        value={ route.name }
                                        onClick={
                            partial(() => this.props.router.push(route.path),
                            route.id)
                          }/>))

        }
      </div>
      <div>
        { this.props.children }
      </div>
    </div>);
  },
})));

