const axios = require('axios');

async function openRevertedIssue(pullRequestTitle, pullRequestBody, repository) {
  const regex = /^[Rr]e-?[Oo]pens? +#(\d+) *$/;
  const match = regex.exec(pullRequestBody);

  if (match) {
    const issueNumber = match[1];

    try {
      const response = await axios.get(`https://api.github.com/repos/${repository}/issues/${issueNumber}`);
      const issue = response.data;

      if (issue.state === 'closed') {
        await axios.patch(`https://api.github.com/repos/${repository}/issues/${issueNumber}`, { state: 'open' });
        console.log(`Reopened issue #${issueNumber}`);
      } else {
        console.log(`Issue #${issueNumber} is already open.`);
      }
    } catch (error) {
      console.error(`Error opening issue #${issueNumber}:`, error);
    }
  }
}

// Replace with your GitHub token
const githubToken = process.env.GITHUB_TOKEN;

// Get the pull request title and body from the environment variables
const pullRequestTitle = process.env.PULL_REQUEST_TITLE;
const pullRequestBody = process.env.PULL_REQUEST_BODY;
const repository = process.env.GITHUB_REPOSITORY;

openRevertedIssue(pullRequestTitle, pullRequestBody, repository)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
