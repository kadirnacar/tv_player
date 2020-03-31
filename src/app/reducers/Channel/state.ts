import { BaseModel, IChannel } from '@models';
import { BaseState } from '@reducers';

export enum Actions {
    RequestListData = "REQUEST_LIST_CHANNEL",
    ReceiveListData = "RECEIVE_LIST_CHANNEL",
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
