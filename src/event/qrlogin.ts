import { useWSServer } from "../server/websocket";
import { useUserStore } from "../store/user";

export const onQrSuccess = () => {
    const { getServerEventHandle } = useWSServer();
    getServerEventHandle().on('qrcode_success', (resp) => {
        const { getAllAccount } = useUserStore();
        const account = getAllAccount();
        account[resp.data.uin] = {
            uin: resp.data.uin,
        };
    });
};