import Snoowrap from "snoowrap"
import SuperSnoowrap, { SuperSnoowrapOptions } from "./snoowrapProxy"

class CheatWrap {
  queue: Snoowrap[]

  constructor(creds: SuperSnoowrapOptions[]) {
    this.queue = CheatWrap.init(creds)
    console.log("Initialization completed")
  }

  private static init(creds: SuperSnoowrapOptions[]) {
    return creds.map((cred) => {
      return new SuperSnoowrap(cred)
    })
  }

  static limitMessage =
    "snoowrap refused to continue because reddit's ratelimit was exceeded. For more information about reddit's ratelimit, please consult reddit's API rules at https://github.com/reddit/reddit/wiki/API."

  private getInstance(identifier?: keyof Snoowrap, identifierResult?: any) {
    if (identifier && identifierResult) {
      for (const instance of this.queue) {
        if (instance[identifier] === identifierResult) {
          return instance
        }
      }
    }

    this.queue.sort((a, b) => {
      if (b.ratelimitRemaining === 0 && a.ratelimitRemaining === 0) {
        return 0
      }
      if (b.ratelimitRemaining === 0) {
        return 1
      }
      if (a.ratelimitRemaining === 0) {
        return -1
      }
      return b.ratelimitExpiration - a.ratelimitExpiration
    })
    const result = this.queue[0]

    console.log("Instance chosen from ")
    console.log(this.queue)

    if (!(result.ratelimitRemaining > 0 || result.ratelimitRemaining == null)) {
      throw "All instances all exhausted"
    }
    return result
  }

  async run(
    method: (instance: Snoowrap) => any,
    retries: { current: number; max: number } = { current: 0, max: 1 },
    identifier?: keyof Snoowrap,
    identifierResult?: any
  ) {
    const instance = this.getInstance(identifier, identifierResult)

    if (instance) {
      return CheatWrap.runner(method, retries, instance)
    }
  }

  private static async runner(
    method: (instance: Snoowrap) => any,
    { current, max }: { current: number; max: number },
    instance: Snoowrap
  ): Promise<any> {
    console.log(
      "Running method for the " + current + " of maximum " + max + " allowed"
    )
    let result
    try {
      result = await method(instance)
    } catch ({ message }) {
      if (message === CheatWrap.limitMessage) {
        console.log("Limit Reached - changning accounts")
        return await CheatWrap.runner(
          method(instance),
          {
            current: current,
            max,
          },
          instance
        )
      }
      if (current < max) {
        console.log("error accours, retrying")
        return await CheatWrap.runner(
          method,
          { current: current + 1, max: max },
          instance
        )
      }
      return Error("Taks failed")
    }
    console.log("Method sucessfully completed")
    return result
  }
}

export default CheatWrap
