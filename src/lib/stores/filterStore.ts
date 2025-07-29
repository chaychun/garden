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

const updateSearchParams = (searchParams: URLSearchParams) => {
	if (typeof window === "undefined") return;
	window.history.replaceState(
		{},
		"",
		`${window.location.pathname}?${searchParams.toString()}`,
	);
};

const getSearchParam = (key: string) => {
	const searchParams = getSearchParams();
	return searchParams.get(key);
};

const updateSearchParam = (key: string, value: string) => {
	const searchParams = getSearchParams();
	if (value === "All") {
		searchParams.delete(key);
	} else {
		searchParams.set(key, value);
	}
	updateSearchParams(searchParams);
};

const removeSearchParam = (key: string) => {
	const searchParams = getSearchParams();
	searchParams.delete(key);
	updateSearchParams(searchParams);
};

const searchParamsStorage = {
	getItem: (key: string) => getSearchParam(key),
	setItem: (key: string, value: string) => updateSearchParam(key, value),
	removeItem: (key: string) => removeSearchParam(key),
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
			storage: createJSONStorage(() => searchParamsStorage),
			partialize: (state) => ({ activeFilter: state.activeFilter }),
		},
	),
);
