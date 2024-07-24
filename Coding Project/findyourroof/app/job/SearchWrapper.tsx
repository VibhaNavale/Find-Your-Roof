import { FC, useState } from 'react';
import Search from '../components/Search/search';
import { JobDataLS, SearchResultsLS } from '../util/model';

interface SearchWrapperProps {
    searchFor: 'jobs' | 'houses';
}

export const SearchWrapper: FC<SearchWrapperProps> = ({ searchFor }) => {
    const onSearch = (searchQuery: any) => {
        document.dispatchEvent(
            new CustomEvent(JobDataLS, {
                detail: {
                    searchQuery: searchQuery,
                },
                composed: true,
                bubbles: true,
            })
        );
    };

    return <Search searchFor={searchFor} onSearch={onSearch} />;
};
