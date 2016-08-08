import * as React from 'react';
import { changeConfig } from '../../actions/game.actions';
import { connect } from 'react-redux';
import { partial } from '../../../util';
import { singletons } from '../../store/store';
import {
  Button,
  Select,
} from '../components';
import { windowApplet } from '../../styles';

function mapStateToProps(state) {
  return {
    detectAndClear: state.game.config.detectAndClear,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeConfig: (prop, value) => dispatch(changeConfig(prop, value)),
  };
}

export const Config = connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.createClass({
  render() {
    return (<div className={ windowApplet }>{ singletons.configInterfaces
      .map((i) => makeInterface(i,
        this.props.detectAndClear,
        partial(this.props.changeConfig, i.prop)))
    }<Button onClick={ singletons.createEngine } value='New Game' /></div>);
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
