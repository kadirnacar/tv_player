import { ChannelState, reducer as channelReducer } from '../reducers/channels';
import { EditorState, reducer as editorReducer } from '../reducers/Editor';

export interface ApplicationState {
    session: any;
    Channels: ChannelState;
    Editor: EditorState;
}


export const reducers = {
    Channels: channelReducer,
    Editor: editorReducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}