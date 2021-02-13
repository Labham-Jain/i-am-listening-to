// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const fs = require("fs").promises;
const handler = async (event) => {
  try {
    const dirs = await fs.readdir("/tmp/");
    console.log(dirs);
    return {
      statusCode: 200,
      body: JSON.stringify(dirs),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
