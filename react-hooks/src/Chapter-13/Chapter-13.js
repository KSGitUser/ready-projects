import { ThemeProvider } from './ThemeContext';
import { Label } from './Label'
import {ThemeLabel} from "./ThemeLabel";
import {ThemeToolbar} from "./ThemeToolbar";
import {UserPanel} from "./UserPanel";

export function Chapter13() {
    return (
        <div>
            <ThemeProvider>
                <Label>useContext example</Label>
                <UserPanel />
                <ThemeLabel />
                <ThemeToolbar />
            </ThemeProvider>
        </div>
    )
}
