import * as React from 'react';
import { nextConfigProp } from '../../actions/game.actions';
import { connect } from 'react-redux';
import { partial } from '../../../util';
import {
  Button,
  Number,
  Select,
  String,
} from '../components';
import { configInterfaces } from '../../../engine/configs/config-interfaces';

function mapStateToProps(state) {
  return {
    config: state.nextConfig,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeConfig: (prop, value) => dispatch(nextConfigProp(prop, value)),
  };
}

export const Config = connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.createClass({
  render() {
    return (<div>
      { configInterfaces
        .map((i, key) => makeInterface(i,
          this.props.config[i.prop],
          partial(this.props.changeConfig, i.prop),
          key
        ))
      }<Button onClick={ this.props.store.game.create } value='New Game' />
    </div>);
  },
}));

function makeInterface(i, value, onChange, key) {

  let input;
  switch (i.type) {
    case 'select':
      input = (<Select
        byValue={ true }
        selected={ value }
        options={ i.options() }
        onChange={ onChange } />
      );
      break;

    case 'number':
      input = (<Number value={ value }
                      min={ i.min }
                      max={ i.max }
                      onChange={ onChange } />);
      break;

    case 'string':
      input = (<String value={ value }
                      sanitizer={ i.sanitizer }
                      onChange={ onChange } />);
      break;
  }
  return (<div key={ key }><strong>{ i.label }</strong>&nbsp;{ input }</div>);
}
