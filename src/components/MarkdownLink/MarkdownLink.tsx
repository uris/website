'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useAILayout } from '@/app/(ai)/store/layout-store';
import { EAction } from '@/utils/consts/consts';

interface MarkdownLinkProps {
	options: {
		href?: string;
		children?: ReactNode;
	};
}

// get actions from query string if there are any
function parseActionLink(href?: string) {
	if (!href) return null;

	try {
		const url = new URL(href, 'http://localhost');
		if (url.pathname !== '/action') return null;

		return {
			actionType: url.searchParams.get('actionType'),
			actionValue: url.searchParams.get('actionValue'),
			actionFocus: url.searchParams.get('actionFocus'),
		};
	} catch {
		return null;
	}
}

export function MarkdownLink(props: Readonly<MarkdownLinkProps>) {
	const { options } = props;
	const { href, children } = options;

	// setup for actions
	const toggleSidebar = useAILayout().toggleSideBar;
	const action = parseActionLink(href);
	const isAction = Boolean(action?.actionType);

	// link handler for known actions
	const handleLink: ComponentPropsWithoutRef<'a'>['onClick'] = (e) => {
		if (!action) return;

		e.preventDefault();
		switch (action.actionType) {
			case EAction.Contact:
			case EAction.ToggleSidebar: {
				const toggleValue = action.actionValue === 'true';
				toggleSidebar(toggleValue);
				return;
			}
			default:
				return;
		}
	};

	// return early if there is no href (handle optimistic href parsing)
	if (!href) return <a href="/#">{children}</a>;

	// handle action links first
	if (isAction) {
		return (
			<a href={href} onClick={handleLink}>
				{children}
			</a>
		);
	}

	// flag internal links
	const isInternal = href.startsWith('/');

	// return the internal link using next link
	if (isInternal) {
		return <Link href={href}>{children}</Link>;
	}

	// return the regular link
	return (
		<a href={href} target="_blank" rel="noreferrer">
			{children}
		</a>
	);
}
