/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.fallback = {
            "mongodb-client-encryption": false,
            "aws4": false
        };
        return config;
    },
}

module.exports = nextConfig
