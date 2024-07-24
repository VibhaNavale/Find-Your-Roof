'use client';
import { useEffect, useState } from 'react';
import {
    DefaultHousesOrShelters,
    DisplayHousesOrShelters,
    House,
    MarkerClicked,
    Shelter,
    getHouseFromHouses,
    getHousesOrShelters,
} from '../../util/model';

export const Drawer = () => {
    const [selectedHouse, setSelectedHouse] = useState<House & Shelter>();
    const [displayHousesOrShelters, setDisplayHousesOrShelters] =
        useState<DisplayHousesOrShelters>(DefaultHousesOrShelters);

    useEffect(() => {
        setDisplayHousesOrShelters(getHousesOrShelters());

        document.addEventListener(MarkerClicked, function (e: any) {
            const coords = e.detail.event.latlng;
            const house = getHouseFromHouses(coords);
            setSelectedHouse(house);
        });
    });

    const deselectHouse = (e: any) => {
        if (
            !e.target.classList.contains('close-button-drawer') &&
            (e.target.classList.contains('drawer') ||
                e.target.closest('.drawer'))
        ) {
            return;
        }

        setSelectedHouse(undefined);
    };

    const displayedContent = (): JSX.Element => {
        const housesOrShelters = getHousesOrShelters();

        if (housesOrShelters === 'Houses') {
            return (
                <>
                    <div className="price-address">
                        <p className="address">{selectedHouse?.address}</p>
                        <strong className="price">
                            {selectedHouse?.price}$
                        </strong>
                    </div>
                    <div className="listing">
                        <p>{selectedHouse?.listingType}</p>
                        <p>Since {selectedHouse?.listedDate.split('T')[0]}</p>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <p className="shelter-name">
                        <a href={selectedHouse?.purchaseLink} target="_blank">
                            {selectedHouse?.name}
                        </a>
                    </p>
                    <div className="address-email">
                        <p className="address">{selectedHouse?.address}</p>
                        <p className="email">{selectedHouse?.email}</p>
                    </div>
                    <p className="desc">{selectedHouse?.desc}</p>
                </>
            );
        }
    };

    return (
        <div className={`drawer ${selectedHouse ? 'open' : ''}`}>
            <div className="padding">
                <img
                    src={selectedHouse?.photoLink}
                    alt="temp image of a house"
                    style={{
                        width: '60%',
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block',
                    }}
                    width="100"
                    height="100"
                />
                {displayedContent()}
                {selectedHouse?.purchaseLink ? (
                    <a
                        className="house-link"
                        target="_blank"
                        href={selectedHouse?.purchaseLink}
                    >
                        See More!
                    </a>
                ) : (
                    <></>
                )}
            </div>
            <button className="close-button-drawer" onClick={deselectHouse}>
                x
            </button>
        </div>
    );
};
