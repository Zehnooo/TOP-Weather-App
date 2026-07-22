
export const state =  {
    location: {
        latitude: null,
        longitude: null,
    },
    key: 'B2D6UMP5Y2C8Z28DEVB849T3K',
    baseUrl: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/',
}

/*
export async function initState() {
    try {
        state.location = await locationModule();
    } catch (err) {
        console.error('Could not get location: ',  err.message);
    }
    return {...state};
}

 */