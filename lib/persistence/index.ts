export { spawnPersistent } from './persistent-actor';
export { persistentQuery } from './persistent-query';
export { PersistedEvent, PersistedSnapshot, AbstractPersistenceEngine } from './persistence-engine';
import type { ActorSystem } from '../system';

export const configurePersistence = (engine: AbstractPersistenceEngine) => (system: ActorSystem) => {
  if (!engine) {
    throw new Error('Persistence engine should not be undefined');
  }
  return Object.assign(system, { persistenceEngine: engine });
};

