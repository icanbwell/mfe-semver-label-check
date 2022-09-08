import * as core from '@actions/core';
import * as github from '@actions/github';

const getClient = () => {
  const token = core.getInput('github-token');
  return github.getOctokit(token);
};

const hasRightLabel = async (): Promise<boolean> => {
  const octokit = getClient();

  core.debug(`PAYLOAD: ${JSON.stringify(github.context.payload)}`);

  const labelsResponse = await octokit.rest.issues.listLabelsOnIssue({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue?.number ?? -1
  });

  const labels = labelsResponse.data
    .filter((label) => /^semver:/.test(label.name))
    .map((label) => label.name);

  if (labels.length === 0 || labels.length > 1) {
    return false;
  }

  const label = labels[0];

  return /(MAJOR|MINOR|PATCH)/.test(label);
};

export async function run() {
  const passes = await hasRightLabel();
  const looksGood = passes ? 'yes' : 'no';

  core.debug(`DID IT PASS? ${looksGood}`);
  core.info(`DID IT PASS? ${looksGood}`);

  if (!passes) {
    core.setFailed('The PR needs to have exactly one semver label.');
  }
}

await run();
