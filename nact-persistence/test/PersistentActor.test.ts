import {
  ActorLike,
  ActorRef,
  ActorSystemReference,
  dispatch,
  query,
  start,
  stop,
  SystemRegistry,
} from 'nact-core'

import { configurePersistence } from '../src'
import { spawnPersistent } from '../src'
import { MockPersistenceEngine } from './MockPersistenceEngine'
import { Context } from '../../nact-core/dist/actor/Context'
import { MessageHandlerFunc } from '../../nact-core/src/actor/Actor'

const { applyOrThrowIfStopped } = SystemRegistry

const delay = (duration: number) =>
  new Promise((resolve, reject) => setTimeout(() => resolve(), duration))

const isStopped = (reference: ActorRef) => {
  try {
    return applyOrThrowIfStopped(reference, (actor: ActorLike) => actor).stopped
  } catch (e) {
    return true
  }
}

// Begin helpers
const ignore = () => {
  //
}

const retry = async (
  assertion: () => boolean,
  remainingAttempts: number,
  retryInterval: number = 0,
) => {
  if (remainingAttempts <= 1) {
    return assertion()
  } else {
    try {
      assertion()
    } catch (e) {
      await delay(retryInterval)
      await retry(assertion, remainingAttempts - 1, retryInterval)
    }
  }
}

// function concatenativeFunction<Msg, State = Msg>(
//   initialState: State,
//   additionalActions: (..._: any) => void = ignore,
// ): Promise<MessageHandlerFunc<Msg, State>> {
//   return async (state: State = initialState, msg: Msg, ctx: Context & any) => {
//     if (!ctx.recovering) {
//       dispatch(ctx.sender, (state as any) + (msg as any), ctx.self)
//     }
//     await Promise.resolve(additionalActions(state, msg, ctx))
//     return ((state as any) + (msg as any)) as State
//   }
// }

describe('PersistentActor', () => {
  let system: ActorSystemReference

  afterEach(() => {
    // reset console
    // tslint:disable-next-line:no-console
    delete console.error
    if (system) {
      stop(system)
    }
  })

  // it('should startup normally if no previous events', async () => {
  //   const persistenceEngine = new MockPersistenceEngine()
  //   system = start(configurePersistence(persistenceEngine))
  //   const actor = spawnPersistent(system, concatenativeFunction(''), 'test')
  //   dispatch(actor, 'a')
  //   dispatch(actor, 'b')
  //   expect(await query(actor, 'c', 30)).toEqual('abc')
  // })
})