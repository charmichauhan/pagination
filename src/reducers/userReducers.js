import { userConstants } from '.././actions/userConstants';

export function users(state = {}, action) {
    switch (action.type) {
        case userConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case userConstants.GETALL_SUCCESS:
            return {
                items: action.users
            };
        case userConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case userConstants.DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map(user =>
                    user._id === action._id
                        ? { ...user, deleting: true }
                        : user
                )
            };
        case userConstants.DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter(user => user._id !== action._id)
            };
        case userConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user
            return {
                ...state,
                items: state.items.map(user => {
                    if (user._id === action._id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...userCopy } = user;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...userCopy, deleteError: action.error };
                    }
                    return user;
                })
            };
        case userConstants.GETBYID_REQUEST:
            return {
                ...state,
                items: state.items.map(user =>
                    user._id === action._id
                        ? { ...user, loading: true}
                        : user
                )
            };
        case userConstants.GETBYID_SUCCESS:
            return {
                items: state.items.filter(user => user._id !== action._id)
            };
        case userConstants.GETBYID_FAILURE:
            return {
                ...state,
                items: state.items.map(user => {
                    if (user._id === action._id) {
                        const { loading } = user;
                        return { error: action.error };
                    }
                    return user;
                })
            };
        case userConstants.UPDATE_REQUEST:
            return {
                ...state,
                items: state.items.map(user =>
                    user._id === action._id
                        ? { ...user, loading: true}
                        : user
                )
            };
        case userConstants.UPDATE_SUCCESS:
            return {
                items: state.items.filter(user => user._id !== action._id)
            };
        case userConstants.UPDATE_FAILURE:
            return {
                ...state,
                items: state.items.map(user => {
                    if (user._id === action._id) {
                        const { loading } = user;
                        return { error: action.error };
                       // return { ...userCopy, deleteError: action.error };

                    }
                    return user;
                })
            };
        default:
            return state
    }
}