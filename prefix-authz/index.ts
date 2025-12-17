import {Resonate, type Context} from '@resonatehq/sdk'

function* helloAuth(ctx: Context, greeting: string) {
  const result = yield* ctx.run((ctx: Context) => `${greeting} world!`)
  return result
}

// A Resonate instance that connects to a server deployed at localhost:8001,
// Assumes the generated JWT is stored in the env variable MY_TOKEN
// and the token has a custom claim {"prefix": "worker-1"}
const resonateAuthenticated = new Resonate({url: "http://localhost:8001", token: process.env.MY_TOKEN, prefix: "worker-1"})


const workflow = resonateAuthenticated.register("workflow", helloAuth)
console.log(await workflow.run("workflow.id", "hello"))
console.log(await workflow.rpc("workflow.rpc.id", "hello rpc"))
resonateAuthenticated.stop()


// Trying to run this example without setting a token with the correct prefix
// will crash the node with a 'ResonateError: The request is forbidden'
// const resonateNoAuth = new Resonate({url: "http://localhost:8001", token: process.env.MY_TOKEN, prefix: "not-worker"})

// const workflow = resonateNoAuth.register("workflow", helloAuth)
// await workflow.run("workflow.id", "hello")
// resonateNoAuth.stop()


