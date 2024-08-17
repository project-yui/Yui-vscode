
/**
 * HTTP的GET请求
 * 
 * @param path api路径
 * @param param 参数
 */
const get = async <Resp>(path: string, param: Record<string, string>) => {

};

/**
 * HTTP的POST请求
 * 
 * @param path api路径
 * @param data 请求体
 * @param param 参数
 */
const post = async <Req, Resp>(path: string, data: Req, param: Record<string, string>) => {

};

export const useHttpServer = () => ({
    get,
    post
});