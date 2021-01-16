import { ActorReference, Nobody } from '../references';
import { dispatch } from '../functions';

export const LogLevel = {
  OFF: 0,
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  CRITICAL: 6
};

export const logLevelAsText = [
  'OFF',
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'CRITICAL'
];

export const logLevelToString = (level: typeof LogLevel[keyof typeof LogLevel]) => logLevelAsText[level];


export class LogTrace {
  type: 'trace';
  properties: any;
  actor: ActorReference;
  createdAt: Date;
  level: number;
  message: string;
  constructor(level: number, message: string, actor: ActorReference, createdAt: Date | undefined) {
    this.level = level;
    this.type = 'trace';
    this.message = message;
    this.actor = actor;
    this.createdAt = createdAt || new Date();
  }
}

export class LogEvent {
  type: 'event';
  name: string;
  properties: any;
  actor: ActorReference;
  createdAt: Date;
  constructor(name: string, eventProperties: any, actor: ActorReference, createdAt: Date | undefined) {
    this.type = 'event';
    this.name = name;
    this.properties = eventProperties;
    this.actor = actor;
    this.createdAt = createdAt || new Date();
  }
}

export class LogMetric {
  type: 'metric';
  properties: any;
  actor: ActorReference;
  createdAt: Date;
  name: string;
  values: any;
  constructor(name: string, values: any, actor: ActorReference, createdAt: Date | undefined) {
    this.type = 'metric';
    this.name = name;
    this.values = values;
    this.actor = actor;
    this.createdAt = createdAt || new Date();
  }
}

export class LogException {
  type: 'exception';
  actor: ActorReference;
  createdAt: Date;
  exception: Error;
  constructor(exception: Error, actor: ActorReference, createdAt: Date | undefined) {
    this.type = 'exception';
    this.exception = exception;
    this.actor = actor;
    this.createdAt = createdAt || new Date();
  }
}

export const log = (facade: LoggingFacade, logEvent) => {
  dispatch(facade.loggingActor, logEvent, facade.reference);
};

export class LoggingFacade {
  loggingActor: any;
  reference: any;
  constructor(loggingActor: ActorReference, reference: ActorReference) {
    this.loggingActor = loggingActor;
    this.reference = reference;
  }

  trace(message: string) {
    log(this, new LogTrace(LogLevel.TRACE, String(message), this.reference));
  }

  debug(message: string) {
    log(this, new LogTrace(LogLevel.DEBUG, String(message), this.reference));
  }

  info(message: string) {
    log(this, new LogTrace(LogLevel.INFO, String(message), this.reference));
  }

  warn(message: string) {
    log(this, new LogTrace(LogLevel.WARN, String(message), this.reference));
  }

  critical(message: string) {
    log(this, new LogTrace(LogLevel.CRITICAL, String(message), this.reference));
  }

  error(message: string) {
    log(this, new LogTrace(LogLevel.ERROR, String(message), this.reference));
  }

  event(name: string, eventProperties: any) {
    log(this, new LogEvent(String(name), eventProperties, this.reference));
  }
  exception(exception: Error) {
    log(this, new LogException(exception, this.reference));
  }

  metric(name: string, values: any) {
    log(this, new LogMetric(String(name), values, this.reference));
  }
}

export const logNothing = () => new Nobody();
