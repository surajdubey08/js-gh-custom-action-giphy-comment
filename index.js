const {Octokit} = require('@octokit/rest');
const Giphy = require('giphy-api');
const core = require('@actions/core');
const github = require('@actions/github');

async function run () {
  try {
    const gitHubToken = core.getInput('github-token');
    const giphyApiKey = core.getInput('giphy-api-key');

    const octokit = new Octokit( { auth: gitHubToken } );
    const giphy = Giphy(giphyApiKey);

    const context = github.context;
    const { owner, repo, number } = context.issue;
    const prComment = await giphy.random('thank you');

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: `### PR - ${number} \n ### :octocat: ⚡ Thank You for your contribution! \n ![Giphy](${prComment.data.images.downsized.url})`
    });

    core.setOutput('comment-url', `${prComment.data.images.downsized.url}`);
    console.log(`Giphy GIF comment added Successfully! Comment URL: ${prComment.data.images.downsized.url}`);
  } catch (error) {
    console.log('Error:', error);
    process.exit(1);
  }
}

run();
