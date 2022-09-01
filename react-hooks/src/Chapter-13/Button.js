import {useTheme} from "./ThemeContext";
import {getThemeColor} from "./Theme";

export function Button({ children, onClick}) {
    const [theme] = useTheme()

    const style = {
        backgroundColor: getThemeColor(theme),
        border: 'none',
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        margin: 5,
        color: '#FFF',
        fontFamily: 'monospace',
        cursor: 'pointer',
    }

    return (
        <button style={style} onClick={onClick}>
            {children}
        </button>
    )
}
