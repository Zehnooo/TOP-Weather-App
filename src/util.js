

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

export async function collectInput(e){
    e.preventDefault();
    let val;
    switch(e.type){
        case 'submit':
        val = e.srcElement[0].value.trim();
            break;
        case 'input':
        val = e.target.value.trim();
            break;
    }
    if (val === '') return;
    const encoded = encodeURIComponent(val);
    await findLocationOptions(encoded);
}

async function findLocationOptions(location) {
    const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&addressdetails=1&limit=10`;
    console.log(url);
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'ZehnosWeatherApp/1.0' }
        });
        const data = await res.json();
        data.sort((locA, locB) => locA.importance - locB.importance);
        console.log('locations found from input: ', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error({code: err.code, msg: err.message})
    }
}