import { BaseModel, IChannel } from '@models';
import { BaseState } from '@reducers';

export enum Actions {
    RequestListData = "REQUEST_LIST_CHANNEL",
    ReceiveListData = "RECEIVE_LIST_CHANNEL",
    RequestRefreshUrl = "REQUEST_REFRESH_URL",
    ReceiveRefreshUrl = "RECEIVE_REFRESH_URL",
    SetCurrentData = "SET_CURRENT_DATA",
}

export interface ChannelState {
    List: IChannel[];
    CurrentItem?: IChannel;
}


export interface ISetItemDataAction {
    type: Actions.SetCurrentData;
    payload: IChannel;
}


export interface IRequestListDataAction {
    type: Actions.RequestListData;
}

export interface IReceiveListDataAction {
    type: Actions.ReceiveListData;
    payload: IChannel[];
}


export interface IRequestRefreshUrlAction {
    type: Actions.RequestRefreshUrl;
}

export interface IReceiveRefreshUrlAction {
    type: Actions.ReceiveRefreshUrl;
    payload: IChannel[];
}