import {useUser} from "./UserContext";
import {useTheme} from "../ThemeContext";
import {getThemeColor} from "../Theme";

export function UserAvatar() {
    const { avatarUrl } = useUser()
    const src = `${avatarUrl}?${new Date().getTime()}`
    const [theme] = useTheme()

    const style = {
        width: 128,
        height: 128,
        borderRadius: 10,
        border: `3px solid ${getThemeColor(theme)}`,
        objectFit: 'cover'
    }
    return <img src={src} alt="User avatar" style={style} />
}
