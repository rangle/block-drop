import * as React from 'react';
import { nextConfigProp } from '../../actions/game.actions';
import { connect } from 'react-redux';
import { partial } from '../../../util';
import {
  Button,
  Select,
} from '../components';
import { windowApplet } from '../../styles';
import { configInterfaces } from '../../../engine/configs/config-interfaces'
import { store } from '../../store/store';

function mapStateToProps(state) {
  return {
    detectAndClear: state.nextConfig.detectAndClear,
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
    return (<div className={ windowApplet }>{ configInterfaces
      .map((i) => makeInterface(i,
        this.props.detectAndClear,
        partial(this.props.changeConfig, i.prop)))
    }<Button onClick={ store.game.create } value='New Game' /></div>);
  },
}));

function makeInterface(i, selected, onChange) {
  switch (i.type) {
    case 'select':
      return (<Select
        key={ i }
        selected={ selected }
        options={ i.options() }
        onChange={ onChange }>
      </Select>);
  }
}
