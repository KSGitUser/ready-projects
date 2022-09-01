import {UserContext} from './User/UserContext'
import {UserTitle} from "./User/UserTitle";
import {UserAvatar} from "./User/UserAvatar";

const style = {
    padding: 10,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#DDDDDD',
    borderRadius: 5,
}

const user = {
    firstName: 'Jack',
    middleName: 'the',
    lastName: 'Cat',
    avatarUrl: 'https://cataas.com/cat'
}

export function UserPanel() {
    return (
        <div style={style}>
            <UserContext.Provider value={user}>
                <UserAvatar />
                <br />
                <UserTitle />
            </UserContext.Provider>
        </div>
    )
}
