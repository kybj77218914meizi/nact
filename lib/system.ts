import { ActorReference, ActorSystemReference, TemporaryReference } from './references';
import { ActorPath } from './paths';
import assert from './assert';
import { stop } from './functions';
import * as systemMap from './system-map';
import { Actor } from './actor';
import { Deferral } from './deferral';
import { LoggingFacade } from './monitoring';

const toBase36 = (x: number) => Number(x).toString(36);
const generateSystemId = () => {
  return [...crypto.getRandomValues(new Uint32Array(4))].map(toBase36).join('-');
};

export class ActorSystem {
  children: Map<string, Actor>;
  createLogger: (reference: ActorReference) => LoggingFacade | undefined;
  name: string;
  path: ActorPath;
  reference: ActorSystemReference;
  childReferences: Map<any, any>;
  tempReferences: Map<number, Deferral>;
  stopped: boolean;
  system: this;
  constructor(extensions: [] | [{ name: string }, ...any]) {
    let [hd, ...tail] = extensions;
    this.children = new Map();
    this.createLogger = () => undefined;
    this.name = (typeof (hd) === 'object' && hd.name) || generateSystemId();
    this.path = ActorPath.root(this.name);
    this.reference = new ActorSystemReference(this.name, this.path);
    this.childReferences = new Map();
    this.tempReferences = new Map();
    this.stopped = false;
    this.system = this;
    assert(extensions instanceof Array);
    systemMap.add(this);
    ([...(typeof (hd) === 'function') ? [hd] : [], ...tail]).forEach(extension => extension(this));
  }

  addTempReference(reference: TemporaryReference, deferral: Deferral) {
    this.tempReferences.set(reference.id, deferral);
  }

  removeTempReference(reference: TemporaryReference) {
    this.tempReferences.delete(reference.id);
  }

  find(actorRef: ActorSystemReference | ActorReference | TemporaryReference): undefined | ActorSystem | Actor | { dispatch: (...args: any[]) => void } {
    if (!actorRef) {
      return undefined;
    }
    switch (actorRef.type) {
      case 'actor':
        let parts =
          actorRef &&
          actorRef.path &&
          actorRef.path.parts;

        return parts && parts.reduce((parent: ActorSystem | Actor | undefined, current: string) =>
          parent &&
          parent.children.get(current),
          this
        );

      case 'temp':
        const actor = this.tempReferences.get(actorRef.id);
        return actor && actor.resolve && { dispatch: (...args: any[]) => actor.resolve(...args) };
      case 'system':
        return this;
    }
  }

  handleFault(_msg: any, _sender: ActorReference | TemporaryReference, _error: Error, child: ActorReference) {
    console.log('Stopping top level actor,', child.name, 'due to a fault');
    stop(child);
  }

  childStopped(child: Actor) {
    this.children.delete(child.name);
    this.childReferences.delete(child.name);
  }

  childSpawned(child: Actor) {
    this.childReferences.set(child.name, child.reference);
    this.children.set(child.name, child);
  }

  stop() {
    [...this.children.values()].forEach(x => stop(x.reference));
    this.stopped = true;
    systemMap.remove(this.name);
  }

  assertNotStopped() { assert(!this.stopped); return true; }
}

export const start = function () { return new ActorSystem([...arguments]).reference; };

