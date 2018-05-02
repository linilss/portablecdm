import * as types from './types';

export const addFavoriteLocations = (favoriteLocations) => {
    return {
        type: types.ADD_FAVORITE_LOCATIONS,
        payload: favoriteLocations
    }
    
}

export const toggleFavoritePortCall = (portCallId) => {
    return (dispatch, getState) => {
        if(getState().favorites.portCalls.includes(portCallId)) {
            dispatch({
                type: types.REMOVE_FAVORITE_PORTCALL,
                payload: portCallId,
            });

            return false;
        }

        dispatch({
            type: types.ADD_FAVORITE_PORTCALL,
            payload: portCallId,
        });
        
        return true;
    }
}

export const toggleFavoriteVessel = (imo) => {
    return (dispatch, getState) => {
      if(getState().favorites.vessels.length > 0) {
        let badIMO = getState().favorites.vessels[0].split(":").slice(-1)[0];
            dispatch({
                type: types.REMOVE_FAVORITE_VESSEL,
                payload: badIMO,
            });
        }
        dispatch({
            type: types.ADD_FAVORITE_VESSEL,
            payload: imo,
        });

        return true;
    }
}






















