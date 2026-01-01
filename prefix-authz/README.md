# prefix-authz

This example showcases the usage of token-based authentication and prefix-based
authorization. Clients with a valid (correctly signed) JWT that has the right prefix
set will be able to communicate with the Resonate server and access its promises.

## Prerequisites

- Node.js (v18+)
- [Resonate server](https://docs.resonatehq.io/) installed
- [jwt-cli](https://github.com/mike-engel/jwt-cli) installed

## Setup

Install dependencies:

```bash
npm install
```

Generate a private/public key pair:

```bash
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Generate a token and store it in the `MY_TOKEN` environment variable:

```bash
export MY_TOKEN=$(jwt encode -A RS256 -S @private_key.pem -P prefix='worker-1')
```

The `prefix` is a custom claim supported by the Resonate server. It controls which
promises this token has access to. In this specific case, the holder of this
token can only access promises whose ID starts with the prefix `worker-1`, e.g.,
`worker-1:myPromise`, `worker-1:foo.bar.0`, etc.

This authentication and authorization scheme is useful when you need to limit
which promises a client has access to. It can be used to implement
multi-tenancy or other kinds of isolation.

In `index.ts` we initialize our Resonate instance with a prefix argument:

```typescript
const resonateAuthenticated = new Resonate({
  url: "http://localhost:8001",
  token: process.env.MY_TOKEN,
  prefix: "worker-1",
});
// ... setup code

console.log(await workflow.run("workflow.id", "hello"))
```

All promises created by this Resonate instance will be prefixed by the set
prefix, in this case `worker-1`. The final ID for the promise
will be `worker-1:workflow.id`.

The same can be done in a more manual way, by not setting the prefix argument
when creating the Resonate instance and setting the prefixed promise ID
manually:

```typescript
const resonateAuthenticated = new Resonate({
  url: "http://localhost:8001",
  token: process.env.MY_TOKEN,
});
// ... setup code

console.log(await workflow.run("worker-1:workflow.id", "hello"))
```

## To run

Start a Resonate server with the generated public key:

```bash
resonate dev --api-auth-public-key public_key.pem
```

Run the worker:

```bash
npx tsx index.ts
```

## Advanced features

- A Resonate instance can implicitly take the token and prefix arguments by setting the `RESONATE_TOKEN`
and `RESONATE_PREFIX` environment variables respectively:

```ts
// Assuming process.env.RESONATE_TOKEN and process.env.RESONATE_PREFIX are set
// to a valid JWT and prefix, this is an authenticated and authorized Resonate instance
const resonate = new Resonate({url: "server_url"})
```
