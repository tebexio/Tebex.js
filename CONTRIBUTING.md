[wiki]: https://docs.tebex.io/creators/

# Contributing Guidelines

We welcome everyone to contribute towards the Tebex Project, but doing so will require you to follow specific rules to
keep a consistent and welcoming way of contributing.

For Customer support Please contact our support team at [support@tebex.io](mailto:support@tebex.io)


## Getting Started

```shell
# Clone the repo
git clone git@github.com:MY_FORK/Tebex.js.git

# Move into the directory
cd Tebex.js

# Add the upstream repo
git remote add upstream git@github.com:tebexio/Tebex.js.git

# Get the latest upstream changes
git pull upstream

# Install dependencies
npm install
```

## Making Changes
1. Ensure that your changes adhere to the current coding conventions used in this project, this means using indentation, accurate comments etc.
2. Ensure existing and new tests pass using `npm test`

## Submitting Changes
1. Commit your changes in logical chunks, i.e. keep your changes small per single commit.
2. Locally merge (or rebase) the upstream branch into your branch: `git pull upstream && git merge`.
3. Push your topic branch up to your fork: `git push origin <branch-name>`.
4. Open a [Pull Request](https://help.github.com/articles/using-pull-requests) with a clear title and description.

## Pull requests
As an open source project are we welcome contributions to help improve Tebex. When contributing towards the code of Tebex, be it new features or just bug fixes.