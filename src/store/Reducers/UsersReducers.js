const initialState = {
    id: '',
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    expirationTime: 0,
    expirationDate: '',
    phoneNumber: '',
    token: '',
    refreshToken: '',
    isAuthenticated: false,
    refresh: 0,
    selectedSpace: '',
    colorMode: 'dark'

}

function redoxStorage(state = initialState, action) {
    let nextState = initialState

    switch (action.type) {
        case 'LOGIN':
            nextState = {
                ...state,
                ...action.users,
                isAuthenticated: true
            };

            return nextState || state

        case 'USER':
            nextState = {
                ...state,
                users: action.value,
            }

            return nextState || state

        case 'SELECT_SPACE':
            return {
                ...state,
                selectedSpace: action.selectedSpace
            }

        case "SET_MENUS":
            return {
                ...state,
                menus: action.menus,

            };

        case 'SET_COLOR_MODE':
            return {
                ...state,
                colorMode: action.colorMode
            };

        case 'LOGOUT':
            return initialState;

        default:
            return state
    }
}

export default redoxStorage
