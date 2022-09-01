import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelloWorld } from './HelloWorld'
import {Clicker} from "./Clicker"
import {FormExample as Chapter2} from "./Chapter-2"
import {Example as Chapter3} from "./Chapter-3"
import {StateFunctionExample as Chapter4} from "./Chapter-4"
import {Calculator as Chapter5} from './Chapter-5'
import {Counter as Chapter6} from './Chapter-6'
import {Chapter7Example as Chapter7} from './Chapter-7'
import {Chapter8Example2 as Chapter8} from './Chapter-8'
import {MasterDetail} from './components/MasterDetail'
import {Chapter9} from './Chapter-9'
import {Chapter10} from './Chapter-10'
import {Chapter11} from './Chapter-11'
import {Chapter13} from "./Chapter-13/Chapter-13"
import {Chapter14} from "./Chapter-14"
import {Chapter15} from "./Chapter-15"
import {Chapter16} from "./Chapter-16";

const RED = '#F0056'
const content = {
    ch_1: { name: 'Chapter 1', component: Clicker },
    ch_2: { name: 'Chapter 2', component: Chapter2},
    ch_3: { name: 'Chapter 3', component: Chapter3},
    ch_4: { name: 'Chapter 4', component: Chapter4},
    ch_5: { name: 'Chapter 5', component: Chapter5},
    ch_6: { name: 'Chapter 6', component: Chapter6},
    ch_7: { name: 'Chapter 7', component: Chapter7},
    ch_8: { name: 'Chapter 8', component: Chapter8},
    ch_9: { name: 'Chapter 9', component: Chapter9},
    ch_10: { name: 'Chapter 10', component: Chapter10},
    ch_11: { name: 'Chapter 11', component: Chapter11},
    ch_13: { name: 'Chapter 13', component: Chapter13},
    ch_14: { name: 'Chapter 14', component: Chapter14},
    ch_15: { name: 'Chapter 15', component: Chapter15},
    ch_16: { name: 'Chapter 16', component: Chapter16},

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        {/*<HelloWorld color={RED}></HelloWorld>*/}
        {/*<Clicker></Clicker>*/}
        {/*<FormExample />*/}
        {/*<h2>User hook</h2>*/}
        {/*<Example/>*/}
        {/*<StateFunctionExample />*/}
        {/*<h2>Chapter 5: Store function in useState</h2>*/}
        {/*<Calculator />*/}
        {/*<h2>Chapter 6: base of useEffect</h2>*/}
        {/*<Counter />*/}
        {/*<h2>Chapter 7:</h2>*/}
        {/*<Chapter7Example />*/}
        {/*<h2>Chapter 8: useRef</h2>*/}
        {/*<Chapter8Example />*/}
        {/*<Chapter8Example2 />*/}
        <MasterDetail content={content} />
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
