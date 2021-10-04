module.exports = {
  reactStrictMode: true,
  future: { webpack5: true },
  env: {
		GRAPH_CMS_TOKEN: process.env.GRAPH_CMS_TOKEN,
    ENDPOINT: process.env.ENDPOINT,
	},
}
