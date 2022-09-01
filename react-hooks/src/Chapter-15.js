import {useCallback, useDebugValue, useState} from "react";

function useToggle(initialValue) {
    const [value, setValue] = useState(initialValue || false)

    useDebugValue('My Label to Hook');

    const toggle = useCallback(() => {
        setValue(prevValue => !prevValue)
    }, [])

    return [value, toggle]
}

function ToggleButton({toggled, handleToggle}) {
    const caption = toggled ? 'ON' : 'OFF'

    return (
        <button style={{ width: 100 }} onClick={handleToggle}>{caption}</button>
    )
}

function SettingToggle({ label, initialValue }) {
    const [isEnabled, toggleEnabled] = useToggle(initialValue)

    return (
        <div style={{ margin: 10}}>
            <ToggleButton toggled={isEnabled} handleToggle={toggleEnabled} />
            <span style={{ marginLeft: 10 }}>{label}</span>
        </div>
    )
}

export function Chapter15() {
    return (
        <>
            <h2>Chapter 15: useDebugValue, React Dev Tools</h2>
            <SettingToggle label="Audio Enable" initialValue={true} />
            <SettingToggle label="Video Enable" initialValue={false} />
        </>
    )
}
