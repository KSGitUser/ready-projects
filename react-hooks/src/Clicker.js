import { useState } from 'react'


export function Clicker() {
    const [ clicks, setClicks ] = useState(0)
    const [ showClicks, setShowClicks ] = useState(false)

    const onClick = () => {
        setTimeout(() => {
            console.log(`set clicks ${clicks + 1}`)
            setClicks(clicks => clicks + 1)
        }, 2000)
    }

    const toggleShowClicks = () => {
        setShowClicks((prev) => !prev)
    }

    const clicksText = showClicks ? ` (${clicks})` : ''

    return (
        <>
            <button onClick={onClick}>Click me! {clicksText}</button>
            <button onClick={toggleShowClicks}>Toggle show clicks!</button>
        </>

    )
}
