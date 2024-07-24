import { CSSResultGroup, LitElement, PropertyValueMap, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// @ts-ignore
import L from 'leaflet';
import {
    DefaultHousesOrShelters,
    DisplayHousesOrShelters,
    HomelessShelterLS,
    House,
    HouseFilters,
    HouseMarker,
    HousingChangeEvent,
    HousingDataLS,
    MarkerClicked,
    SearchDataType,
    SearchResultsLS,
    constructSearchParameters,
    filterSearchResultsOnQuery,
    getHousesOrShelters,
    getHousingData,
    getSearchedHouses,
} from '../../util/model';

@customElement('map-element')
export class MapElement extends LitElement {
    @property()
    hasInitialized: boolean = false;

    @property()
    markerReferences: any = [];

    @property()
    searchResults: HouseMarker[] = [];

    @property()
    couldNotLoadMap: boolean = false;

    @property()
    loading: boolean = true;

    @property()
    map: any;

    @property()
    displayHousesOrShelters: DisplayHousesOrShelters = DefaultHousesOrShelters;

    setMarkersOnMap(currentSearchResults: House[]) {
        currentSearchResults.forEach((searchResult: House) => {
            this.searchResults.forEach((house: HouseMarker) => {
                if (
                    searchResult.lat === house.lat &&
                    searchResult.lon === house.lon
                ) {
                    house.marker.addTo(this.map);
                } else {
                }
            });
        });
    }

    removeAllMarkers() {
        this.searchResults.forEach((house: HouseMarker) => {
            if (this.map.hasLayer(house.marker)) {
                this.map.removeLayer(house.marker);
            }
        });
    }

    listenForSearchQuery(e: any) {
        const dataType =
            this.displayHousesOrShelters === 'Houses'
                ? SearchDataType.HousingDataLS
                : SearchDataType.HomelessShelterLS;

        const prepQuery = constructSearchParameters(
            e.detail.searchQuery,
            HouseFilters,
            dataType
        );
        let currentResults = filterSearchResultsOnQuery(prepQuery);

        if (currentResults.length > 0) {
            this.removeAllMarkers();
            this.setMarkersOnMap(currentResults);
            this.requestUpdate();
        }
    }

    listenForDisplayHousesOrShelters(e: any) {
        this.displayHousesOrShelters = e.detail.data;
        this.initialize();
        this.requestUpdate();
    }

    constructor() {
        super();
        document.addEventListener(
            SearchResultsLS,
            this.listenForSearchQuery.bind(this)
        );

        document.addEventListener(
            HousingChangeEvent,
            this.listenForDisplayHousesOrShelters.bind(this)
        );
    }

    createRenderRoot() {
        return this;
    }

    async getYourLocation(): Promise<GeolocationPosition> {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    resolve(position);
                },
                function () {
                    reject('Could not get location');
                }
            );
        });
    }

    createMap(coords: { lat: number; lon: number }) {
        if (this.map) {
            this.map.remove();
        }

        this.map = L.map('map').setView([coords.lat, coords.lon], 13);

        // add the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        }).addTo(this.map);
    }

    fetchSearchResults() {
        const housesOrShelters = getHousesOrShelters();
        this.displayHousesOrShelters = housesOrShelters;
        const dataLS =
            this.displayHousesOrShelters === 'Houses'
                ? HousingDataLS
                : HomelessShelterLS;
        if (typeof window !== 'undefined') {
            const resultsJSON = localStorage?.getItem(dataLS)!;
            this.searchResults = JSON.parse(resultsJSON);
        }
    }

    clickedMarker(e: any) {
        this.dispatchEvent(
            new CustomEvent(MarkerClicked, {
                detail: {
                    event: e,
                },
                composed: true,
                bubbles: true,
            })
        );
    }

    findMarkerReference(markerReference: any): HouseMarker {
        let house: HouseMarker | null = null;
        this.searchResults.forEach((searchResults: HouseMarker) => {
            if (markerReference === searchResults.marker) {
                house = searchResults;
            }
        });

        return house!;
    }

    createPopupContent(e: any, markerReference: any) {
        const photoLink = this.findMarkerReference(markerReference).photoLink;

        var popup = L.popup().setContent(
            `<img class="house-image-on-map" src="${photoLink}"/>`
        );

        return popup;
    }

    markerHovered(e: any, markerReference: any) {
        markerReference
            .bindPopup(this.createPopupContent(e, markerReference))
            .openPopup();
    }

    addAMarkerToMap(lat: number, lon: number) {
        let marker = L.marker(
            { lat: lat, lon: lon },
            {
                riseOnHover: true,
            }
        );

        marker
            .addTo(this.map)
            .on('click', this.clickedMarker.bind(this))
            .on('pointerdown', this.clickedMarker.bind(this))
            .on('mouseover', (e: any) => {
                this.markerHovered(e, marker);
            });

        return marker;
    }

    addMarkersToMap() {
        this.searchResults.forEach((searchResult: HouseMarker) => {
            searchResult.marker = this.addAMarkerToMap(
                searchResult.lat,
                searchResult.lon
            );
        });
    }

    afterPosition(lat: number, lon: number) {
        this.createMap({
            lat: lat,
            lon: lon,
        });
        this.fetchSearchResults();
        this.addMarkersToMap();
    }
    async initialize() {
        let location: GeolocationPosition;
        try {
            location = await this.getYourLocation();
            this.afterPosition(
                location.coords.latitude,
                location.coords.longitude
            );
        } catch {
            this.couldNotLoadMap = true;
        } finally {
            this.loading = false;
        }
    }

    protected firstUpdated(): void {
        if (!this.hasInitialized) {
            this.initialize();
            this.hasInitialized = true;
        }
    }

    render() {
        return html` <div id="map">
            ${this.couldNotLoadMap
                ? html`<p class="position-center">
                      Could not get your location!
                  </p>`
                : ''}
            ${this.loading
                ? html`<div class="lds-ripple">
                      <div></div>
                      <div></div>
                  </div>`
                : ''}
        </div>`;
    }
}
