import {useTheme} from "./ThemeContext";
import {Theme} from "./Theme";
import {Button} from './Button'

export function ThemeToolbar() {
    const [, setTheme] = useTheme();

    const onClickHandler = (theme) => () => setTheme(theme)

    return (
        <div>
            <Button onClick={onClickHandler(Theme.RED)}>Red</Button>
            <Button onClick={onClickHandler(Theme.GREEN)}>Green</Button>
            <Button onClick={onClickHandler(Theme.BLUE)}>Blue</Button>
        </div>
    )
}
