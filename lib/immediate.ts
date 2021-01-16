const imm: undefined | ((f: () => void) => number) = undefined;
const clearImm: undefined | ((f: () => void) => void) = undefined;

export function setImmediate(f: () => void): number {
  if (imm) {
    return imm(f);
  }

  if (global && global.setImmediate) {
    imm = global.setImmediate;
  }
  else {
    imm = (ff: () => void) => Promise.resolve().then(() => f());
  }
  return setImmediate(f);

  return -1;
}

export function clearImmediate(f: () => void) {
  if (clearImm) {
    imm(f);
  }

  if (global || setImmediate) {

  }
}