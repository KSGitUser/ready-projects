//use of useLayoutEffect
import { useEffect, useLayoutEffect, useState, useMemo } from 'react';

function useCharacterPosition(step) {
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch(event.key) {
                case 'ArrowLeft':
                    setLeft(prev => prev - step)
                    break;
                case 'ArrowRight':
                    setLeft(prev => prev + step)
                    break;
                case 'ArrowUp':
                    setTop(prev => prev - step)
                    break;
                case 'ArrowDown':
                    setTop(prev => prev + step)
                    break;
                default:
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    },[step])
    return [left, top]
}

const initialStyle = {
    backgroundColor: '#F00',
    position: 'absolute',
    width: '100px',
    height: '100px',
    left: 0,
    top: 0
}

function generateDummies(count) {
    const dummies = []
    for (let i = 0; i < count; i++ ) {
        dummies.push(<div key={i}>i = {i}</div>)
    }
    return dummies
}

export function Chapter7Example() {
    const [left, top] = useCharacterPosition(50)
    // const [style, setStyle] = useState(initialStyle)

    const style = useMemo(() => {
        return {
            ...initialStyle,
            left,
            top,
        }
    }, [left, top])

    // useLayoutEffect(() => {
    //     setStyle(prevValue => {
    //         return {
    //             ...prevValue,
    //             left,
    //             top
    //         }
    //     })
    // }, [left, top])

    return (
        <>
            <h2>
                [{left}, {top}]
            </h2>
            <div
                style={style}>
            </div>
            {generateDummies(15000)}
        </>
    )
}
