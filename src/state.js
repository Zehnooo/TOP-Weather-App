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
    scale: {
        default: 'fahrenheit',
        current: 'fahrenheit',
        preferred: null,
        setCurrent() {
            this.current === 'fahrenheit' ? this.current = 'celsius' : this.current = 'fahrenheit'
            return null;
        },
        setPreferred(value) {
            this.preferred = value;
        },
        getCurrent(){
            return this.current;
        },
        getPreferred() {
            return this.preferred;
        }

    }
}