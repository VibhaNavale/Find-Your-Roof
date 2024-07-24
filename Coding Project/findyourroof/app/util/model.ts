export interface House {
    address: string;
    createdAt: string;
    id: string;
    lat: number;
    lon: number;
    listedDate: string;
    listingType: string;
    price: number;
    propertyType: string;
    status: string;
    photoLink: string;
    purchaseLink: string;
}

export interface Shelter {
    address: string;
    lat: number;
    lon: number;
    email: string;
    desc: string;
    zipCode: number;
    name: string;
    purchaseLink: string;
    photoLink: string;
}

export type DisplayHousesOrShelters = 'Houses' | 'Shelters';

export const HousingChangeEvent = 'housing-change-event';

export interface HouseMarker extends House {
    marker: any;
    address: string;
    createdAt: string;
    id: string;
    lat: number;
    lon: number;
    listedDate: string;
    listingType: string;
    price: number;
    propertyType: string;
    status: string;
    photoLink: string;
    purchaseLink: string;
}

export const HousingDataLS = 'housing-data';
export const SearchResultsLS = 'search-results';
export const MarkerClicked = 'marker-clicked';
export const SelectedHouse = 'selected-house';
export const HouseFilters = 'house-filters';
export const JobFilters = 'job-filters';
export const JobDataLS = 'job-data';
export const HomelessShelterLS = 'homeless-shelter-ls';

export const getSelectedHouse = (): House => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage?.getItem(SelectedHouse)!);
    }

    // @ts-ignore
    return {};
};

export enum SearchDataType {
    HousingDataLS,
    JobDataLS,
    HomelessShelterLS,
}

export interface SearchParameters {
    searchQuery: string;
    filtersName: string;
    SearchData: SearchDataType;
}

export const constructSearchParameters = (
    searchQuery: string,
    filtersName: string,
    searchData: SearchDataType
): SearchParameters => {
    return {
        searchQuery: searchQuery,
        filtersName: filtersName,
        SearchData: searchData,
    };
};

const applyFilters = (
    searchDataType: SearchDataType,
    result: any,
    filters: any
): boolean => {
    if (searchDataType === SearchDataType.HousingDataLS) {
        if (
            ((result.price > filters.min && result.price < filters.max) ||
                filters.min === '' ||
                filters.max === '') &&
            (filters.rentalOrBuy.toLowerCase() === 'both' ||
                (filters.rentalOrBuy.toLowerCase() === 'rent' &&
                    result.listingType === 'rent') ||
                (filters.rentalOrBuy.toLowerCase() === 'sale' &&
                    result.listingType === 'sale'))
        ) {
            return true;
        }
    } else if (searchDataType === SearchDataType.JobDataLS) {
        if (
            filters.employmentType.split(' ').join('').toLowerCase() ===
                result.employmentType.toLowerCase() ||
            filters.employmentType.toLowerCase() === 'all'
        ) {
            return true;
        }
    } else if (searchDataType === SearchDataType.HomelessShelterLS) {
        return true;
    }

    return false;
};

const getHomelessShelterData = (): Shelter[] => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage?.getItem(HomelessShelterLS)!);
    }

    return [];
};

const getAllResults = (searchParameters: SearchParameters): any[] => {
    if (searchParameters.SearchData === SearchDataType.HousingDataLS) {
        return getHousingData();
    } else if (
        searchParameters.SearchData === SearchDataType.HomelessShelterLS
    ) {
        return getHomelessShelterData();
    } else if (searchParameters.SearchData === SearchDataType.JobDataLS) {
        return getJobData();
    }
    return [];
};

const getSearchDataType = (searchDataType: SearchDataType): string => {
    if (searchDataType === SearchDataType.HomelessShelterLS) {
        return 'name';
    } else if (searchDataType === SearchDataType.HousingDataLS) {
        return 'address';
    } else if (searchDataType === SearchDataType.JobDataLS) {
        return 'jobTitle';
    }

    return '';
};

export const filterSearchResultsOnQuery = (
    searchParameters: SearchParameters
): any[] => {
    let allResults = getAllResults(searchParameters);

    let filters = JSON.parse(
        localStorage?.getItem(searchParameters.filtersName)!
    );

    allResults = allResults.filter((result: any) => {
        const searchProperty = getSearchDataType(searchParameters.SearchData);

        let wordExists = false;

        if (
            result[searchProperty]
                .toLowerCase()
                .includes(searchParameters.searchQuery.toLowerCase())
        ) {
            wordExists = true;
        }

        const applicable = applyFilters(
            searchParameters.SearchData,
            result,
            filters
        );

        if (applicable && wordExists) {
            return true;
        }

        return false;
    });

    // if there are no results, we have to filter just merely by the filters
    if (allResults.length === 0 && searchParameters.searchQuery === '') {
        allResults = getAllResults(searchParameters);

        allResults = allResults.filter((result: any) =>
            applyFilters(searchParameters.SearchData, result, filters)
        );
    }

    return allResults;
};

export const getSearchedHouses = (): House[] => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage?.getItem(SearchResultsLS)!);
    }

    return [];
};

export interface Job {
    applyLink: string;
    benefits: string;
    city: string;
    country: string;
    desc: string;
    employerName: string;
    employerWebsite: string;
    employer_logo: string;
    employmentType: string;
    occupationType: string;
    postedDate: string;
    resp: string;
    state: string;
}

export const getJobData = (): Job[] => {
    return JSON.parse(localStorage?.getItem(JobDataLS)!);
};

export const getHousingData = (): House[] => {
    return JSON.parse(localStorage?.getItem(HousingDataLS)!);
};

export const getHousesOrShelters = (): DisplayHousesOrShelters => {
    let houseFilters = [];
    if (typeof window !== 'undefined') {
        houseFilters = JSON.parse(localStorage?.getItem(HouseFilters)!);
    }

    if (!houseFilters) {
        return DefaultHousesOrShelters;
    }
    return houseFilters.data;
};

export const getHouseFromHouses = (coords: {
    lat: number;
    lng: number;
}): House & Shelter => {
    const housesOrShelters = getHousesOrShelters();
    let json;

    if (housesOrShelters === 'Houses') {
        json = localStorage?.getItem(HousingDataLS)!;
    } else {
        json = localStorage?.getItem(HomelessShelterLS)!;
    }

    let houses = JSON.parse(json);

    let houseFound: House & Shelter;
    houses.forEach((house: House & Shelter) => {
        if (house.lat === coords.lat && house.lon === coords.lng) {
            houseFound = house;
            localStorage?.setItem(SelectedHouse, JSON.stringify(houseFound));
            return houseFound;
        }
    });

    return houseFound!;
};

export const DefaultHousesOrShelters = 'Houses';
