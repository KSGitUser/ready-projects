import { useState } from "react";

const add = (a,b) =>  a + b
const subtract = (a,b) => a - b
const multiply = (a,b) => a * b
const divide = (a,b) => a / b

const onChange = (setter) => {
    return (event) => {
        const { value } = event.target
        setter(value ? parseFloat(value) : 0)
    }
}

export function Calculator() {
    const [ a, setA ] = useState(0)
    const [ b, setB ] = useState(0)
    const [action, setAction] = useState(() => add)
    const [sign, setSign] = useState('+')

    const applyAction = (fn, fnSign) => {
        return () => {
            setAction(() => fn)
            setSign(fnSign)
        }
    }

    return (
        <>
            <div>
                <button onClick={applyAction(add, '+')} style={{margin: '15px'}}>+</button>
                <button onClick={applyAction(subtract, '-')} style={{margin: '15px'}}>-</button>
                <button onClick={applyAction(divide, '/')} style={{margin: '15px'}}>/</button>
                <button onClick={applyAction(multiply, '*')} style={{margin: '15px'}}>*</button>
            </div>
            <div>
                <input type={"number"} value={a} onChange={onChange(setA)}/>
                <span> {sign} </span>
                <input type={"number"} value={b} onChange={onChange(setB)}/>
                <span> = { action ? action(a,b) : ''}</span>
            </div>
        </>

    )
}
