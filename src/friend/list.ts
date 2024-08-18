import { useLogger } from "../common/log";
import { useWSServer } from "../server/websocket";

const log = useLogger('Friend');

export const getFriendList = async () => {
    const { send } = useWSServer();
    const friendList = await send('get_friend_list', {});
    log.info('friend list:', friendList);
};