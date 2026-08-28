import {renderOptions} from "./dom.js";
import {state} from "./state.js";

let inputDelay, activeRequest;
export function collectInput(e){
    e.preventDefault();
    document.querySelector('#options-drawer').replaceChildren();
    clearTimeout(inputDelay);
    let val;
    switch(e.type){
        case 'submit':
        val = e.srcElement[0].value.trim();
            break;
        case 'input':
        val = e.target.value.trim();
            break;
    }
    if (val.length < 3 || val === '') {
        activeRequest?.abort();
        return;
    }
    let locations = null;
    inputDelay = setTimeout(  async () => {
        locations = await findLocationOptions(val);
        renderOptions(locations);
    }, 400);
}

export async function lookupCoordinates(){
    const latitude = state.location.latitude;
    const longitude = state.location.longitude;
    const key = '0f58d943e6024be9a1688b56a1543cbf';
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    state.location.name = `${data.features[0].properties.city}, ${data.features[0].properties.state}`
}

async function findLocationOptions(location) {
    activeRequest?.abort();
    activeRequest = new AbortController();
    const params = new URLSearchParams ({
        text: location,
        type: 'city',
        format: 'json',
        limit: 15,
        filter: 'countrycode:us',
        apiKey: '1fcfeda0ee6d4c378383e6b12cb99bbd',
        options: 'nonulls'
    });
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?${params}`;
    console.log('Current search: ', url);
    try {
        const res = await fetch(url, {
            signal: activeRequest.signal,
        });
        if (!res.ok) {
            throw new Error(`Request failed ${res.status}`);
        }
        const data = await res.json();
        const dupes = new Set();

        return data?.results
            .map(({ city, state, lon, lat }) => ({ city, state, lon, lat }))
            .filter(({ city, state }) => {
                const key = `${city}|${state}`;
                if (dupes.has(key)) return false;
                dupes.add(key);
                return true;
        });


    } catch (err) {
        console.error({code: err.code, msg: err.message})
    }
}

export function saveLocation(e){
    e.preventDefault();
    state.location.name = e.target.dataset.locationName;
    state.location.latitude = e.target.dataset.lat;
    state.location.longitude = e.target.dataset.lng;
    return {...state}
}

export async function loadWeather(){
    try {
        const {longitude, latitude} = {...state.location}
        const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
        const key = '?key=' + 'B2D6UMP5Y2C8Z28DEVB849T3K';
        const location = `${latitude},${longitude}`
        const res = await fetch(url + location + key);
        if (!res.ok) throw new Error(`Weather request failed ${res.status}`);
        const data = await res.json();
        console.log('raw data: ', data);
        return buildWeatherData(data);

    } catch (err) {
        console.error({c: err.code, m: err.message});
    }


}

function buildWeatherData(data){
    const today = data?.currentConditions;
    const remaining = data?.days
        .map(({ datetime, description, temp, tempmax, tempmin, feelslike, precip, sunrise, sunset }) => ({
            date: datetime, desc: description, temp: temp, maxTemp: tempmax, minTemp: tempmin, feelsTemp: feelslike, precip, sunrise, sunset
        }));
    state.location.data.current = today;
    state.location.data.future = remaining;
}


export function updateRecentLocations(){
    const recents = state.recentLocations;
    const exists = recents.some(obj => `${state.location.name}` in obj);
    if (exists) {
        console.log('not saving location, already exists')
        return;
    }
    recents.push({
        [state.location.name]: [state.location.longitude, state.location.latitude]
    });
    return {...state}
}

export const formatDate = (date, type) => {
    switch(type){
        case 'epoch':
            return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(date));
        case 'string':
            const [year, month, day] = date.split('-');
            return new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(year, month - 1, day));
    }
}

export const formatTime = (time) => {
    const [hours, minutes, seconds] = time.split(":");
    const designator = hours > 12 ? "PM" : "AM";
    let formattedHours = hours > 12 ? hours - 12 : hours;
    return `${formattedHours}:${minutes} ${designator}`;
}

export const formatTemp = (temp, currentScale) => {
    return currentScale === 'fahrenheit' ? ((temp - 32) * (5/9)) : ((temp * 1.8) + 32);
}