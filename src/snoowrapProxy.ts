import Snoowrap, { SnoowrapOptions } from "snoowrap"

interface SuperSnoowrapOptions extends SnoowrapOptions {
  proxy?: string
}

class SuperSnoowrap extends Snoowrap {
  proxy?: string
  constructor(options: SuperSnoowrapOptions) {
    super(options)
    this.proxy = options.proxy
  }
  rawRequest(options: any) {
    if (this.proxy) {
      return super.rawRequest({ ...options, proxy: this.proxy })
    }
    return super.rawRequest(options)
  }
}
export { SuperSnoowrapOptions }
export default SuperSnoowrap
