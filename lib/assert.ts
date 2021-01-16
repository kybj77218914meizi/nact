export class AssertionFailureError extends Error {
  constructor() {
    super("Assertion failed");
  }
}
export default function assert(statement: boolean) {
  if (!statement) {
    throw new AssertionFailureError();
  }
}