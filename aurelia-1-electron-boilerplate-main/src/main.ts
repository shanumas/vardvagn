import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { isElectron } from "utils/is-electron";

export function configure(aurelia: Aurelia): void {

  console.log("...", process.env.BUILD_ENVIRONMENT);

  if (isElectron()) {
    console.log("we're in eleectron");
  } else {
    console.log("...", process.env.BUILD_ENVIRONMENT);
  }

  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start()
  .then(
    () => aurelia.setRoot(
      PLATFORM.moduleName(process.env.BUILD_ENVIRONMENT))
  );
  // process.env.BUILD_ENVIRONMENT
}
