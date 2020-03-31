import { ChannelReducer, ChannelState } from '@reducers';

export interface ApplicationState {
    Channel: ChannelState;
}

export const reducers = {
    Channel: ChannelReducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<any>;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<TResult>
}