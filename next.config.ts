import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: false,
	images: {
		qualities: [50, 60, 70, 80, 90, 100],
		minimumCacheTTL: 0,
		localPatterns: [
			{
				pathname: '/projects/**',
			},
		],
	},
};

export default nextConfig;
