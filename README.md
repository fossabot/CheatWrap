
# CheatWrap
[![DeepScan grade](https://deepscan.io/api/teams/10611/projects/13455/branches/226686/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10611&pid=13455&bid=226686)

Wrapper around [snoowrap](https://github.com/not-an-aardvark/snoowrap) allowing the use of multiple API keys to bypass the limitation of a single key
## Installation

```bash
npm i cheatwrap
```

## Example 
```typescript
import CheatWrap from "./index"
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
```
