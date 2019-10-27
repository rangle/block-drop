import { h } from 'preact';
import { state } from '../components/state';
import { languages } from './language-state';

function LanguagesBase(props: { currentLanguageCode: () => string, setTranslation: (code?: string) => void }) {
  const code = props.currentLanguageCode();

  const options = Object.keys(languages).map((key: string, i: number) => {
    return key === code
    ? <option key={i} selected value={ key } >{languages[key]}</option>
    : <option key={i} value={ key } >{languages[key]}</option>;
  });

  return <select onChange={ (event: any) => props.setTranslation(event.target.value) } >{ options }</select>
}

export const Languages = state(LanguagesBase);
