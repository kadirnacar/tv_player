import { BaseKnownAction } from '@reducers';
import { Action, Reducer } from 'redux';
import { Actions, ChannelState, IReceiveListDataAction, IReceiveSaveDataAction, IRequestSaveDataAction, IRequestListDataAction, IReceiveRefreshUrlAction, IRequestRefreshUrlAction, ISetItemDataAction } from './state';

const unloadedState: ChannelState = {
    List: [],
    CurrentItem: null
};

export type KnownAction = BaseKnownAction | IReceiveSaveDataAction | IRequestSaveDataAction | IReceiveListDataAction | IRequestListDataAction | IReceiveRefreshUrlAction | IRequestRefreshUrlAction | ISetItemDataAction;

export const reducer: Reducer<ChannelState> = (currentState: ChannelState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;

    switch (action.type) {

        case Actions.SetCurrentData:
            currentState.CurrentItem = action.payload;
            return { ...currentState };
        case Actions.ReceiveListData:
            currentState.List = action.payload;
            return { ...currentState };
        case Actions.RequestListData:
            return { ...currentState };
        case Actions.ReceiveSaveData:
            currentState.List = action.payload;
            return { ...currentState };
        case Actions.RequestSaveData:
            return { ...currentState };
        case Actions.ReceiveRefreshUrl:
            currentState.List = action.payload;
            return { ...currentState };
        case Actions.RequestRefreshUrl:
            return { ...currentState };
        default:
            break;
    }
    return currentState || unloadedState;
};
