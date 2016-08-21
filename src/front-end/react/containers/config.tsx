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
import { flex, flexCol } from '../../styles';
import { configInterfaces } from '../../../engine/configs/config-interfaces';
import { store } from '../../store/store';

const configStyle = `${flex} ${flexCol}`;

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
    return (<div className={ configStyle }>
      { configInterfaces
        .map((i, key) => makeInterface(i,
          this.props.config[i.prop],
          partial(this.props.changeConfig, i.prop),
          key
        ))
      }<Button onClick={ store.game.create } value='New Game' /></div>);
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
  return (<div key={ key }><strong>{ i.label }</strong>{ input }</div>);
}
