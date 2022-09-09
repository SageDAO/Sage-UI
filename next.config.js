//The next.config.js file must remain a JS file as it does not get parsed by Babel or TS

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    domains: [
      'dev-sage.s3.us-east-2.amazonaws.com',
      'staging-sage.s3.us-east-2.amazonaws.com',
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });
    return config;
  },
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/marketplace': { page: '/marketplace' },
      '/profile': { page: '/profile' },
    };
  },
  staticPageGenerationTimeout: 180,
	swcMinify: false
};

module.exports = nextConfig;
