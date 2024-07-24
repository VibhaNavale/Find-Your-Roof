'use client';
import React, { useEffect, useState } from 'react';
import './housing.css';
import Card from '../../components/Card/card';
import {
    DefaultHousesOrShelters,
    DisplayHousesOrShelters,
    HomelessShelterLS,
    House,
    HouseFilters,
    HousingChangeEvent,
    HousingDataLS,
    MarkerClicked,
    SearchDataType,
    SearchResultsLS,
    Shelter,
    constructSearchParameters,
    filterSearchResultsOnQuery,
    getHouseFromHouses,
    getHousesOrShelters,
} from '../../util/model';
import supabase from '../../config/supabaseClient';
import Toast from '../../components/Toast/toast';
import dynamic from 'next/dynamic';

const extractLatLon = (coord: string) => {
    const coords = coord.split(',');

    return {
        lat: coords[0],
        lon: coords[1],
    };
};

const extractShelterData = (shelterData: any): Shelter[] => {
    return shelterData.map((shelter: any) => {
        const coords = extractLatLon(shelter.coord);

        return {
            lat: Number(coords.lat),
            lon: Number(coords.lon),
            address: shelter.address,
            desc: shelter.desc,
            name: shelter.name,
            email: shelter.email,
            zipCode: shelter.zipCode,
            purchaseLink: shelter.website,
            photoLink: shelter.photo,
        };
    });
};

const HousesGrid: React.FC = () => {
    // @ts-ignore
    const [houses, setHouses] = useState<House & Shelter[]>([]);
    // @ts-ignore
    const [shelters, setShelters] = useState<House & Shelter[]>([]);
    const [zeroResults, setZeroResults] = useState(false);
    const [displayHousesOrShelters, setDisplayHousesOrShelters] =
        useState<DisplayHousesOrShelters>(DefaultHousesOrShelters);

    useEffect(() => {
        const housesOrShelters = getHousesOrShelters();
        setDisplayHousesOrShelters(housesOrShelters);

        document.addEventListener(MarkerClicked, function (e: any) {
            const coords = e.detail.event.latlng;
            getHouseFromHouses(coords);
        });

        document.addEventListener(HousingChangeEvent, function (e: any) {
            setDisplayHousesOrShelters(e.detail.data);

            if (e.detail.data === 'Houses') {
                callHousingData();
            } else {
                callHomelessShelters();
            }
        });

        document
            .querySelector('.houses-section')!
            .addEventListener(SearchResultsLS, function (e: any) {
                const searchQuery = e.detail.searchQuery;

                const housesOrShelters = getHousesOrShelters();

                const dataType =
                    housesOrShelters === 'Houses'
                        ? SearchDataType.HousingDataLS
                        : SearchDataType.HomelessShelterLS;

                const prepQuery = constructSearchParameters(
                    searchQuery,
                    HouseFilters,
                    dataType
                );
                let cur = filterSearchResultsOnQuery(prepQuery);
                if (cur.length === 0) {
                    setZeroResults(true);
                } else {
                    if (housesOrShelters === 'Houses') {
                        // @ts-ignore
                        setHouses(cur);
                    } else {
                        // @ts-ignore
                        setShelters(cur);
                    }
                }
            });

        const callHousingData = async () => {
            let housesJSON;
            housesJSON = localStorage?.getItem(HousingDataLS)!;

            let houses = JSON.parse(housesJSON!);
            if (!houses) {
                let { data: housingData, error } = await supabase
                    .from('HousingData')
                    .select('*');

                if (error != null) {
                    console.log(
                        new Error(
                            'Error in fetching housing data from supabase'
                        )
                    );
                    return;
                }

                houses = housingData;
            }

            setHouses(houses);
            localStorage?.setItem(HousingDataLS, JSON.stringify(houses));
        };

        const callHomelessShelters = async () => {
            let sheltersJSON;
            sheltersJSON = localStorage?.getItem(HomelessShelterLS)!;
            let shelters = JSON.parse(sheltersJSON!);

            if (!shelters) {
                let { data: shelterData, error } = await supabase
                    .from('ShelterData')
                    .select('*');

                if (error != null) {
                    console.log(
                        new Error(
                            'Error in fetching housing data from supabase'
                        )
                    );
                    return;
                }

                shelters = extractShelterData(shelterData);
            }

            setShelters(shelters);
            localStorage?.setItem(HomelessShelterLS, JSON.stringify(shelters));
        };

        callHousingData();
        callHomelessShelters();
    }, []);

    useEffect(() => {
        setDisplayHousesOrShelters(getHousesOrShelters());
    }, [houses]);

    const getColor = (key: number): string => {
        if (key % 4 === 0) {
            return '--gray92';
        } else if (key % 4 === 1) {
            return '--gray92';
        } else if (key % 4 === 2) {
            return '--gray92';
        }

        return '--gray92';
    };

    const cardClickHandler = (e: any) => {
        const li = e.target.closest('li') ? e.target.closest('li') : e.target;
        if (li.nodeName !== 'LI') return;

        const selectedHouseNumber: number = li.dataset.house;

        const selectedHouse =
            displayHousesOrShelters === 'Houses'
                ? houses[selectedHouseNumber]
                : shelters[selectedHouseNumber];

        document.querySelector('.drawer')!.dispatchEvent(
            new CustomEvent(MarkerClicked, {
                detail: {
                    event: {
                        latlng: {
                            lat: selectedHouse.lat,
                            lng: selectedHouse.lon,
                        },
                    },
                },
                composed: true,
                bubbles: true,
            })
        );
    };

    const displayed = displayHousesOrShelters === 'Houses' ? houses : shelters;

    return (
        <div className="houses-section" id="houses-section">
            {zeroResults ? (
                <Toast
                    text="No results found. Please try a different query!"
                    setZeroResults={setZeroResults}
                    zeroResults={zeroResults}
                />
            ) : (
                <></>
            )}
            {/* <Toast text="results"/> */}
            <ul onClick={cardClickHandler}>
                {displayed.map((house, key) => {
                    return (
                        <li
                            key={key}
                            data-house={key}
                            style={{
                                color: `var(${getColor(key)})`,
                            }}
                        >
                            <Card>
                                {
                                    <div className="card-content">
                                        <img
                                            src={house.photoLink}
                                            alt="drawing of house"
                                            style={{
                                                // marginLeft: "auto",
                                                // marginRight: "auto",
                                                display: 'block',
                                                width: '100%',
                                                height: '80%',
                                                transform: 'scale(1.5)',
                                            }}
                                        />
                                        <p>
                                            {displayHousesOrShelters ===
                                            'Houses'
                                                ? house.address
                                                : house.name}
                                        </p>
                                    </div>
                                }
                            </Card>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default dynamic(() => Promise.resolve(HousesGrid), {
    ssr: false,
});
