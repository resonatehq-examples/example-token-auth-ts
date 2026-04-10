# token-auth

This example showcases the usage of token-based authentication. Only clients
with a valid (correctly signed) JWT will be able to communicate with the
Resonate server.

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
export MY_TOKEN=$(jwt encode -A RS256 -S @private_key.pem --exp=1h '{"prefix":""}')
```

The `prefix` is a custom claim supported by the Resonate server. It controls which
promises this token has access to. An empty prefix grants access to all
promises. Clients or workers without a token will not have access to
any promise. This authentication and authorization scheme is useful when you need
to limit server access to trusted clients, but each client requires full access
to all promises.

## To run

Start a Resonate server with the generated public key:

```bash
resonate dev --auth-publickey public_key.pem
```

Run the worker:

```bash
npx tsx index.ts
```

If a Resonate instance without a token or with an invalid token is used, the worker will
crash with a `ResonateError: The request is unauthorized`. To try this behavior, modify
the code to use a different token, signed with a different private key, or leave out the
`token` field.

## Advanced features

- A Resonate instance can implicitly take the token argument by setting the `RESONATE_TOKEN`
environment variable:

```ts
// Assuming process.env.RESONATE_TOKEN is set to a valid JWT,
// this is an authenticated Resonate instance
const resonate = new Resonate({url: "server_url"})
```

- The Resonate server requires a custom `prefix` JWT claim. This claim is used to
control access to promises. A prefix set to `""` (empty string) will grant access to
every promise. The absence of the prefix claim will make the JWT invalid and deny
access to the server. The prefix feature is explained in detail in the [prefix-authz](../prefix-authz) example.
