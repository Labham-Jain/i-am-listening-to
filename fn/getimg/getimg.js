const fs = require("fs").promises;

const handler = async (event) => {
  const svg = await fs.readFile(`/tmp/badge.svg`);
  try {
    return {
      statusCode: 200,
      body: svg.toString(),
      headers: { "content-type": "image/svg+xml" },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
