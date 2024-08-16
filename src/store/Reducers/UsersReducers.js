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
    bearerToken: '',
    refreshToken: '',
    isAuthenticated: false,
    profilePhoto: '',
    refresh: 0,
    claims: []
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

        case 'LOGOUT':
            return initialState;

        default:
            return state
    }
}

export default redoxStorage
