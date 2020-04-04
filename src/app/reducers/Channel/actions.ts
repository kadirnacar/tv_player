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
    save: (data: IChannel[]) => async (dispatch, getState: () => ApplicationState) => {
        let result: Result<IChannel[]>;
        await batch(async () => {
            await dispatch({ type: Actions.RequestSaveData });
            result = await ChannelService.save(data);
            await dispatch({ type: Actions.ReceiveSaveData, payload: result.value });

        });
        return result;
    },
    refreshUrl: (name: string) => async (dispatch, getState: () => ApplicationState) => {
        let result: Result<IChannel[]>;
        await batch(async () => {
            await dispatch({ type: Actions.RequestRefreshUrl });
            result = await ChannelService.refreshUrl(name);
            await dispatch({ type: Actions.ReceiveRefreshUrl, payload: result.value });

        });
        return result;
    },
    setCurrent: (channel: IChannel) => async (dispatch, getState: () => ApplicationState) => {
        await batch(async () => {
            await dispatch({ type: Actions.SetCurrentData, payload: channel });
        });
    },
}