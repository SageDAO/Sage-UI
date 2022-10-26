//The next.config.js file must remain a JS file as it does not get parsed by Babel or TS

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'page.ts', 'api.ts'],
  images: {
    domains: [
      'dev-sage.s3.us-east-2.amazonaws.com',
      'staging-sage.s3.us-east-2.amazonaws.com',
      'sage-art.s3.us-east-2.amazonaws.com',
      'd2k3k1d7773avn.cloudfront.net'
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
  swcMinify: false,
};

module.exports = nextConfig;
