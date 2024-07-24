import React, { useEffect, useState } from 'react';
import styles from './search.module.css';
import {
    DefaultHousesOrShelters,
    DisplayHousesOrShelters,
    HouseFilters,
    HousingChangeEvent,
    JobFilters,
} from '../../util/model';
import dynamic from 'next/dynamic';

interface SearchProps {
    onSearch: (res: string) => void;
    searchFor: 'jobs' | 'houses';
}

const Search: React.FC<SearchProps> = ({ onSearch, searchFor }) => {
    const [res, setRes] = useState('');
    const [displayedHousesOrShelters, setDisplayHousesOrShelters] =
        useState<DisplayHousesOrShelters>(DefaultHousesOrShelters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRes(e.target.value);
    };

    const getHouseFilters = () => {
        let houseFilters;
        houseFilters = JSON.parse(localStorage?.getItem(HouseFilters)!);

        if (!houseFilters) {
            return {
                min: '',
                max: '',
                rentalOrBuy: '',
                data: DefaultHousesOrShelters,
            };
        }

        return {
            min: houseFilters.min,
            max: houseFilters.max,
            rentalOrBuy: houseFilters.rentalOrBuy,
            data: houseFilters.data,
        };
    };

    const sendHousingChangeEvent = (data: DisplayHousesOrShelters) => {
        let dispatchedElements = [
            document.querySelector('#map'),
            document.querySelector('.houses-section'),
        ];

        dispatchedElements.forEach((el) => {
            el?.dispatchEvent(
                new CustomEvent(HousingChangeEvent, {
                    bubbles: true,
                    composed: true,
                    detail: {
                        data: data,
                    },
                })
            );
        });
    };

    const onHousingChange = (e: any) => {
        const data = e.target.value;
        const filters = getHouseFilters();
        filters.data = data;
        setDisplayHousesOrShelters(data);
        localStorage?.setItem(HouseFilters, JSON.stringify(filters));

        sendHousingChangeEvent(data);
        // SEND AN EVENT ONHOUSINGCHANGE
    };

    useEffect(() => {
        const filters = getHouseFilters();
        setDisplayHousesOrShelters(filters.data);
        localStorage?.setItem(HouseFilters, JSON.stringify(filters));
        sendHousingChangeEvent(filters.data);
    }, []);

    const gatherHouseFilters = (e: any) => {
        const formData = new FormData(e.target as HTMLFormElement);

        const data = formData.get('data')!;
        const min = formData.get('min')!;
        const max = formData.get('max')!;
        const rentalOrBuy = formData.get('rental-or-buy')!;

        const filters = {
            min: min,
            max: max,
            rentalOrBuy: rentalOrBuy,
            data: data,
        };

        localStorage?.setItem(HouseFilters, JSON.stringify(filters));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchFor === 'houses') {
            gatherHouseFilters(e);
        } else if (searchFor === 'jobs') {
            gatherJobFilters(e);
        }

        onSearch(res);
    };

    const displayHouseFilters = (): JSX.Element => {
        return (
            <>
                {displayedHousesOrShelters === 'Houses' ? (
                    <>
                        <div className={styles['label-input']}>
                            <label>Min</label>
                            <input name="min" type="number"></input>
                        </div>

                        <div className={styles['label-input']}>
                            <label>Max</label>
                            <input name="max" type="number"></input>
                        </div>

                        <select
                            className={styles['select']}
                            name="rental-or-buy"
                        >
                            <option>Both</option>
                            <option>Rent</option>
                            <option>Sale</option>
                        </select>
                    </>
                ) : (
                    <></>
                )}
                <select
                    className={
                        styles['select'] + ' ' + styles['houses-or-shelters']
                    }
                    value={displayedHousesOrShelters}
                    onChange={onHousingChange}
                    name="data"
                >
                    <option>Houses</option>
                    <option>Shelters</option>
                </select>
            </>
        );
    };

    const gatherJobFilters = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.target as HTMLFormElement);
        const employmentType = formData.get('employment-type')!;

        const filters = {
            employmentType: employmentType,
        };

        localStorage?.setItem(JobFilters, JSON.stringify(filters));
    };

    const displayJobFilters = (): JSX.Element => {
        return (
            <>
                <select className={styles['select']} name="employment-type">
                    <option>All</option>
                    <option>Full Time</option>
                    <option>Contractor</option>
                    <option>Part Time</option>
                    <option>Intern</option>
                    <option>Temporary</option>
                </select>
            </>
        );
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={res}
                    onChange={handleChange}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                    <img
                        src="search.svg"
                        alt="search"
                        className={styles.searchIcon}
                    />
                </button>
                {searchFor === 'houses'
                    ? displayHouseFilters()
                    : displayJobFilters()}
            </form>
        </div>
    );
};

export default dynamic(() => Promise.resolve(Search), {
    ssr: false,
});
