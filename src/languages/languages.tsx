import { h } from 'preact';
import { Translation } from '../interfaces';
import { state } from '../components/state';
import { Dictionary } from '@ch1/utility';

function LanguagesBase(props: { currentLanguageCode: () => string, setTranslation: (code?: string) => void, translation: Translation }) {
  let languages: Dictionary<string> = {};
  if (!props.translation.languages) {
    // load initial state
    props.setTranslation();
  } else {
    languages = props.translation.languages;
  }

  const code = props.currentLanguageCode();

  const options = Object.keys(languages).map((key: string, i: number) => {
    return key === code
    ? <option key={i} selected value={ key } >{languages[key]}</option>
    : <option key={i} value={ key } >{languages[key]}</option>;
  });

  return <select onChange={ (event: any) => props.setTranslation(event.target.value) } >{ options }</select>
}

export const Languages = state(LanguagesBase);
