console.log('test....00');
(async () => {
    const elementParser = {
        '#text': (element) => {
            console.log('parse text element...');
            return [{
                type: 'text',
                data: {
                    text: element.textContent
                }
            }];
        },
        'DIV': (element) => {
            console.log('parse div element...');
            const eles = [];
            for (const ele in element.childNodes)
            {
                if (elementParser[ele.nodeName])
                {
                    eles.push(...elementParser[ele.nodeName](ele));
                }
            }
            return eles;
        }
    };
    const getMsgElements = () => {
        const eles = [];
        const htmls = document.getElementById('msg-elements');
        for (const ele of htmls.childNodes)
        {
            if (elementParser[ele.nodeName])
            {
                eles.push(...elementParser[ele.nodeName](ele));
            }
        }
        return eles;
    };
    const sendBtn = document.getElementById('send-msg');
    sendBtn.onclick = async () => {
        console.log('发送文字');
        const msgElements = getMsgElements();
        await sendToWSServer('send_message', {
            detail_type: 'group',
            group_id: parseInt(groupCode),
            message: msgElements,
        });
        const htmls = document.getElementById('msg-elements');
        htmls.innerHTML = '';
    };
})();