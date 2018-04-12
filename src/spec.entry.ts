import 'ts-helpers';
import 'reflect-metadata';

declare function require(args: any[]): any;

/* tslint:disable max-line-length */
let testContext = (<{ context?: Function }>require).context(
  './',
  true,
  /^(?!.*index\.tsx?$|.*angular\/.*|.*react\/.*|.*front-end\/front-end.ts$).*\.tsx?$/,
);
testContext.keys().forEach(testContext);
