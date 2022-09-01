import { useState } from 'react'

function useMergeState(initialState) {
    const [ state, setState ] = useState(initialState);

    const mergeState = (changes) => {
        setState(prevState=> ({
            ...prevState,
            ...changes,
        }))
    }

    return [state, mergeState ]
}

function FormField(props) {
    const { name, label, value, onChange, type = 'text'} = props
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={event => onChange(event.target.value)}
            />
        </div>
    )
}

const initialState = {
    firstName: '',
    lastName: '',
    age: 21,
}

export function FormExample() {
    const [ data, setData ] = useMergeState(initialState)

    const clear = () => setData(initialState)

    return (
        <>
            <form>
                <FormField
                    name="firstName"
                    label="First name"
                    value={data.firstName}
                    onChange={(firstName) => setData({ firstName })}
                />
                <FormField
                    name="lastName"
                    label="Last name"
                    value={data.lastName}
                    onChange={(lastName) => setData({ lastName })}
                />
                <FormField
                    name="age"
                    label="Age"
                    value={data.age}
                    onChange={(age) => setData({ age: age ? parseInt(age) : 0 })}
                    type="number"
                />
            </form>
            <div>
                <button onClick={clear}>CLEAR</button>
            </div>
            <div>
                firstName: {data.firstName} <br />
                lastName: {data.lastName} <br />
                age: {data.age}
            </div>
        </>
    )
}
