'use client';
import { FC } from 'react';
import Search from '../../components/Search/search';
import { SearchResultsLS } from '../../util/model';
import dynamic from 'next/dynamic';

interface SearchWrapperProps {
    searchFor: 'jobs' | 'houses';
}

const SearchWrapper: FC<SearchWrapperProps> = ({ searchFor }) => {
    const onSearch = (searchQuery: any) => {
        let dispatchedElements = [
            document.querySelector('#map'),
            document.querySelector('.houses-section'),
        ];

        dispatchedElements.forEach((el) => {
            el?.dispatchEvent(
                new CustomEvent(SearchResultsLS, {
                    detail: {
                        searchQuery: searchQuery,
                    },
                    composed: true,
                    bubbles: true,
                })
            );
        });
    };

    return <Search searchFor={searchFor} onSearch={onSearch} />;
};

export default dynamic(() => Promise.resolve(SearchWrapper), {
    ssr: false,
});
