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

const githubIcon = '<svg fill="#000000" width="64px" height="64px" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m12.301 0h.093c2.242 0 4.34.613 6.137 1.68l-.055-.031c1.871 1.094 3.386 2.609 4.449 4.422l.031.058c1.04 1.769 1.654 3.896 1.654 6.166 0 5.406-3.483 10-8.327 11.658l-.087.026c-.063.02-.135.031-.209.031-.162 0-.312-.054-.433-.144l.002.001c-.128-.115-.208-.281-.208-.466 0-.005 0-.01 0-.014v.001q0-.048.008-1.226t.008-2.154c.007-.075.011-.161.011-.249 0-.792-.323-1.508-.844-2.025.618-.061 1.176-.163 1.718-.305l-.076.017c.573-.16 1.073-.373 1.537-.642l-.031.017c.508-.28.938-.636 1.292-1.058l.006-.007c.372-.476.663-1.036.84-1.645l.009-.035c.209-.683.329-1.468.329-2.281 0-.045 0-.091-.001-.136v.007c0-.022.001-.047.001-.072 0-1.248-.482-2.383-1.269-3.23l.003.003c.168-.44.265-.948.265-1.479 0-.649-.145-1.263-.404-1.814l.011.026c-.115-.022-.246-.035-.381-.035-.334 0-.649.078-.929.216l.012-.005c-.568.21-1.054.448-1.512.726l.038-.022-.609.384c-.922-.264-1.981-.416-3.075-.416s-2.153.152-3.157.436l.081-.02q-.256-.176-.681-.433c-.373-.214-.814-.421-1.272-.595l-.066-.022c-.293-.154-.64-.244-1.009-.244-.124 0-.246.01-.364.03l.013-.002c-.248.524-.393 1.139-.393 1.788 0 .531.097 1.04.275 1.509l-.01-.029c-.785.844-1.266 1.979-1.266 3.227 0 .025 0 .051.001.076v-.004c-.001.039-.001.084-.001.13 0 .809.12 1.591.344 2.327l-.015-.057c.189.643.476 1.202.85 1.693l-.009-.013c.354.435.782.793 1.267 1.062l.022.011c.432.252.933.465 1.46.614l.046.011c.466.125 1.024.227 1.595.284l.046.004c-.431.428-.718 1-.784 1.638l-.001.012c-.207.101-.448.183-.699.236l-.021.004c-.256.051-.549.08-.85.08-.022 0-.044 0-.066 0h.003c-.394-.008-.756-.136-1.055-.348l.006.004c-.371-.259-.671-.595-.881-.986l-.007-.015c-.198-.336-.459-.614-.768-.827l-.009-.006c-.225-.169-.49-.301-.776-.38l-.016-.004-.32-.048c-.023-.002-.05-.003-.077-.003-.14 0-.273.028-.394.077l.007-.003q-.128.072-.08.184c.039.086.087.16.145.225l-.001-.001c.061.072.13.135.205.19l.003.002.112.08c.283.148.516.354.693.603l.004.006c.191.237.359.505.494.792l.01.024.16.368c.135.402.38.738.7.981l.005.004c.3.234.662.402 1.057.478l.016.002c.33.064.714.104 1.106.112h.007c.045.002.097.002.15.002.261 0 .517-.021.767-.062l-.027.004.368-.064q0 .609.008 1.418t.008.873v.014c0 .185-.08.351-.208.466h-.001c-.119.089-.268.143-.431.143-.075 0-.147-.011-.214-.032l.005.001c-4.929-1.689-8.409-6.283-8.409-11.69 0-2.268.612-4.393 1.681-6.219l-.032.058c1.094-1.871 2.609-3.386 4.422-4.449l.058-.031c1.739-1.034 3.835-1.645 6.073-1.645h.098-.005zm-7.64 17.666q.048-.112-.112-.192-.16-.048-.208.032-.048.112.112.192.144.096.208-.032zm.497.545q.112-.08-.032-.256-.16-.144-.256-.048-.112.08.032.256.159.157.256.047zm.48.72q.144-.112 0-.304-.128-.208-.272-.096-.144.08 0 .288t.272.112zm.672.673q.128-.128-.064-.304-.192-.192-.32-.048-.144.128.064.304.192.192.32.044zm.913.4q.048-.176-.208-.256-.24-.064-.304.112t.208.24q.24.097.304-.096zm1.009.08q0-.208-.272-.176-.256 0-.256.176 0 .208.272.176.256.001.256-.175zm.929-.16q-.032-.176-.288-.144-.256.048-.224.24t.288.128.225-.224z"></path></g></svg>'

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
        const con = createElement('div', ['glass-bg']);
        const name = createElement('h2', ['home-el'], null, "Zehno's Weather");

        con.append(name);
        h.append(con);
        return h;
}

const globalFooter = () => {
        const f = createElement('footer');
        const con = createElement('div', ['glass-bg']);
        const bgSwitch = createElement('button', ['btn'], 'bg-switch');
                bgSwitch.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 3V7M15 3V6M4 10H20M12 21C10.2337 21 8.91561 19.3737 9.28133 17.6457L9.34332 17.3528C9.56076 16.3254 9.04388 15.2832 8.09439 14.8346L5.9897 13.8401C4.77487 13.2661 4 12.043 4 10.6994V4.63149C4 3.73044 4.73044 3 5.63149 3H18.3685C19.2696 3 20 3.73044 20 4.63149V10.6994C20 12.043 19.2251 13.2661 18.0103 13.8401L15.9056 14.8346C14.9561 15.2832 14.4392 16.3254 14.6567 17.3528L14.7187 17.6457C15.0844 19.3737 13.7663 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
                bgSwitch.addEventListener('click', changeBg);
        const githubButton = createElement('button', [], 'github');
        const githubLink = createElement('a');
        githubLink.href = 'https://github.com/Zehnooo/TOP-Weather-App';
        githubLink.innerHTML = githubIcon;
        githubLink.target = '_blank';
        githubButton.append(githubLink);

        con.append(bgSwitch, githubButton);
        f.append(con);
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
        const bodySection = createElement('section', [], 'body-content');
        const currentWeather = () => {
                const s = createElement('section', ['location-body']);

                const tempTitle = createElement('h4', ['card-title'], null, "Daily Temp");
                const cardCon = createElement('div', [], 'card-container');
                const tempCon = createElement('div', ['glass-bg', 'card'], 'temp-container');

                const maxTemp = createElement('div', ['temp-card'], 'max-temp');
                const currentTemp = createElement('div', ['temp-card'], 'current-temp');
                const minTemp = createElement('div', ['temp-card'], 'min-temp');

                const sunCon = createElement('div', ['glass-bg', 'card'], 'sun-container');
                const sunCardCon = createElement('div', [], 'sun-card-con');
                const sunStageTitle = createElement('h4', ['card-title'], null, 'Sun Stages');
                const sunrise = createElement('div', ['sun-card'], 'sunrise');
                const sunset = createElement('div', ['sun-card'], 'sunset');


                const futureCon = createElement('div', ['glass-bg'], 'future-weather');
                const futureTitle = createElement('h4', ['card-title'], null, 'Next 5 Days');
                const divider = createElement('span', ['cust-divider']);
                const row = createElement('div', [], 'future-day-row');

                for (let i = 1; i <= 5; i++){
                        row.append(createElement('div', ['card', 'future-day'], `d${i}`));
                        if (i < 5) {row.append(divider.cloneNode(true));}
                }

                cardCon.append(minTemp, currentTemp, maxTemp);
                tempCon.append(tempTitle, cardCon);
                sunCardCon.append(sunrise, sunset);
                sunCon.append(sunStageTitle, sunCardCon);
                s.append(tempCon, sunCon);
                futureCon.append(futureTitle, row);
                s.append(futureCon);
                return s;
        }

        bodySection.append(currentWeather())
        con.append(locationHeader(), bodySection);
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
        resolveFutureWeatherElements(future);
}

function resolveFutureWeatherElements(futureData){
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
        const tempContainer = document.querySelector('#card-container');
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
                const title = createElement('p', [`${name.toLowerCase()}`], `${id}-title`, String(name));
                const display = createElement('p', [], `${id}-display`, `${String(today[references.dataNames[id]])}\u00B0`);
                const icon = document.createElement('img');
                icon.src = resolveIcon(String(name.toLowerCase()));
                temp.append(title, icon, display);
        });

        const stageCardContainer = document.querySelector('#sun-card-con');
        const stages = stageCardContainer.querySelectorAll('div');
        stages.forEach((stage) => {
                const title = createElement('p', ['stage-title'], null,String(stage.id)[0].toUpperCase() + String(stage.id.slice(1)));
                const icon = createElement('img', ['stage-icon'], `${stage.id}-icon`);
                icon.src = resolveIcon(stage.id);
                const display = createElement('p', ['stage-time'], `${stage.id}-display`, String(formatTime(today[stage.id])));
                if (display.textContent.charAt(0) === "0"){
                        display.textContent = display.textContent.slice(1);
                }
                stage.append(title, icon, display);
        });
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

