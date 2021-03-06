const fs = require('fs').promises;
const { Octokit } = require('@octokit/core');

const PayloadToken = process.env.token;
const gtoken = process.env.G_TOKEN;
// github personal access token - https://github.com/settings/tokens/new?scopes=repo

const octokit = new Octokit({ auth: gtoken });

const handler = async (event) => {
  if (event.headers.token !== PayloadToken) {
    return {
      statusCode: 403,
      body: 'Unauthorized',
    };
  }

  try {
    let { song, state } = event.queryStringParameters;
    if (state !== 'playing') {
      song = 'Nothing.';
    }

    const svg = `
    <svg width="402" height="100" viewBox="0 0 402 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="402" height="100" rx="9" fill="url(#paint0_linear_1_12)" />
  <text fill="white" xml:space="normal" style="white-space: normal" font-family="sans-serif" font-size="24"
    font-weight="600" letter-spacing="0em">
    <tspan x="60%" y="50%" text-anchor="middle" dominant-baseline="middle">
      ${song.slice(0, 20)}
    </tspan>
  </text>
  <path
    d="M59.9184 55.7042C60.8217 52.1234 58.1581 48.3639 53.969 47.3071C49.7799 46.2503 45.6517 48.2964 44.7483 51.8771C43.845 55.4579 46.5086 59.2174 50.6977 60.2742C54.8868 61.331 59.015 59.2849 59.9184 55.7042Z"
    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M59.9173 55.704L67.2027 26.7467C65.9947 31.5307 75.724 29.1867 74.572 33.7533" stroke="white"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path
    d="M59.5173 40.904C56.5573 39.141 53.0704 38.4781 49.6699 39.0321C46.2694 39.5861 43.1732 41.3214 40.9258 43.9328C38.6784 46.5442 37.4238 49.8644 37.3827 53.3095C37.3416 56.7545 38.5166 60.1038 40.701 62.7681C42.8854 65.4324 45.9393 67.2411 49.3256 67.8761C52.7119 68.5111 56.2136 67.9317 59.2149 66.2398C62.2162 64.5479 64.5248 61.8519 65.7346 58.626C66.9444 55.4001 66.9779 51.8509 65.8293 48.6027"
    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path
    d="M61.276 33.9133C56.4204 31.6094 50.8822 31.1904 45.7353 32.7376C40.5883 34.2848 36.1991 37.688 33.4186 42.2873C30.6382 46.8867 29.6645 52.3547 30.6864 57.6311C31.7083 62.9076 34.6529 67.6167 38.9494 70.8455C43.246 74.0743 48.5883 75.5928 53.9408 75.1065C59.2932 74.6203 64.2745 72.1641 67.9189 68.2139C71.5633 64.2638 73.6112 59.1012 73.6656 53.727C73.72 48.3527 71.777 43.1498 68.2133 39.1267"
    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M52 24.8333C44.3971 24.8333 37.1056 27.8536 31.7296 33.2296C26.3536 38.6056 23.3333 45.8971 23.3333 53.5"
    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <defs>
    <linearGradient id="paint0_linear_1_12" x1="-8.81957e-06" y1="10" x2="421" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#11C4EC" />
      <stop offset="1" stop-color="#00CABE" />
    </linearGradient>
  </defs>
</svg>`;

    const buff = Buffer.from(svg, 'utf-8');

    const fileInfo = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'Labham-Jain',
        repo: 'i-am-listening-to',
        path: 'music-badge.svg',
      }
    );

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'Labham-Jain',
      repo: 'i-am-listening-to',
      path: 'music-badge.svg',
      message: `Updated to ${song}`,
      sha: fileInfo.data.sha,
      content: buff.toString('base64'),
    });

    return {
      statusCode: 200,
      body: JSON.stringify('Updated'),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
