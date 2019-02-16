import { addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import config from '../config';
import { AppThunkAction } from '../store';
import { fetchReq } from '../Utils';

export interface EditorState {
    JsonData: any;
    ReadUrl: any;
}

export interface RequestAction {
    type: 'REQUEST_EDITOR';
}

export interface ReceiveAction {
    type: 'RECEIVE_EDITOR';
    Data: any[];
}
export interface ReceiveUrlAction {
    type: 'RECEIVE_URLEDITOR';
    Data: any[];
}

export type KnownAction = RequestAction | ReceiveAction | ReceiveUrlAction;

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
    readJson: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let fetchTask = fetchReq(`${config.restUrl}/api/channels/read`, 'GET')
            .then((data) => {
                dispatch({ type: 'RECEIVE_URLEDITOR', Data: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_EDITOR' });
        return fetchTask;
    },
    readUrlJson: (name): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let fetchTask = fetchReq(`${config.restUrl}/api/channels/readurl/${name}`, 'GET')
            .then((data) => {
                dispatch({ type: 'RECEIVE_URLEDITOR', Data: data });
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

const unloadedState: EditorState = { JsonData: {}, ReadUrl: {} };

export const reducer: Reducer<EditorState> = (state: EditorState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_EDITOR':
            return {
                JsonData: state.JsonData,
                ReadUrl: state.ReadUrl
            };
        case 'RECEIVE_EDITOR':
            return {
                JsonData: action.Data,
                ReadUrl: state.ReadUrl
            };
        case 'RECEIVE_URLEDITOR':
            return {
                JsonData: action.Data,
                ReadUrl: action.Data
            };
    }

    return state || unloadedState;
};
