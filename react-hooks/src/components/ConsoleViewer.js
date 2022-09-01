import {useState, useRef, useEffect} from "react"
import { v4 as uuidv4 } from 'uuid'
import format from 'date-fns/format'


export function ConsoleViewer() {
    const [messages, setMessage] = useState([])
    const footer = useRef()

    useEffect(() => {
        //Monkey patch
        // console.log =
        window.consoleLog = (message) => {
            const text =
                typeof message === 'object' ? JSON.stringify(message) : message;

            const newMessage = {
                id: uuidv4(),
                text,
                timestamp: new Date().getTime(),
            }

            setMessage(prev => [...prev, newMessage])
        }
    }, [])

    useEffect(() => {
        footer.current?.scrollIntoView();
    }, [messages])

    const clear = () => {
        setMessage([])
    }

    return (
        <div className="console-container">
            <button className="console-clear" onClick={clear}>
                Clear
            </button>
            <div className="console-scroll">
                {messages.map(({id, timestamp, text}) => (
                    <div key={id}>
                        <span className="console-timestamp">
                           [{format(timestamp, 'HH:mm:ss')}]
                        </span>{' '}
                        <span>{ text }</span>
                    </div>
                ))}
            </div>
            <div ref={footer} className="console-footer"></div>
        </div>
    )
}
