import { ActorReference } from "./references";

import * as systemMap from './system-map';

export const stop = (actor: ActorReference) => {
  let concreteActor = systemMap.find(actor.system.name, actor);
  concreteActor &&
    concreteActor.stop &&
    concreteActor.stop();
};

export const query = (actor: ActorReference, msg: any, timeout: number) => {
  if (!timeout) {
    throw new Error('A timeout is required to be specified');
  }

  const concreteActor = systemMap.find(actor.system.name, actor);

  return (concreteActor && concreteActor.query)
    ? concreteActor.query(msg, timeout)
    : Promise.reject(new Error('Actor stopped or never existed. Query can never resolve'));
};

export const dispatch = (actor: ActorReference, msg: any, DEPRECATED_sender?: unknown) => {
  let concreteActor = systemMap.find(actor.system.name, actor);
  concreteActor &&
    concreteActor.dispatch &&
    concreteActor.dispatch(msg, DEPRECATED_sender);
};

