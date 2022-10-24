/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import("next").NextConfig} */
const path = require('path');
const withLess = require('next-with-less');
const withTM = require('next-transpile-modules')(['@douyinfe/semi-next']);
const withSemi = require('@douyinfe/semi-next').default();
const settings = require('./src/settings.json');

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });

    config.resolve.alias['@'] = path.resolve(__dirname, './src');

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: settings.home,
        permanent: false,
      },
    ];
  },
  pageExtensions: ['ts', 'tsx'],
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.experimental = { outputStandalone: true };
}

module.exports = withSemi(withLess(withTM(nextConfig)));
