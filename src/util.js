import {renderOptions} from "./dom.js";


export function currentDate() {
    const d = new Date();
    const op = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    return (d.toLocaleString('en-us', op));
}

export function currentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

let inputDelay, activeRequest;
export function collectInput(e){
    e.preventDefault();
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
    if (val.length < 3) {
        activeRequest?.abort();
        return;
    }
    inputDelay = setTimeout(  async () => {
        renderOptions(await findLocationOptions(val));
    }, 400);
}

async function findLocationOptions(location) {
    activeRequest?.abort();
    activeRequest = new AbortController();
    const params = new URLSearchParams ({
        text: location,
        type: 'city',
        format: 'json',
        limit: 10,
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
            return;
        }
        const data = await res.json();
        const results = data?.results;
        return results.map(({ formatted, lon, lat }) => ({ formatted, lon, lat }));

    } catch (err) {
        console.error({code: err.code, msg: err.message})
    }
}