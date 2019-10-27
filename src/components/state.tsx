import { h, Component } from 'preact';
import { LanguageState, Translation, UiToGameState } from '../interfaces';
import { noop } from '@ch1/utility';

export function state(Wrapped: any) {
  return class State extends Component<
    { uiToGameState?: UiToGameState; languageState: LanguageState },
    { translation: Translation }
  > {
    cleanup = noop;
    state = { translation: {} };
    constructor() {
      super();
    }

    componentDidMount() {
      if (this.cleanup !== noop) {
        this.cleanup();
      }
      this.cleanup = this.props.languageState.on((translation: Translation) => {
        this.setState(() => {
          return { translation };
        });
      });
    }

    componentWillUnmount() {
      this.cleanup();
      this.cleanup = noop;
    }

    render() {
      return (
        <Wrapped
          currentLanguageCode={this.props.languageState.currentCode}
          setTranslation={this.props.languageState.set}
          translation={this.state.translation}
          uiToGameState={this.props.uiToGameState}
        />
      );
    }
  };
}
