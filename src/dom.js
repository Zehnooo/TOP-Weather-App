import "./reset.css"
import "./styles.css";
import  { state }  from './state.js';
import {collectInput, saveLocation, loadWeather, updateRecentLocations, formatDate, lookupCoordinates} from './util.js';
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
                                const results = await loadWeather();
                                showWeatherData(results);
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

        const testButton = createElement('button', ['btn'], 'test-button', 'Tester');
        testButton.addEventListener('click', () => {
                main.append(loadLocationPage());
        })

        tools.append(bgSwitch, testButton);
        f.append(tools);
        return f;
}

const loadLocationPage = () => {
        main.replaceChildren();

        const con = createElement('div', ['location-con'], 'content');
        const { location } = state;
        console.log(location);

        const locationHeader = () => {
                const head = createElement('section', ['location-head']);
                const con = createElement('div', ['card'], 'main-info');
                const d = createElement('p', ['loading', 'text'], 'date-field', '');
                const t = createElement('p', ['loading', 'text'], 'time-field', '');
                const l = createElement('p', ['loading', 'text'], 'location-field',  '' );

                con.append(d, t, l);
                head.append(con);
                return head;
        }

        const currentWeather = () => {
                const s = createElement('section', ['location-body']);
                const figure = createElement('figure', ['icon-container']);
                const i = createElement('img', ['loading', 'image', 'icon'], 'weather-icon');

                const tempCon = createElement('div', [], 'temp-container');
                const maxTemp = createElement('div', ['loading', 'card'], 'max-temp');
                const currentTemp = createElement('div', ['loading', 'card'], 'current-temp');
                const minTemp = createElement('div', ['loading', 'card'], 'min-temp');

                tempCon.append(minTemp, currentTemp, maxTemp);
                figure.append(i);
                s.append(figure, tempCon);
                return s;
        }
        const futureWeather = () => {
                const s = createElement('section', ['location-footer']);
                const futureCon = createElement('div', ['future-weather']);
                const d1 = createElement('div', ['loading', 'card', 'future-day'], 'd1');
                const d2 = createElement('div', ['loading', 'card', 'future-day'], 'd2');
                const d3 = createElement('div', ['loading', 'card', 'future-day'], 'd3');
                const d4 = createElement('div', ['loading', 'card', 'future-day'], 'd4');
                const d5 = createElement('div', ['loading', 'card', 'future-day'], 'd5');

                futureCon.append(d1, d2, d3, d4, d5);
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
                        console.log("formatted option", option);
                        const op = createElement('p', ['home-el'], 'location-found', String(`${option.city}, ${option.state}`));
                        op.addEventListener('click', async (e) => {
                                locationList.style.opacity = 0;
                                const updatedState = saveLocation(e);
                                updateRecentLocations(updatedState);
                                main.append(loadLocationPage());
                                const results = await loadWeather();
                                showWeatherData(results);
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
        console.log(today);
        console.log(JSON.stringify(current, null, 2));

        const dateField = resolveElement('#date-field', ['loading'], [], String(formatDate(new Date(current.datetimeEpoch * 1000))));

        // add time field

        const locationField = resolveElement('#location-field', ['loading'], [], String(state.location.name));

        const icon = resolveElement('#weather-icon', ['loading'], [], null);
                icon.src = resolveIcon(String(current.icon));

        const tempContainer = document.querySelector('#temp-container');
        const temps = tempContainer.querySelectorAll('.loading');
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
                console.log('id', id);
                const name = references.displayNames[id];
                const display = createElement('p', [], `${id}-display`, `${String(today[references.dataNames[id]])}`);
                const icon = document.createElement('img');
                icon.src = resolveIcon(String(name.toLowerCase()));
                temp.append(icon, display);
                temp.classList.remove('loading');
        });

}

function resolveElement( selector, remClasses = [], addClasses = [], value = null ) {
        const el = document.querySelector(`${String(selector)}`);
        console.log(el);
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

