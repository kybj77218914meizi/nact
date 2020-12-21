const { AbstractPersistenceEngine } = require('../lib/persistence');

class MockPersistenceEngineProperties extends AbstractPersistenceEngine {
  constructor (events = {}, snapshots = {}, takeSnapshotIsWorking = true, validateSeqNumber = false, annotations = [], metadata = []) {
    super();
    this._events = events;
    this._snapshots = snapshots;
    this.takeSnapshotIsWorking = takeSnapshotIsWorking;
    this.validateSeqNumber = validateSeqNumber;
    this._annotations = annotations;
    this._metadata = metadata;
  }

  latestSnapshot (persistenceKey) {
    const snapshots = (this._snapshots[persistenceKey] || []);
    const snapshot = snapshots[snapshots.length - 1];
    return Promise.resolve(snapshot);
  }

  takeSnapshot (persistedSnapshot) {
    if (this.takeSnapshotIsWorking) {
      const prev = this._snapshots[persistedSnapshot.key] || [];
      this._snapshots[persistedSnapshot.key] = [...prev, persistedSnapshot];
      return Promise.resolve(persistedSnapshot);
    } else {
      return Promise.reject(new Error('Elvis has left the building'));
    }
  }

  events (persistenceKey, offset = 0, limit, tags) {
    const persistedEvents = (this._events[persistenceKey] || []);
    const slice = persistedEvents.slice(offset, limit ? offset + limit : undefined);
    return slice;
  }

  persist (persistedEvent, annotations, metadata) {
    const prev = this._events[persistedEvent.key] || [];

    let nextEvents = [...prev, persistedEvent];
    if (this.validateSeqNumber && prev.reduce((prev, current) => prev && current.sequenceNumber !== persistedEvent.sequenceNumber, true)) {
      return Promise.reject(new Error('Duplicate sequence number'));
    }
    this._events[persistedEvent.key] = nextEvents;

    this._annotations = [...this._annotations, annotations];
    this._metadata = [...this._metadata, metadata];
    return Promise.resolve(persistedEvent);
  }
}

module.exports.MockPersistenceEngineProperties = MockPersistenceEngineProperties;
