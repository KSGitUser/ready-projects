import {createContext, useContext} from "react";

const initialContext = {
    firstName: '',
    middleName: '',
    lastName: '',
    avatarUrl: ''
}

export const UserContext = createContext(initialContext);

export function useUser() {
    const user = useContext(UserContext);
    if (!user) {
        throw new Error(`useUser must be used within a UserContext provider`)
    }

    return user;
}
