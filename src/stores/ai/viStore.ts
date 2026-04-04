import { create } from 'zustand';
import type { ViStore } from '@/src/stores/ai/_types';

export const useAIStore = create<ViStore>((set, get) => ({
	connected: false,
	connecting: false,
	talk: false,
	actions: {
		setTalk: (state: boolean) => {
			set({ talk: state ?? !get().talk });
		},
		connect: (talk?: boolean) => {
			// if already connected or connecting return
			if (get().connected || get().connecting) return;

			// set connecting true, disconnecting false, and talk based on param
			set({ connecting: true, talk: talk ?? get().talk });

			// simulate connecting to vi
			setTimeout(() => {
				set({ connected: true, connecting: false });
			}, 3000);
		},
		disconnect: () => {
			// if already disconnecting or not connected return
			if (!get().connected) return;

			// set connecting true, disconnecting false, and talk based on param
			set({ connected: false, connecting: false });
		},
	},
}));

export const useViTalk = () => useAIStore((state) => state.talk);
export const useViConnected = () => useAIStore((state) => state.connected);
export const useViConnecting = () => useAIStore((state) => state.connecting);
export const useViActions = () => useAIStore((state) => state.actions);
