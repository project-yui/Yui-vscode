import WebSocket from 'ws';
import { BotActionRequest, BotActionResponse } from './types';
import { randomUUID } from 'crypto';
import EventEmitter from 'events';

let server: WebSocket | undefined = undefined;

interface WaitData {
    /**
     * 响应回调
     * 
     * @param data 响应数据
     * @returns 无
     */
    callback: (data: BotActionResponse) => void

    reject: (err: Error) => void
    /**
     * 超时计时器
     */
    timer: any
}

/**
 * 异步转同步
 */
const waitMap: Record<string, WaitData> = {};

const eventHandle = new EventEmitter();

/**
 * 收到消息处理
 * 
 * @param data 收到的消息
 */
const receive = (data: WebSocket.RawData) => {
    console.log('receive:', data.toString());
    let resp = JSON.parse(data.toString());
    if (!resp.id)
    {
        // event
        eventHandle.emit(resp.detail_type, resp);
        return;
    }
    if (!waitMap[resp.id]) {return;}
    const wait = waitMap[resp.id];
    clearTimeout(wait.timer);
    if (resp.retcode !== 0)
    {
        wait.reject(new Error(resp.message));
    }
    else
    {
        wait.callback(resp);
    }
};

const delay = async (time: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
};

/**
 * 发送websocket消息
 */
const send = async <Req, Resp>(action: string, params: Req) => {
    if (!server || server.readyState === WebSocket.CLOSED || server.readyState === WebSocket.CLOSING)
    {
        server = new WebSocket('ws://127.0.0.1:8080', {
            perMessageDeflate: false
        });
        server.on('message', receive);
    }
    for (let i = 0; i < 5; i++) {
        console.log('check...');
        if (server.readyState === WebSocket.OPEN)
        {
            break;
        }
        await delay(1000);
    }
    if (server.readyState !== WebSocket.OPEN)
    {
        throw new Error('not connected.');
    }
    let req: BotActionRequest<Req> = {
        id: randomUUID(),
        action: action,
        params: params
    };
    return new Promise<Resp>((resolve, reject) => {
        const t = setTimeout(() => {
            delete waitMap[req.id];
            reject('timeout');
        }, 30000);
        waitMap[req.id] = {
            callback: (resp: BotActionResponse<Resp>) => {
                resolve(resp.data);
            },
            reject,
            timer: t,
        };
        server?.send(JSON.stringify(req));
    });
};
const getServerEventHandle = () => {
    return eventHandle;
};

export const useWSServer = () => ({
    send,
    getServerEventHandle,
});