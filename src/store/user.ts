
interface UserInfo {
    uin: `${number}`
}
const userAccountData: Record<string, UserInfo> = {};

export const useUserStore = () => ({
    getAllAccount: () => userAccountData
});