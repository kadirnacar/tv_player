import { BaseKnownAction } from '@reducers';
import { Action, Reducer } from 'redux';
import { Actions, ChannelState, IReceiveListDataAction, IRequestListDataAction, ISetItemDataAction } from './state';

const unloadedState: ChannelState = {
    List: [],
    CurrentItem: null
};

export type KnownAction = BaseKnownAction | IReceiveListDataAction | IRequestListDataAction | ISetItemDataAction;

export const reducer: Reducer<ChannelState> = (currentState: ChannelState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;

    switch (action.type) {

        case Actions.SetCurrentData:
            if (action.payload) {
                currentState.CurrentItem = action.payload;
            }
            return { ...currentState };
        case Actions.ReceiveListData:
            currentState.List = action.payload;
            return { ...currentState };
        case Actions.RequestListData:
            return { ...currentState };
        default:
            break;
    }
    return currentState || unloadedState;
};
