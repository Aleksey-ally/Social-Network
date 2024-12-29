import {useSelector} from "react-redux";
import {
    changeMessageTextDialog,
    changeMessageTextGroup,
    changeSearchText,
    createConnectionGroupChat,
    destroyConnectionGroupChat,
    getAllDialogs,
    getDialogData,
    getFriendsDialogs,
    MessagesDataType,
    searchFriendByName,
    sendMessageDialog,
    sendMessageGroupChat
} from "redux/messagesReducer";
import {ReducersType, useAppDispatch} from "redux/reduxStore";
import {Messages} from "./Messages";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {errorOptions} from "utils/ToastifyOptions/ToastifyOptions";
import {useDebounce} from "utils/useDebounce";
import {Preloader} from "components/Preloader";
import {setFetching} from "redux/appReducer";
import {UserType} from "api/users/users.types";

export type DataActiveUserDialogType = {
    uID: number, name: string, photo?: string | null
}

export type DisplayChat = {
    displayGroupChat: boolean
    displayUserChat: boolean
    displayEmpty: boolean
}

export const MessagesContainer = () => {
    const dispatch = useAppDispatch()
    const isFetching = useSelector<ReducersType, boolean>(state => state.app.isFetching)

    const messagesData = useSelector<ReducersType, MessagesDataType>(state => state.messagesData)
    const friendsDialogs = useSelector<ReducersType, UserType[]>(state => state.messagesData.friendsDialogs)
    const currentUserId = useSelector<ReducersType, number | null>(state => state.auth.id)

    const debounceSearchText = useDebounce(messagesData.searchText)

    const [displayChat, setDisplayChat] = useState<DisplayChat>({
        displayGroupChat: false,
        displayUserChat: false,
        displayEmpty: true,
    })
    const [displayFriends, setDisplayFriends] = useState<boolean>(false)
    const [isAutoScrollActive, setIsAutoScrollActive] = useState<boolean>(true)
    const [dataActiveUserDialog, setDataActiveUserDialog] = useState<DataActiveUserDialogType>()

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    const toggleDisplayChat = (key: keyof typeof displayChat, toggle: boolean) => {
        setDisplayChat((prev) => {
            const updatedState = Object.keys(prev).reduce((acc, k) => {
                acc[k as keyof typeof displayChat] = k === key ? toggle : false;
                return acc;
            }, {} as typeof displayChat);


            const otherKeysFalse =
                !updatedState.displayGroupChat &&
                !updatedState.displayUserChat;

            if (otherKeysFalse) {
                updatedState.displayEmpty = true;
            }

            return updatedState;
        })
    };

    const dispatchNewTextDialog = (e: string) => {
        dispatch(changeMessageTextDialog(e))
    }

    const sendMessageDialogHandler = (uID: number, message: string) => {
        dispatch(sendMessageDialog(uID, message))
            .catch(() => {
                toast.error('Error when sending message', errorOptions)
            })
    }

    const handleSearchFriendByName = (text: string) => {
        dispatch(changeSearchText(text))
    }

    const dispatchNewTextGroup = (e: string) => {
        dispatch(changeMessageTextGroup(e))
    }
    const sendMessageGroupChatHandler = () => {
        dispatch(sendMessageGroupChat(messagesData.messageTextGroup))
    }

    const createConnectionGroupChatHandler = () => {
        dispatch(createConnectionGroupChat())
    }

    const handleOnScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        const maxScrollPosition = element.scrollHeight - element.clientHeight;

        // Проверяем, находится ли пользователь у нижней границы скролла
        const isNearBottom = Math.abs(maxScrollPosition - element.scrollTop) < 10;

        if (isNearBottom) {
            setIsAutoScrollActive(true); // Включаем автоскролл, если пользователь у конца
        } else {
            setIsAutoScrollActive(false); // Отключаем, если пользователь прокручивает вверх
        }
    }

    const handleGetDialogData = (uID: number, page: number, count: number, name: string, photo: string | null) => {
        setIsAutoScrollActive(false)

        dispatch(getDialogData(uID, page, count))
            .then(() => {
                setDataActiveUserDialog({uID, name, photo})
                toggleDisplayChat('displayUserChat', true)
                setIsAutoScrollActive(true)
            })

    }

    useEffect(() => {
        if (!displayFriends) return
        (async () => {
            try {
                await dispatch(getFriendsDialogs(messagesData.pageSize, messagesData.currentPage, true))
            } catch {
                toast.error('Error when receiving messages data', errorOptions)
            }
        })()
    }, [displayFriends]);

    useEffect(() => {
        if (!displayChat.displayGroupChat) return

        (async () => {
            try {
                createConnectionGroupChatHandler()

            } catch {
                toast.error('Error when receiving messages data', errorOptions)
            }
        })()

        return () => {
            dispatch(destroyConnectionGroupChat())
        }
    }, [displayChat.displayGroupChat])

    useEffect(() => {
        (async () => {
            try {
                dispatch(setFetching(true))
                await dispatch(getAllDialogs())
            } catch {
                toast.error('Error when receiving all dialogs data', errorOptions)
            } finally {
                dispatch(setFetching(false))
            }
        })()
    }, []);

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView()
        }
    }, [isAutoScrollActive, messagesData.groupChatData, messagesData.dialogsData]);

    useEffect(() => {
        dispatch(searchFriendByName(messagesData.pageSize, messagesData.currentPage, debounceSearchText.trim()))
            .catch(() => {
                toast.error('Error when searching friends', errorOptions)
            })

    }, [debounceSearchText, dispatch]);


    useEffect(() => {
        // dialogsAPI.refreshDialog(2)
        // dialogsAPI.getAllDialogs()
        // dialogsAPI.getUserDialog(2,1, 10)
        // dialogsAPI.sendMessage(2, 'Hello')
        // dialogsAPI.checkIsViewedMessage('3a625288-c91c-420b-b907-f1a0f55cef40')
        // dialogsAPI.spamMessage("3a625288-c91c-420b-b907-f1a0f55cef40")
        // dialogsAPI.deleteMessage('4d2328cb-d28a-4b38-82ba-a6d2a211f4c4')
        // dialogsAPI.restoreMessage('4d2328cb-d28a-4b38-82ba-a6d2a211f4c4')
        // const dialogsAPI = new Date().toLocaleString('ru-Ru')
        //  dialogsAPI.getNewestThanDateUserMessages(2, "2024-12-10T08:55:02.873")
        //  dialogsAPI.getCountNewMessages()

    }, []);

    return <>
        {isFetching ? <Preloader/> :
            <Messages ref={messagesAnchorRef} friendsDialogs={friendsDialogs} messagesData={messagesData}
                      dispatchNewTextGroup={dispatchNewTextGroup}
                      sendMessageGroupChat={sendMessageGroupChatHandler}
                      currentUserId={currentUserId}
                      displayChat={displayChat}
                      toggleDisplayChat={toggleDisplayChat}
                      handleOnScroll={handleOnScroll}
                      setDisplayFriends={setDisplayFriends}
                      handleGetDialogData={handleGetDialogData}
                      dataActiveUserDialog={dataActiveUserDialog}
                      dispatchNewTextDialog={dispatchNewTextDialog}
                      sendMessageDialog={sendMessageDialogHandler}
                      searchFriendByName={handleSearchFriendByName}
            />}
    </>
}