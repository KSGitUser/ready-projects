// useReducer
import { useReducer } from 'react'

const initialState = {
    count: 0,
}

const Types = {
    INCREMENT: 'INCREMENT',
    DOUBLE: 'DOUBLE',
    CLEAR: 'CLEAR',
}

function reducer(state, action) {
    switch (action.type) {
        case Types.INCREMENT:
            return {
                ...state,
                count: state.count + 1,
            }
        case Types.DOUBLE:
            return {
                ...state,
                count: state.count * 2,
            }
        case Types.CLEAR:
            return initialState
        default:
            console.log(`action type: ${action.type} was not recognized`)
            return state
    }
}

export function Chapter14() {
    const [state, dispatch] = useReducer(reducer, initialState, initialState => initialState);

    const increment = () => dispatch({ type: Types.INCREMENT})
    const double = () => dispatch({type: Types.DOUBLE})
    const clear = () => dispatch({type: Types.CLEAR})

    return (
        <div>
            <h2>useReducer example</h2>
            <p>Clicks count: {state.count}</p>
            <button onClick={increment}>+1 Click</button>
            <button onClick={double}>Double Click</button>
            <button onClick={clear}>Clear</button>
        </div>
    )


}
