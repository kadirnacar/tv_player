import { IChannel, Result } from "@models";
import { ChannelService } from "@services";
import { ApplicationState } from '@store';
import { batch } from "react-redux";
import { Actions } from './state';

export const ChannelActions = {
    getList: () => async (dispatch, getState: () => ApplicationState) => {
        let result: Result<IChannel[]>;
        await batch(async () => {
            await dispatch({ type: Actions.RequestListData });
            result = await ChannelService.getList();
            await dispatch({ type: Actions.ReceiveListData, payload: result.value });

        });
        return result;
    },
    setCurrent: (channel: IChannel) => async (dispatch, getState: () => ApplicationState) => {
        await batch(async () => {
            await dispatch({ type: Actions.SetCurrentData, payload: channel });
        });
    },
}