import 'core-js/client/shim';
import 'reflect-metadata';
import 'hammerjs/hammer';
import 'ts-helpers';

require('zone.js/dist/zone');

(window as any).process = {
    env: { DEBUG: undefined },
};

if (process.env.ENV === 'build') {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}
