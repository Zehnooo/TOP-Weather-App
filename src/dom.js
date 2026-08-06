import "./reset.css"
import "./styles.css";
import  { state }  from './state.js';
import {
        collectInput,
        saveLocation,
        loadWeather,
        updateRecentLocations,
        formatDate,
        lookupCoordinates,
        formatTime
} from './util.js';
import { locationModule } from "./location.js";
import { resolveIcon } from "./icons.js";


const main = document.querySelector('#root');

const bg = {
        blue: 'linear-gradient(rgb(6, 200, 249) 0%, rgb(9, 164, 241) 25%, rgb(10, 134, 235) 50%, rgb(12, 100, 233) 75%, rgb(13, 67, 227) 100%)',
        purple: 'linear-gradient(135deg, rgb(234, 152, 218), rgb(210, 145, 223), rgb(186, 137, 228), rgb(163, 130, 234), rgb(139, 123, 239), rgb(115, 115, 244), rgb(91, 108, 249))',
}

export function initDom () {
                document.body.prepend(globalHeader());
                main.append(homePage());
                document.body.appendChild(globalFooter());
                calcContentHeight();
                return null;
}

const loadingOverlay = {
        create() {
                const current = window.getComputedStyle(document.body).backgroundImage;
                const spinnerClass = current === bg.blue ? 'blue' : 'purple';

                const overlay = createElement('div', ['loading-overlay', 'hide']);
                const text = createElement('h2', ['loading-text'], null, 'Loading...');
                const spinner = createElement('div', ['loading-spinner', `${spinnerClass}`]);


                overlay.append(text, spinner);
                return overlay;
        },
        toggle(overlay) {
                overlay.classList.contains('hide') ? overlay.classList.remove('hide') : overlay.remove();
        }
}

const homePage = () => {
        const con = createElement('div', ['home-con'], 'content');

        const inpDiv = createElement('div', ['home-el'], 'search-con');

        const f = createElement('form');
                f.addEventListener('submit', collectInput);
        const fCon = createElement('div', ['home-el', 'form-container'], '');


                const inp = createElement('wa-input', ['home-el'], 'location-input');
                inp.setAttribute('label', 'Location');
                inp.setAttribute('with-clear', 'with-clear')
                inp.placeholder = 'Chicago IL';
                inp.addEventListener('input', collectInput);

                const autocompleteOptions = createElement('div', ['home-el'], 'options-drawer');


        const locationButton = createElement('wa-button', ['wa-palette-gray70'], 'geolocation');
                locationButton.setAttribute('variant', 'brand');
                locationButton.setAttribute('appearance', 'outlined')
                locationButton.addEventListener('click', async ()  => {
                        try {
                                locationButton.textContent = 'Locating...';
                                const res = await locationModule();
                                state.location.latitude = res.latitude;
                                state.location.longitude = res.longitude;
                                await lookupCoordinates();
                                main.append(loadLocationPage());
                                renderWeather();
                        } catch (err) {
                                console.error({code: err.code, msg: err.message});
                        }
        });

                locationButton.textContent = 'Share Location';

                fCon.append( inp, autocompleteOptions);
                f.append(fCon);
                inpDiv.append(f, locationButton);
                con.append(inpDiv);
                return con;
}

function renderWeather(){
        const overlay = loadingOverlay.create();
        document.body.append(overlay);
        loadingOverlay.toggle(overlay);
        setTimeout(async () => {
                const results = await loadWeather();
                loadingOverlay.toggle(overlay);
                showWeatherData(results);
                document.querySelector('#content').style.opacity = '1';
        }, 3000);
}

const globalHeader = () => {
        const h = createElement('header');
        const name = createElement('h2', ['home-el'], null, "Zehno's Weather");

        h.append(name);
        return h;
}

const globalFooter = () => {
        const f = createElement('footer');
        const tools = createElement('div');
        const bgSwitch = createElement('button', ['btn'], 'bg-switch');
                bgSwitch.innerHTML = '<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 3V7M15 3V6M4 10H20M12 21C10.2337 21 8.91561 19.3737 9.28133 17.6457L9.34332 17.3528C9.56076 16.3254 9.04388 15.2832 8.09439 14.8346L5.9897 13.8401C4.77487 13.2661 4 12.043 4 10.6994V4.63149C4 3.73044 4.73044 3 5.63149 3H18.3685C19.2696 3 20 3.73044 20 4.63149V10.6994C20 12.043 19.2251 13.2661 18.0103 13.8401L15.9056 14.8346C14.9561 15.2832 14.4392 16.3254 14.6567 17.3528L14.7187 17.6457C15.0844 19.3737 13.7663 21 12 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
                bgSwitch.addEventListener('click', changeBg);

        tools.append(bgSwitch);
        f.append(tools);
        return f;
}

const loadLocationPage = () => {
        main.replaceChildren();
        const con = createElement('div', ['location-con'], 'content');
        con.style.opacity = '0';
        const locationHeader = () => {
                const head = createElement('section', ['location-head']);
                const con = createElement('div', ['card-header'], 'main-info');
                const dateTime = createElement('div', ['location-head-dt']);
                const d = createElement('p', ['text'], 'date-field', '');
                const dot = createElement('p', ['divider'], null, '\u00B7');
                const t = createElement('p', [ 'text'], 'time-field', '');
                const l = createElement('h2', [ 'text'], 'location-field',  '' );
                const figure = createElement('figure', ['icon-container']);
                const i = createElement('img', [ 'image', 'icon'], 'weather-icon');
                const desc = createElement('h3', [ 'text'], 'weather-desc');

                figure.append(i);
                dateTime.append(d, dot, t);
                con.append(dateTime, l, figure, desc);
                head.append(con);
                return head;
        }

        const currentWeather = () => {
                const s = createElement('section', ['location-body']);


                const tempCon = createElement('div', ['glass-bg'], 'temp-container');
                const maxTemp = createElement('div', ['temp-card'], 'max-temp');
                const currentTemp = createElement('div', ['temp-card'], 'current-temp');
                const minTemp = createElement('div', ['temp-card'], 'min-temp');

                const sunCon = createElement('div', ['glass-bg'], 'sun-container');
                const sunrise = createElement('div', ['sun-card'], 'sunrise');
                const sunset = createElement('div', ['sun-card'], 'sunset');


                tempCon.append(minTemp, currentTemp, maxTemp);
                sunCon.append(sunrise, sunset);
                s.append(tempCon, sunCon);
                return s;
        }
        const futureWeather = () => {
                const s = createElement('section', ['location-footer']);
                const futureCon = createElement('div', ['glass-bg'], 'future-weather');
                const title = createElement('h4', ['future-title'], null, 'Next 5 Days');
                const row = createElement('div', [], 'future-day-row');
                const d1 = createElement('div', [ 'card', 'future-day'], 'd1');
                const d2 = createElement('div', [ 'card', 'future-day'], 'd2');
                const d3 = createElement('div', [ 'card', 'future-day'], 'd3');
                const d4 = createElement('div', [ 'card', 'future-day'], 'd4');
                const d5 = createElement('div', [ 'card', 'future-day'], 'd5');

                row.append(d1, d2, d3, d4, d5);
                futureCon.append(title, row);
                s.append(futureCon);
                return s;
        }

        con.append(locationHeader(), currentWeather(), futureWeather());
        return con;
}



export function renderOptions(options){
        try {
                const locationList = document.querySelector('#options-drawer');
                locationList.style.opacity = 0;
                if (!options.length) {
                        locationList.appendChild(createElement('p', [],'no-locations', 'No locations found...'));
                        locationList.style.opacity = 1;
                        return;
                }
                for (const option of options) {
                        const op = createElement('p', ['home-el'], 'location-found', String(`${option.city}, ${option.state}`));
                        op.addEventListener('click', async (e) => {
                                locationList.style.opacity = 0;
                                const updatedState = saveLocation(e);
                                updateRecentLocations(updatedState);
                                main.append(loadLocationPage());
                                renderWeather();
                        });
                        op.dataset.locationName = `${option.city}, ${option.state}`
                        op.dataset.lat = option.lat;
                        op.dataset.lng = option.lon;
                        locationList.appendChild(op);
                }
                locationList.style.opacity = 1;
        } catch (err) {
                console.error({c: err.code, m: err.message})
        }
}

function showWeatherData() {

        const d = state.location.data;
        const { current, future } = d;
        const today = future[0];

        console.log('Current Data: ', JSON.stringify(current, null, 1));
        console.log("Today's Data: ", JSON.stringify(today, null, 1));

        resolveHeadElements(current, today);
        resolveBodyElements(current, today);
        resolveFooterElements(future);
}

function resolveFooterElements(futureData){
        for (let i = 1; i <= 5; i++){
                const data = futureData[i];
                const id = `#d${i}`
                const day = document.querySelector(String(id));
                const date = createElement('p', ['future-day-date'], null, formatDate(data.date, 'string').replace(', 2026', ''));

                const minLabel = createElement('span', ['future-day-label', 'low'], null, 'Low');
                const minTemp = createElement('p', ['future-day-low', 'future-day-text'], null, String(`${data.minTemp}\u00B0`));
                minTemp.prepend(minLabel);

                const maxLabel = createElement('span', ['future-day-label', 'high'], null, 'High');
                const maxTemp = createElement('p', ['future-day-high', 'future-day-text'], null, String(`${data.maxTemp}\u00B0`));
                maxTemp.prepend(maxLabel);

                day.append(date, minTemp, maxTemp);
                day.classList.remove('loading');

        }
}

function resolveHeadElements(current, today) {
        const dateField = resolveElement('#date-field', ['loading'], [], String(formatDate(new Date(current.datetimeEpoch * 1000), 'epoch')));

        const timeField = resolveElement('#time-field', ['loading'], [], `As of ${String(formatTime(current.datetime))}`);

        const locationField = resolveElement('#location-field', ['loading'], [], String(state.location.name));

        const icon = resolveElement('#weather-icon', ['loading'], [], null);
        icon.src = resolveIcon(String(current.icon));

        const desc = resolveElement('#weather-desc', ['loading'], [], today.desc);
}

function resolveBodyElements(current, today){
        const tempContainer = document.querySelector('#temp-container');
        const temps = tempContainer.querySelectorAll('div');
        temps.forEach(temp => {
                const references = {
                        displayNames: {
                                'min-temp': 'Low',
                                'current-temp': 'Current',
                                'max-temp': 'High',
                        },
                        dataNames: {
                                'min-temp': 'minTemp',
                                'current-temp': 'temp',
                                'max-temp': 'maxTemp',
                        }
                }

                const id = temp.id;
                const name = references.displayNames[id];
                const title = createElement('p', [], `${id}-title`, String(name));
                const display = createElement('p', [], `${id}-display`, `${String(today[references.dataNames[id]])}\u00B0`);
                const icon = document.createElement('img');
                icon.src = resolveIcon(String(name.toLowerCase()));
                temp.append(title, icon, display);
        });

        const stageContainer = document.querySelector('#sun-container');
        const stages = stageContainer.querySelectorAll('div');
        stages.forEach((stage) => {
                const name = `${stage.id.charAt(0).toUpperCase()}${stage.id.slice(1)}`;
                const title = createElement('h4', [], `${stage.id}-title`, name);
                const icon = createElement('img', [], `${stage.id}-icon`);
                icon.src = resolveIcon(stage.id);
                const display = createElement('p', [], `${stage.id}-display`, String(formatTime(today[stage.id])));
                stage.append(icon, display);
        });

        /*
        Current Data:  {
 "datetime": "13:15:00",
 "datetimeEpoch": 1786040100,
 "temp": 78.6,
 "feelslike": 78.6,
 "humidity": 74.3,
 "dew": 69.8,
 "precip": 0,
 "precipprob": 0,
 "snow": 0,
 "snowdepth": 0,
 "preciptype": null,
 "windgust": 4.8,
 "windspeed": 0.1,
 "winddir": 355,
 "pressure": 1020,
 "visibility": 9.9,
 "cloudcover": 100,
 "solarradiation": 467,
 "solarenergy": 1.7,
 "uvindex": 5,
 "conditions": "Overcast",
 "icon": "cloudy",
 "stations": [
  "D9672",
  "KVYS",
  "D9746"
 ],
 "source": "obs",
 "sunrise": "05:56:42",
 "sunriseEpoch": 1786013802,
 "sunset": "20:07:27",
 "sunsetEpoch": 1786064847,
 "moonphase": 0.79
}
         */
}

function resolveElement( selector, remClasses = [], addClasses = [], value = null ) {
        const el = document.querySelector(`${String(selector)}`);
        if (!el) {
                console.error('missing element');
        }
        if (remClasses.length > 0) {
                for (const c of remClasses){
                        el.classList.remove(c);
                }
        }

        if (addClasses.length > 0) {
                for (const c of addClasses) {
                        el.classList.add('c');
                }
        }

        if (value !== null || value !== '') el.textContent = value;

        return el;
}

function createElement(type, classes = [], id = null, text = null){
        const el = document.createElement(String(type));
        if (classes.length > 0) classes.forEach(c => el.classList.add(c));
        if (id !== null) el.id = id;
        if (text !== null) el.textContent = text;
        return el;
}

function changeBg(){
        const current = window.getComputedStyle(document.body).backgroundImage;
        document.body.style.backgroundImage = current === bg.blue ? 'var(--purp-grad)' : 'var(--blue-grad)';
}

export function calcContentHeight(){
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const mainContent = document.querySelector('main');
        const headerHeight = header.getBoundingClientRect().height;
        const footerHeight = footer.getBoundingClientRect().height;
        mainContent.style.height = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
}

