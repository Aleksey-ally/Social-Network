import React, {forwardRef, memo, useState} from "react";
import s from 'pages/Messages/Messages.module.scss';
import {MessagesDataType} from "redux/messagesReducer";
import {TextField} from "components/TextField";
import {TabSwitcher, TabSwitcherContent} from "components/TabSwitcher";
import {Avatar} from "components/Avatar";
import {UserItem} from "components/UserItem";
import IN from 'assets/imgs/IN.png'
import {Typography} from "components/Typography";
import {Chat, SendMessageType} from "./Chat";
import {DataActiveUserDialogType, DisplayChat} from "pages/Messages/MessagesContainer";
import {Conversation} from "assets/icons";
import {UserType} from "api/users/users.types";
import {useTranslation} from "react-i18next";

export type MessagesPropsType = {
    friendsDialogs: UserType[]
    messagesData: MessagesDataType
    dispatchNewTextGroup?: (e: string) => void
    dispatchNewTextDialog?: (e: string) => void
    sendMessageGroupChat: () => void
    sendMessageDialog: (uID: number, message: string) => void
    currentUserId: number | null
    displayChat: DisplayChat
    toggleDisplayChat: (key: keyof DisplayChat, toggle: boolean) => void
    setDisplayFriends: (toggle: boolean) => void
    handleOnScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void
    handleGetDialogData: (uID: number, page: number, count: number, name: string, photo: string | null) => void
    dataActiveUserDialog?: DataActiveUserDialogType
    searchFriendByName: (text: string) => void
}

export const Messages = memo(forwardRef(({
                                             friendsDialogs,
                                             messagesData,
                                             dispatchNewTextGroup,
                                             sendMessageGroupChat,
                                             sendMessageDialog,
                                             currentUserId,
                                             displayChat,
                                             toggleDisplayChat,
                                             handleOnScroll,
                                             handleGetDialogData,
                                             dataActiveUserDialog,
                                             dispatchNewTextDialog,
                                             setDisplayFriends,
                                             searchFriendByName
                                         }: MessagesPropsType, ref: React.ForwardedRef<HTMLDivElement>) => {


    const [tabsValue, setTabsValue] = useState<string>()

    const handleDisplayFriends = (value: string) => {
        setTabsValue(value)

        if (value === 'Friends') {
            setDisplayFriends(true)
        } else {
            setDisplayFriends(false)
        }
        return
    }

    const {t} = useTranslation();

    const tabs = [
        {title: t('messagesPage.messages'), value: 'Messages'},
        {title: t('messagesPage.friends'), value: 'Friends'},
        {title: t('messagesPage.groups'), value: 'Groups'}
    ]

    return (
        <div className={s.messages}>
            <div className={s.sidebar}>
                <div className={s.tabs}>
                    <TabSwitcher tabs={tabs} value={tabsValue} defaultValue={'Messages'}
                                 onValueChange={handleDisplayFriends}>
                        <TabSwitcherContent className={s.sidebarContent} value={'Messages'}>
                            <div className={s.sidebarContentItem}>
                                {messagesData.allDialogs.map(d => (
                                    <UserItem key={d.id} className={`${s.userItem} ${d.hasNewMessages && s.unread}`}
                                              id={d.id}
                                              name={d.userName}
                                              photos={d.photos} userAvatar={'small'}
                                              handleGetDialogData={handleGetDialogData}/>

                                ))}
                            </div>

                        </TabSwitcherContent>
                        <TabSwitcherContent className={s.sidebarContent} value={'Friends'}>
                            <div className={s.sidebarContentItem}>
                                <div className={s.search}>
                                    <TextField placeholder={t('messagesPage.labelSearch')} type={'text'} isSearch
                                               value={messagesData.searchText} onValueChange={searchFriendByName}/>
                                </div>
                                {friendsDialogs.map(u => (
                                    <UserItem className={s.userItem} key={u.id} id={u.id}
                                              photos={u.photos} name={u.name}
                                              status={u.status} userAvatar={'small'}
                                              handleGetDialogData={handleGetDialogData}/>
                                ))}
                            </div>
                        </TabSwitcherContent>
                        <TabSwitcherContent className={s.sidebarContent} value={'Groups'}>
                            <div className={s.sidebarContentItem}>
                                {<div className={s.groupItem} onClick={() => {
                                    toggleDisplayChat("displayGroupChat", true)
                                }}>
                                    <div className={s.groupInfo}>
                                        <Avatar className={s.groupAvatar} size={'small'} photo={IN}/>
                                        <div className={s.description}>
                                            <Typography className={`${s.item} ${s.name}`} as={'h5'}
                                                        variant={'h5'}>IT-Incubator Chat</Typography>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </TabSwitcherContent>
                    </TabSwitcher>
                </div>
            </div>

            <div className={`${s.empty} ${!displayChat.displayEmpty && s.noDisplay}`}>
                <Conversation/>
                <span>{t('messagesPage.selectChat')}</span>
            </div>
            <div className={s.chatWrapper}>
                {displayChat.displayGroupChat &&
                    <Chat ref={ref} chatData={messagesData.groupChatData} messageText={messagesData.messageTextGroup}
                          sendMessage={sendMessageGroupChat} dispatchNewTextInput={dispatchNewTextGroup}
                          currentUserId={currentUserId} handleOnScroll={handleOnScroll} chatName={'IT-Incubator Chat'}
                          chatPhoto={IN} setDisplayChat={() => toggleDisplayChat("displayGroupChat", false)}/>}

                {displayChat.displayUserChat &&
                    <Chat ref={ref} dialogData={messagesData.dialogsData} currentUserId={currentUserId}
                          messageText={messagesData.messageTextDialog}
                          sendMessage={sendMessageDialog as SendMessageType}
                          dispatchNewTextInput={dispatchNewTextDialog} handleOnScroll={handleOnScroll}
                          chatName={dataActiveUserDialog?.name}
                          setDisplayChat={() => toggleDisplayChat("displayUserChat", false)}
                          chatPhoto={dataActiveUserDialog?.photo} chatUserId={dataActiveUserDialog?.uID}

                    />}
            </div>

        </div>
    )
}))
