import { navigate } from "astro:transitions/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FilterType = "All" | "Interactions" | "Articles";

const numberOfItems = {
	All: 35,
	Interactions: 24,
	Articles: 11,
};

interface FilterState {
	activeFilter: FilterType;
	setActiveFilter: (filter: FilterType) => void;
	getFilterCount: (filter: FilterType) => number;
}

const getSearchParams = () => {
	if (typeof window === "undefined") return new URLSearchParams();
	return new URL(window.location.href).searchParams;
};

const navigateWithUpdatedParams = (key: string, value?: string) => {
	const searchParams = getSearchParams();
	if (value) {
		searchParams.set(key, value);
	} else {
		searchParams.delete(key);
	}
	navigate(window.location.pathname + "?" + searchParams.toString(), {
		history: "replace",
	});
};

const urlStorageApi = {
	getItem: (key: string): string | null => {
		const searchParams = getSearchParams();
		const filterParam = searchParams.get(key);

		if (!filterParam) {
			return null;
		}

		let activeFilter: FilterType;
		if (filterParam === "interactions") {
			activeFilter = "Interactions";
		} else if (filterParam === "articles") {
			activeFilter = "Articles";
		} else if (filterParam === "all") {
			activeFilter = "All";
		} else {
			console.warn(
				`Invalid filter value "${filterParam}" in URL. Falling back to "All".`,
			);
			activeFilter = "All";

			navigateWithUpdatedParams(key, "all");
		}

		return JSON.stringify({
			state: { activeFilter },
			version: 0,
		});
	},
	setItem: (key: string, value: string): void => {
		try {
			const data = JSON.parse(value);
			const activeFilter = data.state?.activeFilter as FilterType | undefined;

			if (!activeFilter || typeof activeFilter !== "string") {
				console.warn(
					`Invalid activeFilter value: ${activeFilter}. Expected a string.`,
				);
				return;
			}

			const urlValue = activeFilter.toLowerCase();
			navigateWithUpdatedParams(key, urlValue);
		} catch (error) {
			console.error("Error parsing stored value:", error);
		}
	},
	removeItem: (key: string): void => {
		navigateWithUpdatedParams(key);
	},
};

export const useFilterStore = create<FilterState>()(
	persist(
		(set) => ({
			activeFilter: "All",
			setActiveFilter: (filter: FilterType) => {
				set({ activeFilter: filter });
			},
			getFilterCount: (filter: FilterType) => numberOfItems[filter],
		}),
		{
			name: "filter",
			storage: createJSONStorage(() => urlStorageApi),
		},
	),
);
