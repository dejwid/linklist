/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com'
      },
      {
        hostname: 'linklist-files.s3.amazonaws.com',
      },
    ],
  }
}

module.exports = nextConfig
