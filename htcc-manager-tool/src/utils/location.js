export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

export const calculateMaxDistance = (arr) => {
    let maxDistance = -1;
    for (let i = 0; i < arr.length - 1; i++){
        for (let j=0;j < arr.length; j++){
            const location1 = arr[i];
            const location2 = arr[j];
            const distance = calculateDistance(location1.latitude, location1.longitude, location2.latitude, location2.longitude);
            if (maxDistance < distance){
                maxDistance = distance;
            }
        }
    }
    return maxDistance;
};

export const calculateZoomRatio = (distance) => {
    if (distance < 10) {
        return 12;
    } else if (distance < 20){
        return 11;
    } else if (distance < 500){
        return 7;
    } else if (distance < 1000){
        return 6;
    } else {
        return 5;
    }
};