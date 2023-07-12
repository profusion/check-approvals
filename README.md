# check-approvals
Checks whether a pull request has a minimum amount of approvals.

## Inputs
### `MIN_APPROVALS_NEEDED`
Required minimum amount of approvals needed.

## Outputs
### `APPROVED`
Whether the pull request has the minimum amount of approvals. Example: `true` or `false`.


## Env
### `GITHUB_TOKEN`
Required github token to read the repository pull request.

## Usage example
```yaml
name: Check approvals example

on:
  pull_request:

jobs:
  check-commits-authors:
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    outputs:
      APPROVED: ${{ steps.my-step.outputs.APPROVED }}
    steps:
      - uses: profusion/check-approvals@main
        id: my-step
        if: ${{ github.event_name == 'pull_request_review' }}
        with:
          MIN_APPROVALS_NEEDED: ${{ vars.MIN_APPROVALS_NEEDED }}
```

## [Development]
After you make changes on the Typescript codebase, you have to run `yarn build` to update `dist/bundle.js`.

