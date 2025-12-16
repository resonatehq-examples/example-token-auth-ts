import {Resonate, type Context} from '@resonatehq/sdk'

function* helloAuth(ctx: Context, greeting: string) {
  const result = yield* ctx.run((ctx: Context) => `${greeting} world!`)
  return result
}

// A resonate instances that connects to a server deployed locally.
// Assumes the generated JWT is stored in the env variable MY_TOKEN
const resonateAuthenticated = new Resonate({url: "http://localhost:8001", token: process.env.MY_TOKEN})


const workflow = resonateAuthenticated.register("workflow", helloAuth)
console.log(await workflow.run("workflow.id", "hello"))
console.log(await workflow.rpc("workflow.rpc.id", "hello rpc"))
resonateAuthenticated.stop()


// Trying to run this example without setting a correct token will crash the node with a 'ResonateError: The request is unauthorized'
// const resonateNoAuth = new Resonate({url: "http://localhost:8001"})

// const workflow = resonateNoAuth.register("workflow", helloAuth)
// await workflow.run("workflow.id", "hello")
// resonateNoAuth.stop()


