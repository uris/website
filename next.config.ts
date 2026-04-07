import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		qualities: [50, 60, 70, 80, 90, 100],
	},
};

export default nextConfig;
