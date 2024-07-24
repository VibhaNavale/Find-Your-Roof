'use client';
import { createComponent } from '@lit/react';
import React from 'react';
import { MapElement } from './map-element';
import dynamic from 'next/dynamic';

const ReactMapWrapper = () => {
    // Creates a React component from a Lit component
    const MapLitElement = createComponent({
        react: React,
        tagName: 'map-element',
        elementClass: MapElement,
    });

    return (
        <div className="map-section" id="map-section">
            <MapLitElement />
        </div>
    );
};

export default dynamic(() => Promise.resolve(ReactMapWrapper), {
    ssr: false,
});
