export const Theme = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red'
}

export function getThemeColor(theme) {
    const themeColors = {
        green: '#449944',
        blue: '#4444FF',
        red: '#994444'
    }

    return themeColors[theme]
}
