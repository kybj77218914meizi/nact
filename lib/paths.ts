export class ActorPath {
  system?: string;
  parts: string[];
  constructor(parts: string[], system?: any) {
    this.system = system;
    this.parts = parts;
  }

  createChildPath(name: string) {
    if (!ActorPath.isValidName(name)) {
      throw new Error('Invalid argument: path may only contain URI encoded characters, RFC1738 alpha, digit, safe, extra');
    }

    return new ActorPath([...this.parts, name], this.system);
  }

  static isValidName(name: string) {
    const actorNameRegex = /^[a-z0-9-$_.+!*'(),]+$/i;
    return !!name && typeof (name) === 'string' && !!name.match(actorNameRegex);
  }

  static root(system: string) {
    return new ActorPath([], system);
  }

  static nobody() {
    return new ActorPath([], undefined);
  }

  toString() {
    return `${this.system}://${this.parts.join('/')}`;
  }
}
