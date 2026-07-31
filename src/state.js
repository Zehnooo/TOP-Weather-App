export const state =  {
    location: {
        name: null,
        latitude: null,
        longitude: null,
        data: {
            current: {},
            future: {},
        },
    },
    recentLocations: [],
    savedLocations: {},
    activePage: null,
    previousPage: null,
}