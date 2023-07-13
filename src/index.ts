import * as core from '@actions/core'
import * as github from '@actions/github'

const _ = async function () {
  const minApprovalsNeeded = parseInt(core.getInput('MIN_APPROVALS_NEEDED'))
  const owner = github.context.payload.repository?.owner.login
  const repository = github.context.payload.repository?.name
  const prNumber = github.context.payload.pull_request?.number
  const token = process.env['GITHUB_TOKEN']

  core.info(`Minimum approvals needed: ${minApprovalsNeeded}`)
  core.info(`Owner: ${owner}`)
  core.info(`Repository: ${repository}`)
  core.info(`Pull Request number: ${prNumber}`)

  if (!token || !owner || !repository || !prNumber)
    return false

  const octokit = github.getOctokit(token)

  let page = 1
  const perPage = 100
  const usersApproved: (string | undefined)[] = []

  while (usersApproved.length < minApprovalsNeeded) {
    const res = await octokit.rest.pulls.listReviews({ owner, pull_number: prNumber, repo: repository, page, per_page: perPage })

    if (res.status !== 200)
      continue

    for (const event of res.data) {
      if (event.state !== 'APPROVED')
        continue

      const username = event.user?.login

      if (username && !usersApproved.includes(username)) {
        usersApproved.push(username)
      }
    }

    if (res.data.length < perPage || usersApproved.length >= minApprovalsNeeded)
      break

    page++
  }

  const approved = usersApproved.length >= minApprovalsNeeded

  core.info(`Users approved: ${usersApproved}`)
  core.info(`Minimum approvals achieved: ${approved}`)

  core.setOutput('APPROVED', approved)
}()
