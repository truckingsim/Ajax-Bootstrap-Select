# Contribution guide

## Prerequisites 

- [Node.JS]
- [Grunt.js] (install the global CLI tool)

## Setup

Install the [Node.js] modules by running `npm install` inside this cloned
repository. Note: this may take a while depending on your computer.

## Grunt commands

- `grunt` - Main grunt command will build the entire project.
- `grunt docs` - Builds just the documentation.

## Distribution

After everything is built, there will be a `dist` folder where the distribution
files (CSS and JS) will be located. These files are what can be used in the
browser.

## Committing Changes

All commits must follow the [AngularJS Git Commit Message Conventions].

While one can manually construct a proper commit message based on aforementioned
conventions, this project utilizes [Commitizen CLI] to commit changes in a
consistent manner and help eliminate human error.

The preferred method is to use the helper script bundled with this project which
runs the internal dependency script installed via [Node.js]. This is preferred
because it is specific to this project and will have the most consistency for
all individuals involved:
```bash
npm run commit
```

Optionally, if you instead have the [Commitizen CLI] installed globally, you
should also be able to execute the following command from the root of the
project:

```bash
git cz
```

To assist with all of these variations across projects, it is recommended that
you can create a single and dedicated `commit` command alias in your
`.bash_profile` file. This will run all of these commands for you and fall back
as necessary:

```bash
alias commit='npm run commit 2>/dev/null || git cz 2>/dev/null || git commit';
```

## Pull Request Requirements

The following are required for a pull request to be considered "valid":

* JavaScript **MUST** use 4 space indentation.
* JavaScript **MUST** be written using ES2015 (ES6) features.
* Features and bug fixes **MUST** covered by test cases.
* All commits **MUST** follow the [AngularJS Git Commit Message Conventions].


[Node.js]: https://nodejs.org
[Grunt.js]: https://gruntjs.com/getting-started#installing-the-cli
[AngularJS Git Commit Message Conventions]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[Commitizen CLI]: http://commitizen.github.io/cz-cli/
