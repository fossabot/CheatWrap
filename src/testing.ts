import CheatWrap from "./index"
import Snoowrap from "snoowrap"

const credentials = [
  {
    userAgent: "graph-from-reddit",
    clientId: "haQBYOivbuScYA",
    clientSecret: "uSr9E7ENAqaH6n39_s7xfcrYxN0",
    username: "Purple-Remove-3671",
    password: "Frytki00",
  },
]

const getPuppers = async () => {
  const r = await new Snoowrap(credentials[0])
  console.log(await r.getSubreddit("aww").getHot())
}

getPuppers()
