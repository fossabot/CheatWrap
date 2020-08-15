import Snoowrap, { SnoowrapOptions } from "snoowrap"

class CheatWrap {
  queue: Snoowrap[]

  constructor() {
    this.queue = []
  }

  async init(creds: SnoowrapOptions[]) {
    for (const cred of creds) {
      this.queue.push(await new Snoowrap(cred))
    }
    return this
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

    return this.queue[0]
  }

  async run(
    method: (instance: Snoowrap) => any,
    identifier?: keyof Snoowrap,
    identifierResult?: any
  ) {
    console.log(method(this.getInstance(identifier, identifierResult)))
    try {
      return await method(this.getInstance(identifier, identifierResult))
    } catch ({ message }) {
      if (message === CheatWrap.limitMessage) {
        return await method(this.getInstance(identifier, identifierResult))
      }
    }
  }
}

export default CheatWrap
