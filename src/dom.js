import "./reset.css"
import "./styles.css";
import  { state }  from './state.js';
import { currentDate, currentTime, collectInput } from './util.js';
import { locationModule } from "./location.js";

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
        const con = createElement('div', ['home-el', 'home-container'], 'content');

        const inpDiv = createElement('div', ['home-el'], 'search-con');

        const f = createElement('form');
                f.addEventListener('submit', collectInput);
        const fCon = createElement('div', ['home-el', 'form-container'], '');

                const lab = createElement('label', ['home-el']);
                lab.textContent = 'City';
                const inp = createElement('input', ['home-el'], 'location-input');

                inp.placeholder = 'Chicago';
                inp.addEventListener('input', collectInput);
                inp.clearable = true;
                lab.htmlFor = 'location-input';

                const autocompleteOptions = createElement('div', ['home-el'], 'options-drawer');


        const locationButton = createElement('wa-button', [], 'geolocation');

                locationButton.addEventListener('click', async ()  => {
                        try {
                                const res = await locationModule();
                                state.location.latitude = res.latitude;
                                state.location.longitude = res.longitude;

                        } catch (err) {
                                console.error({code: err.code, msg: err.message});
                        }
        });

                locationButton.innerHTML =
                    '<svg  id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 27 32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="currentColor" d="M15.56,5.172c0.576-0.547,0.94-1.315,0.94-2.17c0-1.654-1.346-3-3-3s-3,1.346-3,3 c0,0.855,0.364,1.623,0.94,2.17C4.973,6.169,0,11.756,0,18.498c0,7.444,6.056,13.5,13.5,13.5S27,25.942,27,18.498 C27,11.756,22.027,6.169,15.56,5.172z M11.5,3.002c0-1.103,0.897-2,2-2s2,0.897,2,2c0,1.094-0.884,1.983-1.974,1.997 c-0.009,0-0.017-0.001-0.026-0.001s-0.017,0.001-0.026,0.001C12.384,4.985,11.5,4.096,11.5,3.002z M14,30.973V29 c0-0.276-0.224-0.5-0.5-0.5S13,28.724,13,29v1.973C6.508,30.714,1.285,25.492,1.025,19H3c0.276,0,0.5-0.224,0.5-0.5S3.276,18,3,18 H1.025C1.283,11.506,6.507,6.282,13,6.023V8c0,0.276,0.224,0.5,0.5,0.5S14,8.276,14,8V6.023C20.493,6.282,25.717,11.506,25.975,18 H24c-0.276,0-0.5,0.224-0.5,0.5S23.724,19,24,19h1.975C25.715,25.492,20.492,30.714,14,30.973z"></path> <path fill="currentColor" d="M20.287,11.045l-8.841,4.16c-0.105,0.05-0.19,0.134-0.239,0.24l-4.159,8.84 c-0.09,0.191-0.051,0.417,0.099,0.566c0.096,0.096,0.224,0.146,0.354,0.146c0.072,0,0.145-0.016,0.213-0.047l8.84-4.16 c0.105-0.05,0.19-0.134,0.239-0.24l4.16-8.84c0.09-0.191,0.051-0.417-0.099-0.566C20.705,10.995,20.479,10.957,20.287,11.045z M15.964,19.962l-7.42,3.492l3.491-7.421l7.421-3.492L15.964,19.962z"></path> <path fill="currentColor" d="M12.586,19.412c0.378,0.378,0.88,0.586,1.414,0.586s1.036-0.208,1.414-0.586S16,18.532,16,17.998 c0-0.535-0.208-1.037-0.586-1.414c-0.756-0.756-2.072-0.756-2.828,0C12.208,16.961,12,17.463,12,17.998 C12,18.532,12.208,19.034,12.586,19.412z M13.293,17.291c0.189-0.189,0.44-0.293,0.707-0.293s0.518,0.104,0.707,0.293 C14.896,17.48,15,17.731,15,17.998s-0.104,0.518-0.293,0.707c-0.379,0.378-1.035,0.378-1.414,0C13.104,18.516,13,18.265,13,17.998 S13.104,17.48,13.293,17.291z"></path> </g> </g></svg>' + 'Share Location';

                fCon.append( inp, autocompleteOptions);
                f.append(lab, fCon);
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

        tools.append(bgSwitch);
        f.append(tools);
        return f;
}

/*
const locationHeader = () => {
        const head = createElement('div');
        const d = createElement('p', ['head-el'], 'date-field', String(currentDate()));
        const t = createElement('p', ['head-el'], 'time-field', String(currentTime));
        const l = createElement('p', ['head-el'], 'location-field',  ADD LOCATION DATA );
}
*/

export function renderOptions(options){
        try {
                const locationList = document.querySelector('#options-drawer');
                locationList.style.opacity = 0;
                if (!options.length) {
                        locationList.append(createElement('p', [],'no-locations'), 'No locations found...');
                }
                for (const option of options) {
                        console.log("formatted option", option);
                        const op = createElement('p', ['home-el'], 'location-found', String(`${option.city}, ${option.state}`));
                        op.dataset.lat = option.lat;
                        op.dataset.lng = option.lon;
                        locationList.appendChild(op);
                }
                locationList.style.opacity = 1;
        } catch (err) {
                console.error({c: err.code, m: err.message})
        }
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
