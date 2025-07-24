import { create } from "zustand";

interface SidebarState {
	isExpanded: boolean;
	isMobileMenuOpen: boolean;
	isManualToggle: boolean;
	toggleSidebar: () => void;
	toggleMobileMenu: () => void;
	setExpanded: (expanded: boolean) => void;
	setManualToggle: (manual: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
	isExpanded: true,
	isMobileMenuOpen: false,
	isManualToggle: false,

	toggleSidebar: () => {
		set({ isExpanded: !get().isExpanded });
	},

	toggleMobileMenu: () => {
		set({ isMobileMenuOpen: !get().isMobileMenuOpen });
	},

	setExpanded: (expanded: boolean) => {
		set({ isExpanded: expanded });
	},

	setManualToggle: (manual: boolean) => {
		set({ isManualToggle: manual });
	},
}));
