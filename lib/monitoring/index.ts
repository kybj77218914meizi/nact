import { ActorReference } from '../references';
import { ActorSystem } from '../system';

export {
  LogLevel,
  LogEvent,
  LogException,
  LogMetric,
  LogTrace,
  LoggingFacade,
  logNothing
} from './monitoring';

export { logToConsole } from './console-engine';
import { LoggingFacade } from './monitoring';

export const configureLogging = (engine: (system: ActorSystem) => ActorReference) => (system: ActorSystem) => {
  const loggingActor = engine(system.reference);
  if (loggingActor) {
    system.createLogger = (reference) => new LoggingFacade(loggingActor, reference);
  } else {
    throw new Error('Logging engine is not defined');
  }
};
