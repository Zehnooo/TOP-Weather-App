export function locationModule() {
    navigator.geolocation;
    if (!navigator.geolocation) {
        return Promise.reject(
            new Error('Geolocation is not available.')
        );
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
}


