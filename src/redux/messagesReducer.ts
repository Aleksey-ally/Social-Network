import {chatGroupAPI} from "api/chat-group/chat-group.api";
import {Dispatch} from "redux";
import {dialogsAPI} from "api/dialogs/dialogs.api";
import {AppThunkDispatch} from "redux/reduxStore";
import {AllDialogsResponseType} from "api/dialogs/dialogs.types";
import {getUsers} from "redux/usersReducer";
import {UserType} from "api/users/users.types";
import {usersAPI} from "api/users/users.api";

const RECEIVED_ALL_DIALOGS = "RECEIVED-ALL-DIALOGS"
const RECEIVED_DATA_GROUP_CHAT = "RECEIVED-DATA-GROUP-CHAT";
const DELETED_DATA_GROUP_CHAT = "DELETED-DATA-GROUP-CHAT";
const ADD_MESSAGE_DIALOG = "ADD-MESSAGE-DIALOG";
const ADD_MESSAGE_GROUP = "ADD-MESSAGE-GROUP";
const CHANGE_MESSAGE_TEXT_DIALOG = "CHANGE-MESSAGE-TEXT-DIALOG";
const CHANGE_MESSAGE_TEXT_GROUP = "CHANGE-MESSAGE-TEXT-GROUP";
const RECEIVED_DIALOGS_DATA = "RECEIVED-DIALOGS-DATA";
const CHANGE_SEARCH_TEXT = "CHANGE-SEARCH-TEXT";
const SET_CURRENT_PAGE_MESSAGES_FRIENDS = "SET-CURRENT-PAGE-MESSAGES-FRIENDS"
const SET_PAGE_SIZE_MESSAGES_FRIENDS = "SET-PAGE-SIZE-MESSAGES-FRIENDS"
const SET_FRIENDS_DIALOGS = "SET-FRIENDS-DIALOGS"


export type MessagesDataType = {
    allDialogs: AllDialogsResponseType;
    dialogsData: DialogDataType[];
    groupChatData: GroupChatDataType[];
    messageTextDialog: string;
    messageTextGroup: string;
    searchText: string;
    pageSize: number;
    currentPage: number;
    friendsDialogs: UserType[],
};

export type GroupChatDataType = {
    userId: number;
    userName: string;
    message: string;
    photo: string;
}

export type DialogDataType = {
    id: string;
    body: string;
    addedAt: string;
    senderId: number;
    senderName: string;
    recipientId: number;
    viewed: boolean;
};

const initialState: MessagesDataType = {
    allDialogs: [],
    dialogsData: [],
    groupChatData: [],
    messageTextDialog: "",
    messageTextGroup: "",
    searchText: "",
    pageSize: 5,
    currentPage: 1,
    friendsDialogs: []
};

export type ActionType =
    | ChangeMessageTextDialogType
    | AddMessageDialogType
    | ReceivedGroupChatData
    | DeletedGroupChatData
    | ReceivedDialogsData
    | ChangeMessageTextGroupType
    | AddMessageGroupType
    | ReceivedAllDialogs
    | ChangeSearchText
    | SetPageSizeMessagesFriends
    | SetCurrentPageMessagesFriends
    | SetFriendsDialogs


export const messagesReducer = (state = initialState, action: ActionType): MessagesDataType => {

    switch (action.type) {
        case RECEIVED_ALL_DIALOGS:
            return {...state, allDialogs: action.data};

        case RECEIVED_DIALOGS_DATA:
            return {...state, dialogsData: action.data}

        case RECEIVED_DATA_GROUP_CHAT :
            return {...state, groupChatData: [...state.groupChatData, ...action.data]};

        case DELETED_DATA_GROUP_CHAT :
            return {...state, groupChatData: []}

        case CHANGE_MESSAGE_TEXT_DIALOG:
            return {...state, messageTextDialog: action.newText}

        case CHANGE_MESSAGE_TEXT_GROUP:
            return {...state, messageTextGroup: action.newText}

        case ADD_MESSAGE_DIALOG:
            if (state.messageTextDialog.trim() !== "") {
                return {
                    ...state, messageTextDialog: ""
                }
            }
            return state

        case ADD_MESSAGE_GROUP:
            if (state.messageTextGroup.trim() !== "") {
                return {
                    ...state, messageTextGroup: "",
                }
            }
            return state

        case CHANGE_SEARCH_TEXT:
            return {...state, searchText: action.newText}

        case SET_PAGE_SIZE_MESSAGES_FRIENDS:
            return {...state, pageSize: action.pageSize}

        case SET_CURRENT_PAGE_MESSAGES_FRIENDS:
            return {...state, pageSize: action.currentPage}

        case SET_FRIENDS_DIALOGS : {
            return {...state, friendsDialogs: action.friends}
        }

        default:
            return state;
    }
};

type ReceivedAllDialogs = ReturnType<typeof receivedAllDialogs>;
type ReceivedGroupChatData = ReturnType<typeof receivedGroupChatData>;
type DeletedGroupChatData = ReturnType<typeof deletedGroupChatData>;
type AddMessageDialogType = ReturnType<typeof addMessageDialog>;
type AddMessageGroupType = ReturnType<typeof addMessageGroup>;
type ChangeMessageTextDialogType = ReturnType<typeof changeMessageTextDialog>;
type ChangeMessageTextGroupType = ReturnType<typeof changeMessageTextGroup>;
type ReceivedDialogsData = ReturnType<typeof receivedDialogsData>;
type ChangeSearchText = ReturnType<typeof changeSearchText>;
type SetPageSizeMessagesFriends = ReturnType<typeof setPageSizeMessagesFriends>;
type SetCurrentPageMessagesFriends = ReturnType<typeof setCurrentPageMessagesFriends>;
type SetFriendsDialogs = ReturnType<typeof setFriendsDialogs>


//AC
export const receivedAllDialogs = (data: AllDialogsResponseType) =>
    ({
        type: RECEIVED_ALL_DIALOGS,
        data
    } as const)

export const receivedGroupChatData = (data: GroupChatDataType[]) =>
    ({
        type: RECEIVED_DATA_GROUP_CHAT,
        data
    } as const)

export const deletedGroupChatData = () =>
    ({
        type: DELETED_DATA_GROUP_CHAT
    } as const)

export const receivedDialogsData = (data: DialogDataType[]) =>
    ({
        type: RECEIVED_DIALOGS_DATA,
        data
    } as const)

export const addMessageDialog = () => ({type: ADD_MESSAGE_DIALOG} as const);
export const addMessageGroup = () => ({type: ADD_MESSAGE_GROUP} as const);

export const changeMessageTextDialog = (newText: string) =>
    ({
        type: CHANGE_MESSAGE_TEXT_DIALOG,
        newText,
    } as const);

export const changeMessageTextGroup = (newText: string) =>
    ({
        type: CHANGE_MESSAGE_TEXT_GROUP,
        newText,
    } as const);

export const changeSearchText = (newText: string) =>
    ({
        type: CHANGE_SEARCH_TEXT,
        newText
    } as const)

export const setPageSizeMessagesFriends = (pageSize: number) =>
    ({
        type: SET_PAGE_SIZE_MESSAGES_FRIENDS,
        pageSize
    } as const)

export const setCurrentPageMessagesFriends = (currentPage: number) =>
    ({
        type: SET_CURRENT_PAGE_MESSAGES_FRIENDS,
        currentPage
    } as const)

export const setFriendsDialogs = (friends: UserType[]) => ({
    type: SET_FRIENDS_DIALOGS,
    friends
} as const)

//Thunks
export const getDialogData = (uID: number, page: number, count: number) => async (dispatch: Dispatch) => {
    const res = await dialogsAPI.getUserDialog(uID, page, count)
    dispatch(receivedDialogsData(res))
}

export const sendMessageDialog = (uID: number, message: string) => async (dispatch: AppThunkDispatch) => {
    await dialogsAPI.sendMessage(uID, message)
    dispatch(addMessageDialog())
    await dispatch(getDialogData(uID, 1, 20))
}

export const createConnectionGroupChat = () => (dispatch: Dispatch) => {
    chatGroupAPI.createConnection()

    chatGroupAPI.subscribe((data) => {
        dispatch(receivedGroupChatData(data))
    })
}

export const destroyConnectionGroupChat = () => (dispatch: Dispatch) => {
    chatGroupAPI.destroyConnection()
    dispatch(deletedGroupChatData())

}

export const sendMessageGroupChat = (message: string) => (dispatch: Dispatch) => {
    if (message.trim().length < 1) return
    chatGroupAPI.sendMessage(message)
    dispatch(addMessageGroup())
}

export const getAllDialogs = () => async (dispatch: AppThunkDispatch) => {
    const res = await dispatch(dialogsAPI.getAllDialogs)
    dispatch(receivedAllDialogs(res))
}

export const searchFriendByName = (pageSize: number, currentPage: number, text: string) => async (dispatch: AppThunkDispatch) => {
    await dispatch(getUsers(pageSize, currentPage, true, text))
}

export const getFriendsDialogs = (pageSize: number, currentPage: number, friend: boolean) => async (dispatch: AppThunkDispatch) => {
    const res = await usersAPI.getUsers(pageSize, currentPage, friend);
    dispatch(setFriendsDialogs(res.items))
}