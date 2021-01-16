import { ActorPath } from './paths';

export class Nobody {
  system: { name: undefined; };
  path: ActorPath;
  type: string;
  constructor() {
    this.system = { name: undefined };
    this.path = ActorPath.nobody();
    this.type = 'nobody';
  }
}

export class TemporaryReference {
  system: { name: string; };
  id: number;
  type: 'temp';
  constructor(systemName: string) {
    this.system = { name: systemName };
    this.id = (Math.random() * Number.MAX_SAFE_INTEGER) | 0;
    this.type = 'temp';
  }
}

export class ActorReference {
  id(id: any) {
    throw new Error('Method not implemented.');
  }
  path: ActorPath;
  name: string;
  parent: ActorReference | ActorSystemReference;
  system: { name: string; };
  type: 'actor';
  constructor(systemName: string, parent: ActorReference | ActorSystemReference, path: ActorPath, name: string) {
    this.path = path;
    this.name = name;
    this.parent = parent;
    this.system = { name: systemName };
    this.type = 'actor';
  }
}

export class ActorSystemReference {
  path: ActorPath;
  system: { name: string; };
  name: string;
  type: 'system';
  constructor(systemName: string, path: ActorPath) {
    this.path = path;
    this.system = { name: systemName };
    this.name = systemName;
    this.type = 'system';
  }
}

