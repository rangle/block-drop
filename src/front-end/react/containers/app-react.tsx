import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from '../components';
import { partial } from '../../../util';
import { verticalUiClass } from '../../styles';
import { ROUTES } from '../../constants';

function mapStateToProps(state, ownProps) {
  return {
    currentScreen: state.app.currentScreen,
    path: ownProps.location.pathname,
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
          ROUTES.map((route, i) => {
            if (this.props.path === route.path) {
              return null;
            }
            return (<Button key = {i}
                            value={ route.name }
                            onClick={
                            partial(() => this.props.router.push(route.path),
                            route.id)
                          }/>);
          })
        }
      </div>
      <div>
        { this.props.children }
      </div>
      </div>);
  },
})));

