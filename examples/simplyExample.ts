import CheatWrap from "../src/index"
import Snoowrap from "snoowrap"

const credentials = [
  {
    userAgent: "graph-from-reddit",
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
]

const getSweetCreatures = async (r: Snoowrap) => {
  return await (await r.getSubreddit("aww").getHot()).fetchAll()
}

const main = async () => {
  const r = new CheatWrap(credentials)
  await r.run(getSweetCreatures)
}

main()
