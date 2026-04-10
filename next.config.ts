import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	images: {
		qualities: [50, 60, 70, 80, 90, 100],
		minimumCacheTTL: 0, // TODO: reset
		localPatterns: [
			{
				pathname: '/projects/**',
			},
		],
	},
};

export default nextConfig;
