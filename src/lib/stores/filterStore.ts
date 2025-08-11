import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FilterType = "All" | "Interactions";

interface FilterState {
	activeFilter: FilterType;
	setActiveFilter: (filter: FilterType) => void;
}

const isHomePage = () => {
	return typeof window !== "undefined" && window.location.pathname === "/";
};

const getSearchParams = () => {
	if (typeof window === "undefined") return new URLSearchParams();
	return new URL(window.location.href).searchParams;
};

const updateUrlWithParams = (key: string, value?: string) => {
	if (typeof window === "undefined") return;
	if (!isHomePage()) return;

	const searchParams = getSearchParams();
	if (value) {
		searchParams.set(key, value);
	} else {
		searchParams.delete(key);
	}

	const newUrl =
		window.location.pathname +
		(searchParams.toString() ? "?" + searchParams.toString() : "");
	window.history.replaceState({}, "", newUrl);
};

const dispatchFilterChangeEvent = (filter: FilterType) => {
	if (typeof window === "undefined") return;

	const urlValue = filter === "All" ? "all" : filter.toLowerCase();
	const event = new CustomEvent("filter-changed", {
		detail: { filter: urlValue },
	});
	document.dispatchEvent(event);
};

const urlStorageApi = {
	getItem: (key: string): string | null => {
		if (!isHomePage()) return null;

		const searchParams = getSearchParams();
		const filterParam = searchParams.get(key);

		if (!filterParam) {
			return null;
		}

		let activeFilter: FilterType;
		if (filterParam === "interactions") {
			activeFilter = "Interactions";
		} else if (filterParam === "all") {
			activeFilter = "All";
		} else {
			console.warn(
				`Invalid filter value "${filterParam}" in URL. Falling back to "All".`,
			);
			activeFilter = "All";

			updateUrlWithParams(key, "all");
		}

		return JSON.stringify({
			state: { activeFilter },
			version: 0,
		});
	},
	setItem: (key: string, value: string): void => {
		if (!isHomePage()) return;
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
			updateUrlWithParams(key, urlValue);
			dispatchFilterChangeEvent(activeFilter);
		} catch (error) {
			console.error("Error parsing stored value:", error);
		}
	},
	removeItem: (key: string): void => {
		if (!isHomePage()) return;
		updateUrlWithParams(key);
	},
};

export const useFilterStore = create<FilterState>()(
	persist(
		(set) => ({
			activeFilter: "All",
			setActiveFilter: (filter: FilterType) => {
				set({ activeFilter: filter });
			},
		}),
		{
			name: "filter",
			storage: createJSONStorage(() => urlStorageApi),
		},
	),
);
