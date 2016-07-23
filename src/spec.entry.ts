import 'ts-helpers';

declare function require(args: any[]): any;

let testContext = (<{ context?: Function }>require).context(
  './',
  true,
  /^(?!\.\/index|\.\/spec).*\.ts$/);
testContext.keys().forEach(testContext);
