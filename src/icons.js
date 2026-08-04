import rain  from './images/rain.svg';
import snow  from './images/snow.svg';
import cloudy from './images/cloudy.svg';
import partlyCloudyDay from './images/partly-cloudy-day.svg';
import partlyCloudyNight from './images/partly-cloudy-night.svg';
import sunrise  from './images/sunrise.svg';
import sunset  from './images/sunset.svg';
import high from './images/temp-high.svg';
import low from './images/temp-low.svg'
import clearDay  from './images/clear-day.svg';
import clearNight from './images/clear-night.svg';


const icons = {
    'partly-cloudy-day': partlyCloudyDay,
    'partly-cloudy-night': partlyCloudyNight,
    'clear-day': clearDay,
    'clear-night': clearNight,
    rain,
    snow,
    cloudy,
    sunrise,
    sunset,
    high,
    low,

}

export const resolveIcon = (iconText) => {
    return icons[iconText];
}