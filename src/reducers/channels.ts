import { addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import config from '../config';
import { AppThunkAction } from '../store';
import { fetchReq } from '../utils';

export interface ChannelState {
    isLoading: boolean;
    Data: any[];
    Current: any;
}

export interface RequestAction {
    type: 'REQUEST_CHANNEL';
}

export interface ReceiveAction {
    type: 'RECEIVE_CHANNEL';
    Data: any[];
}

export type KnownAction = RequestAction | ReceiveAction ;

export const actionCreators = {
    getChannels: (page?, length?, id?, sorting?): AppThunkAction<KnownAction> => (dispatch, getState) => {
        var sort = {};
        if (sorting) {
            sorting.forEach(element => {
                sort[element.columnName] = element.direction.toUpperCase();
            });
        }
        const opts = {
            page: page || 0,
            length: length || 10,
            id: id || null,
            sort: sort
        };
        let fetchTask = fetchReq(`${config.restUrl}/api/channels/list`, 'GET')
            .then((data) => {
                dispatch({ type: 'RECEIVE_CHANNEL', Data: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_CHANNEL' });
        return fetchTask;
    }
};

const unloadedState: ChannelState = { Data: [], Current: {}, isLoading: false };

export const reducer: Reducer<ChannelState> = (state: ChannelState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CHANNEL':
            return {
                Data: state.Data,
                Current: state.Current,
                isLoading: true
            };
        case 'RECEIVE_CHANNEL':
            return {
                Data: action.Data,
                Current: state.Current,
                isLoading: false
            };
    }

    return state || unloadedState;
};
