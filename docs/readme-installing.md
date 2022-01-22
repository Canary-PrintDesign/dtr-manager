A step by step guide to getting the development environment running

Install system dependencies through ASDF. This will ensure you're running the correct version of the Node runtime.

```
asdf install
```

With Node installed, install software dependencies

```
npm install
```

Prepare your private development configuration, add the following
fields to a .env file in the root of the project. This file will not
be version controlled. Additional configuration can be found in /env.js

```
DB_PORT=5432
DB_NAME=myapp
DB_PASSWORD=supersecret
DB_USER=myuser
```

Generate a secret key that will be used to secure sessions.

```
npx fastify-secure-session > secret-key
```

Start the docker containers using docker-compose

```
docker-compose up
```

(If you choose to run the containers in a daemon)

```
docker-compose up -d
```
