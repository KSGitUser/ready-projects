import { useState, useRef, forwardRef } from 'react'
import PinInput from './components/PinInput/PinInput'

function logRender(WrappedComponent) {
    return forwardRef(function(props, forwardedRef) {
        const name = WrappedComponent.name ?? WrappedComponent.render?.name
        console.log(`render ${name}`)
        return <WrappedComponent ref={forwardedRef} ${ ...props} />
    })
}

function SimpleText({ text }) {
    return <span>{ text }</span>
}

const LoggedSimpleText = logRender(SimpleText)
const LoggedPinInput = logRender(PinInput)


export function Chapter10() {
    const [digits, setDigits] = useState(['', '', ''])
    const inputRef = useRef()

    const focus = () => inputRef.current?.focus()


    return(
        <>
            <div>
                <LoggedSimpleText text="Some text" />
            </div>
            <LoggedPinInput ref={inputRef} digits={digits} onChange={setDigits} />
            <div>
                <button onClick={focus}>FOCUS</button>
            </div>
        </>
    )
}
