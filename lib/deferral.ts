export class Deferral {
  promise: Promise<unknown>;
  reject!: (reason?: any) => void;
  resolve!: (value?: unknown) => void;
  done: boolean;
  constructor() {
    this.done = false;
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });

    this.promise.then(() => { this.done = true; }).catch(() => { this.done = true; });
  }
}

