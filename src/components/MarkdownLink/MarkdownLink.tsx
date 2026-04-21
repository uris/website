'use client';

import { useLocalStore } from '@apple-pie/slice';
import { useModalActions, useToastActions } from '@apple-pie/slice/stores';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ViTalkModal } from '@/src/components/ViTalkModal/ViTalkModal';
import { viConnectionNotification } from '@/src/content/notifications/notifications';
import { useViActions, useViConnected, useViConnecting } from '@/src/stores/ai/viStore';
import { useHomeLayout } from '@/stores/home-layout/homeLayoutStore';
import { SidebarSurface } from '@/stores/sidebar/_types';
import { useSidebarActions } from '@/stores/sidebar/sidebarStore';
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
			actionFocus: Number.parseInt(url.searchParams.get('actionFocus') ?? '0', 10),
		};
	} catch {
		return null;
	}
}

export function MarkdownLink(props: Readonly<MarkdownLinkProps>) {
	const { options } = props;
	const { href, children } = options;

	// setup for actions
	const [viTalkConfirm, setViTalkConfirm] = useLocalStore<boolean>('viTalkConfirm', false);
	const toggleSidebar = useHomeLayout().toggleSideBar;
	const connectToVi = useViActions().connect;
	const notify = useToastActions().push;
	const connectedToVi = useViConnected();
	const connectingToVi = useViConnecting();
	const modalResponse = useModalActions().modalResponse;
	const setSurface = useSidebarActions().setSurface;
	const setProject = useSidebarActions().setProject;
	const showProject = useSidebarActions().setShowProject;

	const action = parseActionLink(href);
	const isAction = Boolean(action?.actionType);

	// trigger initial vi talk modal to confirm continue
	const confirmViTalk = async () => {
		if (viTalkConfirm) return true;
		return await modalResponse<boolean>({
			id: 'vi-intro',
			component: ViTalkModal,
			props: { connect: true },
		}).catch(() => false);
	};

	// link handler for known actions
	const handleLink: ComponentPropsWithoutRef<'a'>['onClick'] = async (e) => {
		if (!action) return;

		e.preventDefault();
		switch (action.actionType) {
			case EAction.Sidebar: {
				// set show/hide sidebar
				const toggleValue = action.actionValue === 'true';
				toggleSidebar(toggleValue);
				// list projects - if active project hide it to show grid
				if (action.actionFocus === SidebarSurface.Projects) {
					setProject(null);
					showProject(false);
				}
				// show the surface
				setSurface(action.actionFocus);
				return;
			}
			case EAction.TalkToVi: {
				const confirmation = await confirmViTalk();
				setViTalkConfirm(!!confirmation);
				if (confirmation && !connectedToVi && !connectingToVi) {
					await connectToVi(true);
				} else if ((confirmation && connectedToVi) || connectingToVi) {
					notify(viConnectionNotification('Already'));
				}
				break;
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
