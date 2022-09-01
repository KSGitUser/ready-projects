//hooks' factory
import { useCallback, useState } from 'react'

function createMappedState(mapper) {
    return function (initialValue) {
        const [value, setValue] = useState(mapper(initialValue));

        const setMappedValue = useCallback(newValue => {
            setValue(mapper(newValue));
        }, [])

        return [value, setMappedValue]
    }
}

const useLowerCaseState = createMappedState((newValue) => {
    return newValue?.toLowerCase()
})

const useUpperCaseState = createMappedState((newValue) => {
    return newValue?.toUpperCase()
})

const useTrimmedState = createMappedState((newValue) => {
    return newValue?.trim()
})

function Field({label, value, setValue }) {
    return (
        <div style={{ margin: 10 }}>
            <label style={{marginRight: 10}}>{label}
                <input
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </label>
        </div>
    )
}

export  function Chapter16() {
    const [lowercased, setLowerCase] = useLowerCaseState('SOME UPPERCASE VALUE')
    const [uppercased, setUpperCase] = useUpperCaseState('some lowercased value')
    const [trimmed, setTrimmed] = useTrimmedState('   some trimmed value     ')

    return (
        <>
            <h2>Chapter 16: Hooks Factory</h2>
            <Field
                label="Lowercase only:"
                value={lowercased}
                setValue={setLowerCase}
            />
            <Field
                label="Uppercase only:"
                value={uppercased}
                setValue={setUpperCase}
            />
            <Field
                label="Trimmed only:"
                value={trimmed}
                setValue={setTrimmed}
            />
        </>

    )
}

