import { addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import config from '../config';
import { AppThunkAction } from '../store';
import { fetchReq } from '../Utils';

export interface EditorState {
    JsonData: any;
}

export interface RequestAction {
    type: 'REQUEST_EDITOR';
}

export interface ReceiveAction {
    type: 'RECEIVE_EDITOR';
    Data: any[];
}

export type KnownAction = RequestAction | ReceiveAction;

export const actionCreators = {
    getJson: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let fetchTask = fetchReq(`${config.restUrl}/api/channels/json`, 'GET')
            .then((data) => {
                dispatch({ type: 'RECEIVE_EDITOR', Data: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_EDITOR' });
        return fetchTask;
    },
    saveJson: (data): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const opts = {
            data: data
        };
        let fetchTask = fetchReq(`${config.restUrl}/api/channels/json`, 'POST', opts)
            .then((data) => {
                dispatch({ type: 'RECEIVE_EDITOR', Data: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_EDITOR' });
        return fetchTask;
    }
};

const unloadedState: EditorState = { JsonData: {} };

export const reducer: Reducer<EditorState> = (state: EditorState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_EDITOR':
            return {
                JsonData: state.JsonData
            };
        case 'RECEIVE_EDITOR':
            return {
                JsonData: action.Data
            };
    }

    return state || unloadedState;
};
