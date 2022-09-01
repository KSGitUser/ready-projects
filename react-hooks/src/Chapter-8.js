// Hook useRef
import { useEffect, useState, useCallback,  useRef } from 'react'
import {useCounter} from "./Chapter-3";

function useUpdateEffect(callback) {
    const firstRender = useRef(true)

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        } else {
            callback();
        }
    }, [callback])
}

export function Chapter8Example() {
    const refContainer = useRef()
    const toggledRef = useRef(false)
    const [toggledState, setTogglesState] = useState(false)

    const focusInput = () => {
        refContainer.current?.focus()
    }

    const onChange = (event) => {
        const { value: text } = event.target

        if (text === 'blur') {
            refContainer.current?.blur()
        }
    }

    const changeRef = () => {
        toggledRef.current = !toggledRef.current
        console.log(`toggled to: ${toggledRef.current}`)
    }

    const changeState = () => {
        setTogglesState((prev) => !prev)
    }

    console.log(
        `toggledRef: ${toggledRef.current}, toggledState: ${toggledState}`
    )

    return (
        <div>
            <input ref={refContainer} onChange={onChange}/>
            <p>
                <button onClick={focusInput}>FOCUS</button>
            </p>
            <p>
                <button onClick={changeRef}>TOGGLE REF</button>
                <button onClick={changeState}>TOGGLE STATE</button>
            </p>
        </div>
    )
}

export function Chapter8Example2() {
    const [value, increment] = useCounter()

    useEffect(() => {
        console.log('mounted')
    }, [])

    console.log(`render, value: ${value}`)

    const callback = useCallback(() => {
        console.log(` value updated: ${value} `)
    }, [value])

    useUpdateEffect(callback)

    return (
        <button onClick={increment}>RERENDER</button>
    )
}
