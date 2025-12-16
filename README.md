# example-token-auth-ts
This repository contains a couple of resonate applications that showcase the usage
of resonate's token based authentication and prefix based authorization.

These examples use jwt tokens generated using [jwt cli](https://github.com/mike-engel/jwt-cli)
and self generated private and public key pairs. For production usage we recommend more robust
security providers like [keycloak](https://www.keycloak.org/).

## Basic setup
For all the examples in this repository we will require a similar setup, when necessary the
examples will go through some of these steps again.

Install the resonate server:
```
# macos
brew install resonatehq/tap/resonate
```

Generate RSA key pair:
```
# Generate private key (keep this secret!)
openssl genrsa -out private_key.pem 2048

# Extract public key from private key (will use this one with the resonate server)
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Install jwt-cli:
```
# Follow installation instructions at https://github.com/mike-engel/jwt-cli?tab=readme-ov-file#installation
```

jwt-cli quick usage guide:
```
# Encode/sign JWT (this is all we will need for this example)
jwt encode --secret @private.pem -A RS256 '{"prefix":"myPrefix"}'
```

All examples will start the resonate server the same way
```
resonate serve --api-auth-public-key public_key.pem
```
This command starts the resonate server with jwt based authentication and authorization.
