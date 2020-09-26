## Table of Contents
- [Getting started](#getting-started)
- - [Prerequisites](#prerequisites)
- - [Installing](#installing)
- - [Development](#development)
- - [Testing](#testing)
- [Documentation](#documentation)
- - [Architecture Decision Records](#architecture-decision-records)
- - - [Current ADRs](#current-adrs)
- [Contributing](#contributing)
- [License](#license)

# Getting started

These instructions will get the DTR Manager up and running on your machine for development and testing purposes.

## Prerequisites

What you will need to build, run, and test DTR Manager.

- [ASDF Version Manager](https://github.com/asdf-vm/asdf) to handle system level software requirements
- [Direnv](https://direnv.net/) autoloading of .env
- [Docker](https://docker.com) for pre-setup external dependencies
- [Docker Compose](https://docs.docker.com/compose/install/) easy cli for starting pre-configured docker containers

## Installing

A step by step guide to getting the development environment running

Install system dependencies through ASDF. This will ensure you're running the correct version of the Node runtime.

```
asdf install
```

With Node installed, install software dependencies

```
npm install
```

Prepare your private development configuration

```
cp .env.example .env
```

Allow `direnv` to detect and load your `.env` configuration for the directory

```
direnv allow
```

Start the docker containers using docker-compose

```
docker-compose up
```

(If you choose to run the containers in a daemon)

```
docker-compose up -d
```

## Development

Running the application in development mode

```
npm run dev
```

Automatic formatting for code (where possible) can be done with `fix` which will lint and perform fixes. If a fix cannot be done automatically, the file with linting issue will be listed in the console.

```
npm run fix
```

REPL Driven Development

To provide a playground for testing out code, or ideas, the root directory contains a file called `playground.js` which has some setup in it (logging, iife). The playground will reload the file anytime it's saved through `nodemon`.

```
npm run playground
```

## Testing

Testing the application at various stages can be done through the following commands

When writing tests, the name of the test should contain tags of what the test is. At least one of `#unit` or `#integration` should be set

Run all tests

```
npm run test

 # Run tests on file save

npm run test -- -watch
```

Run all Tests and generate a coverage report

```
npm run test:coverage

 # To run tests and generate coverage report on file save

npm run test:coverage:watch
```

Run all tests tagged with #integration

```
npm run test:integration
```

Run all tests tagged with #unit

```
npm run test:unit
```

Run all tests in a specific file
this provides a fast way to run tests on your current editing file through a tool like `vim-test`, or a hotkey

```
npm run test:file ./path-to-file.test.js
```

# Documentation

Documentation for DTR Manager is automated as much as possible, through various tools and processes. The primary location for documentation is `/docs` and contains directories for templates, proposals, and partial docs that can be built into other documentation - like the main `README.md`

The main repository `/README.md` is generated through a command line operation that assmebles the various components. You should not edit `/README.md` directly.

Updating the main repository README.md should be done in one of the partials found in the `/docs` directory. These are easy to spot with the `readme-` prefix. If there is a need for a new partial, it can be added to the template found in `/docs/templates/README.md`.

If a partial of readme has changed, or you need to regenerate a listing of files, eg: ADRs, use the following command. __This will replace the content of the existing README file__

```
npm run readme
```

The `/scripts` directory contains a `markdown.js` script which will perform operations on text files that use markdown. Current operations are

- Replacing `{{TOC}}` with a table of contents, based on the file's octothorpe headers (#)
- Inlcuding partials for other text files to be included. On its own line, use `/path/to/file.md` to have the script inline the contents.

## Architecture Decision Records

Documentation for choices made when developing DTR Manager are done through ADRs. These are for recording the reason behind a choice for future developers (even you) to understand why something was done the way it is. These are not permanent choices, and a proposal to change a decision can be made the same way.

Code choices, eg: how to add 1 and 1, do not need to be captured in an ADR.

To create a new ADR use the following command (replace `[my-new-adr-name]` with your proposal name - use hyphens to separate words), then edit the new file in your editor.

```
npm run adr [my-new-adr-name]
```

### Current ADRs



# Contributing

Guidelines for contributing, code of context, and process for submitting pull requets to be determined.

# License

This project is licensed under the 3-Clause BSD license. See the [LICENSE.md](LICENSE.md) file for details.

