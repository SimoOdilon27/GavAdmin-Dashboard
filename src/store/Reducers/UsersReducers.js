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
    selectedSpace: ''

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

        case 'LOGOUT':
            return initialState;

        default:
            return state
    }
}

export default redoxStorage
