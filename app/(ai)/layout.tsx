import type { PropsWithChildren } from 'react';
import { getPrivateApiUrl } from '@/src/lib/server-env';

export default function AiLayout({ children }: PropsWithChildren) {
	console.log(getPrivateApiUrl(''));
	return children;
}
