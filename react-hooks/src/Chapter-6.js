//Base of useEffect

import { useEffect } from 'react'
import {useCounter} from "./Chapter-3";

function updateClickCount(clicksCount) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                clicksCount,
            })
        }, 1000)
    })
}

export function Counter() {
    const [ count, increment ] = useCounter(0, 1)
    // eslint-disable-next-line no-console
    console.log(count);
    window.consoleLog("Message to console")

    useEffect(() => {
        document.title = `Count: ${count}`
    },  [count])

    // useEffect(() => {
    //   const update = async () => {
    //       const response = await updateClickCount(count)
    //       console.log(response);
    //   }
    //   update()
    // }, [count])

    useEffect(() => {
        console.log(`>> running effect ${count}`);

        return () => {
            console.log(`>> cleaning app ${count}`);
        }
    }, [count])

    useEffect(() => {
        console.log('component did mount');

        return () => {
            console.log('component will unmount')
        }
    }, []) // deps list is empty

    useEffect(() => {
        console.log('executed AFTER each render');
    }) // deps list is missing

    return (
        <div>
            <p>Current count: {count}</p>
            <button onClick={increment}>+1</button>
        </div>
    );
}
