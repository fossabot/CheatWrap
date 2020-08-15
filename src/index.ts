import Snoowrap, { SnoowrapOptions } from "snoowrap"

class CheatWrap {
  queue: Snoowrap[]

  constructor(creds: SnoowrapOptions[]) {
    this.queue = CheatWrap.getObjects(creds)
  }

  private static getObjects(creds: SnoowrapOptions[]) {
    return creds.map((cred) => {
      return new Snoowrap(cred)
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

    return this.queue[0]
  }

  client(
    method: (instance: Snoowrap) => any,
    identifier?: keyof Snoowrap,
    identifierResult?: any
  ) {
    try {
      return method(this.getInstance(identifier, identifierResult))
    } catch ({ message }) {
      if (message === CheatWrap.limitMessage) {
                return method(this.getInstance(identifier, identifierResult))

      }
    }
  }
}

export default CheatWrap
