function Label({ children }) {
    return (<span style={{ color: '#0F0' }}>{ children }</span>)
}

export function HelloWorld(props) {
    const { color } = props
    const style = {
        color,
    }

    return( <div>
        Hello <span style={style}>World!</span>
        <Label>Some custom label</Label>
    </div>)
}
