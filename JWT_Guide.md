# Comprehensive Guide to `step-cli` for JWT and JWK

This document provides a detailed reference for using the `step-cli` command-line tool to manage JSON Web Tokens (JWTs) and JSON Web Keys (JWKs). It is designed for developers who need a quick, reliable way to create, inspect, and verify tokens during development and testing.

---

## Part 1: Managing JSON Web Tokens (JWT)

A JWT is a standard for creating signed tokens that verify the integrity and authenticity of a set of claims. The payload is human-readable (Base64Url encoded) and is not encrypted.

### 1.1 Inspecting a JWT (`step crypto jwt inspect`)

This is the most common command for debugging. It decodes a token's header and payload without verifying its signature, allowing you to quickly see its contents.

**Syntax:**
`step crypto jwt inspect <token>`

**Example:**

```bash
# Provide the token directly as an argument
step crypto jwt inspect eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

# Or, pipe the token into the command (useful for environment variables)
echo $YOUR_JWT_VARIABLE | step crypto jwt inspect
```

### 1.2 Signing a JWT (`step crypto jwt sign`)

This command creates a new, cryptographically signed JWT. You need a private key (either symmetric or asymmetric) to sign the token.

**Syntax:**
`step crypto jwt sign --key <private-key-file> [claims...]`

**Example 1: Basic JWT with Standard Claims**
This creates a token signed with an asymmetric private key (`private.jwk`).

```bash
step crypto jwt sign \
  --key private.jwk \
  --iss "my-development-server" \
  --aud "my-test-api" \
  --sub "user-id-123"
```

- `--iss` (Issuer): Identifies who created the token.
- `--aud` (Audience): Identifies the intended recipient of the token.
- `--sub` (Subject): Identifies the principal that is the subject of the token (e.g., the user).

**Example 2: Adding an Expiration Claim**
This creates a token that expires in 1 hour. The `--exp` flag requires a Unix timestamp.

```bash
# Note: The 'date' command syntax may differ on macOS vs. Linux.
# Linux/WSL syntax:
EXP_TIMESTAMP=$(date -d '+1 hour' +%s)

# macOS syntax:
# EXP_TIMESTAMP=$(date -v+1H +%s)

step crypto jwt sign \
  --key private.jwk \
  --iss "my-app" \
  --sub "user-id-123" \
  --exp $EXP_TIMESTAMP
```

**Example 3: Adding Custom Claims from a JSON File**
For complex payloads, it's easier to use a file.

1. Create a file named `payload.json`:

    ```json
    {
        "scope": "read:data write:data",
        "roles": ["admin", "auditor"],
        "premium_user": true
    }
    ```

2. Pipe the file into the `sign` command:

    ```bash
    cat payload.json | step crypto jwt sign --key private.jwk --iss "my-app" --sub "user-id-123"
    ```

### 1.3 Verifying a JWT (`step crypto jwt verify`)

This command checks a token's integrity by validating its signature. It also validates standard claims like expiration (`exp`), not-before (`nbf`), issuer (`iss`), and audience (`aud`) if you provide them.

**Syntax:**
`step crypto jwt verify --key <public-key-file> [claims-to-verify...] <token>`

**Example 1: Simple Signature Verification**
This verifies that the token was signed by the corresponding private key.

```bash
# Use the public key to verify
step crypto jwt verify --key public.jwk <token-to-verify>
```

**Example 2: Verifying Signature and Claims**
This is the most robust check. The command will fail if the signature is invalid OR if the issuer/audience in the token do not match the values provided. It will also automatically check for expiration.

```bash
step crypto jwt verify \
  --key public.jwk \
  --iss "my-development-server" \
  --aud "my-test-api" \
  <token-to-verify>
```

If verification is successful, the command will exit with a status code of 0 and print the decoded payload. If it fails, it will exit with a non-zero status code and print an error.

---

## Part 2: Managing JSON Web Keys (JWK)

A JWK is a standardized JSON format for representing cryptographic keys. You need to generate keys before you can sign or verify JWTs.

### 2.1 Creating Keys (`step crypto jwk create`)

This command generates cryptographic keys and saves them to files.

**Syntax:**
`step crypto jwk create <public-key-file> <private-key-file>`

**Example 1: Creating an Asymmetric Key Pair (Recommended for JWTs)**
This creates a public/private key pair using the Elliptic Curve (EC) algorithm, which is the default and a strong choice.

```bash
# This will prompt for a password to encrypt the private key
step crypto jwk create public.jwk private.jwk

# For development, you can create a passwordless private key
step crypto jwk create public.jwk private.jwk --no-password --insecure
```

- `public.jwk`: Use this file for `step crypto jwt verify`.
- `private.jwk`: Use this file for `step crypto jwt sign`.

**Example 2: Creating a Symmetric Key (Shared Secret)**
This is used when the same service both issues and validates tokens. It creates a single file containing a shared secret.

```bash
# The '--kty oct' flag specifies a symmetric key type
step crypto jwk create secret.jwk --kty oct --no-password --insecure
```

- `secret.jwk`: Use this single file for both signing and verifying.
