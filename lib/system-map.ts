import type { Actor } from "./actor";
import type { ActorSystemReference } from "./references";
import type { ActorSystem } from "./system";

const systemMap = new Map<string, ActorSystem>();

export const add = (system: ActorSystem) => {
  systemMap.set(system.name, system);
};

export const find = (systemName: string, reference: ActorSystemReference) => {
  const system = systemMap.get(systemName);
  return (system && reference)
    ? system.find(reference)
    : system;
};

export const remove = (systemName: string) => {
  systemMap.delete(systemName);
};

export const applyOrThrowIfStopped = (reference: ActorSystemReference, f: (ActorSystem | Actor) => void) => {
  let concrete = find(reference.system.name, reference);
  if (concrete) {
    return f(concrete);
  } else {
    throw new Error('Actor has stopped or never even existed');
  }
};

export default {
  add, find, remove, applyOrThrowIfStopped
}