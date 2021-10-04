module.exports = {
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  webpack: function (config, options) {
    config.experiments = {};
    return config;
  },
  env: {
		GRAPH_CMS_TOKEN: process.env.GRAPH_CMS_TOKEN,
    ENDPOINT: process.env.ENDPOINT,
	},
}
