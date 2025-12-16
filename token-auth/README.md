# token-auth

This example showcases the usage of token base authentication. Only clients
with a valid (correctly signed) jwt will be able to communicate with the
resonate server.

To install dependencies:

```bash
bun install
```


We will need a private/public key pair
```bash
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Generate a token and store it in MY_TOKEN env variable:
```bash
export MY_TOKEN=$(jwt encode -A RS256 -S @private_key.pem -P prefix='')
```

'prefix' is a custom claim supported by the resonate server. It controls the
promises this token have access to. An empty prefix will provided acess to all
the promises. Clients or Workers that do no have a token will not have access to
any promise. This Authentication and Authorization schema is usefull when it is
necessary to limit access of the server only to trusted clients, but each of
these client requires full access to all promises.

### To run:

Start a resonate server with the generated public key:
```bash
resonate serve --api-auth-public-key public_key.pem
```

Run the worker:
```bash
bun run index.ts
```

If a resonate instance without a token or an invalid token is used, the worker will
crash with a 'ResonateError: The request is unauthorized'. To try this behavior, modify
the code to use a different token, signed with a different private key, or leave out the
`token` field.

### Advance features
- A resonate instance can implicitly take the token argument by setting the `RESONATE_TOKEN`
env variable
```ts
// Assuming process.env.RESONATE_TOKEN is set to a valid JWT
// this an authenticated resonate instance
const resonate = new Resonate({url: "server_url"})
```
- The resonate server requires a custom 'prefix' JWT claim. This claim is used to
control acess to promises. A prefix set to "" (empty string) will grant access to
every promise, the absense of the prefix claim will make the JWT invalid and deny
access to the server. The prefix feature is explain in detail at [prefix authorization](../prefix-auz)


