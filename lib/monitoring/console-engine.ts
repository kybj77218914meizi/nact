import { spawnStateless } from '../actor';
import { LogEvent, LogException, LogLevel, logLevelToString, LogMetric, LogTrace } from './monitoring';
import { ActorPath } from '../paths';
import { ActorReference, ActorSystemReference } from '../references';

export function logToConsole({ consoleProxy, formatter, name }: { consoleProxy?: Console, formatter?: any, name?: string } = {}) {
  const proxy = consoleProxy || console;
  const channels = new Array(LogLevel.CRITICAL + 1);
  channels[LogLevel.TRACE] = proxy.trace || proxy.log;
  channels[LogLevel.DEBUG] = proxy.debug || channels[LogLevel.TRACE];
  channels[LogLevel.INFO] = proxy.info || channels[LogLevel.DEBUG];
  channels[LogLevel.WARN] = proxy.warn || channels[LogLevel.INFO];
  channels[LogLevel.ERROR] = proxy.error || channels[LogLevel.WARN];
  channels[LogLevel.CRITICAL] = proxy.error || channels[LogLevel.ERROR];

  const actorRefToString = (actor: ActorReference) => new ActorPath(actor.path.parts, actor.path.system).toString();
  const formatTrace = formatter || ((logTrace: LogTrace) => `[${logLevelToString(logTrace.level)} @ ${logTrace.createdAt}] ${actorRefToString(logTrace.actor)} - ${logTrace.message}`);
  const formatMetrics = formatter || ((logMetric: LogMetric) => `[METRIC  @ ${logMetric.createdAt}] ${actorRefToString(logMetric.actor)} - ${logMetric.name}: ${JSON.stringify(logMetric.values, undefined, 4)}`);
  const formatEvent = formatter || ((logEvent: LogEvent) => `[EVENT @ ${logEvent.createdAt}] ${actorRefToString(logEvent.actor)} - ${logEvent.name}: ${JSON.stringify(logEvent.properties, undefined, 4)}`);
  const formatException = formatter || ((logException: LogException) => `[EXCEPTION @ ${logException.createdAt}] ${actorRefToString(logException.actor)} - ${logException.exception}`);

  const getChannel = (level: number) => {
    const possibleChannel = channels[level];
    if (typeof possibleChannel === 'function') {
      return possibleChannel;
    } else {
      return () => { };
    }
  };

  return (system: ActorSystemReference) => spawnStateless(
    system,
    (log, ctx) => {
      switch (log.type) {
        case 'trace': {
          const channel = getChannel(log.level);
          channel(formatTrace(log));
          break;
        }
        case 'exception': {
          const channel = getChannel(LogLevel.ERROR);
          channel(formatException(log));
          break;
        }
        case 'metric': {
          const channel = getChannel(LogLevel.INFO);
          channel(formatMetrics(log));
          break;
        }
        case 'event': {
          const channel = getChannel(LogLevel.INFO);
          channel(formatEvent(log));
          break;
        }
      }
    },
    name || 'console-logger'
  );
};

module.exports = {
  logToConsole
};
