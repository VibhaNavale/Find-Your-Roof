'use client';

import './Houses/housing.css';
import { useEffect, useState } from 'react';
import { Drawer } from './Houses/Drawer';
import React from 'react';
import Footer from '../components/Footer/footer';
import Toggle from '../components/Toggle/toggle';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./Map/Map'), {
    ssr: false,
});

const SearchWrapper = dynamic(() => import('./Houses/SearchWrapper'), {
    ssr: false,
});

const HousesGrid = dynamic(() => import('./Houses/Houses'), {
    ssr: false,
});

export default function Housing() {
    const handleToggleChange = (selected: string) => {
        const map = document.getElementById('map-section');
        const list = document.getElementById('houses-section');
        if (map != null && list != null) {
            if (selected == 'Map') {
                map.style.display = 'block';
                list.style.display = 'none';
            } else {
                map.style.display = 'none';
                list.style.display = 'block';
            }
        }
    };

    useEffect(() => {
        // Function to update window width state
        const updateWindowWidth = () => {
            const map = document.getElementById('map-section');
            const list = document.getElementById('houses-section');
            if (window.innerWidth > 1100 && map != null && list != null) {
                map.style.display = 'block';
                list.style.display = 'block';
            } else if (
                window.innerWidth < 1100 &&
                map != null &&
                list != null
            ) {
                map.style.display = 'none'; // Mobile View
            }
        };
        window.addEventListener('resize', updateWindowWidth);

        return () => {
            window.removeEventListener('resize', updateWindowWidth);
        };
    }, []);

    return (
        <>
            <div className="grid">
                <div className="search-section">
                    <SearchWrapper searchFor={'houses'} />
                </div>
                <div className="toggle-section">
                    <Toggle
                        toggleTextLeft={'List'}
                        toggleTextRight={'Map'}
                        onToggle={handleToggleChange}
                    />
                </div>
                <HousesGrid />
                <Map />
                <Drawer />
            </div>
            <Footer />
        </>
    );
}
