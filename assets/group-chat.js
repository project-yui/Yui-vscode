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
        'BR': (element) => {
            console.log('parse br element...');
            return [{
                type: 'text',
                data: {
                    text: '\n'
                }
            }];
        },
        'SPAN': (element) => {
            console.log('parse span element...', element.childNodes);
            const eles = [];
            for (const ele of element.childNodes)
            {
                if (elementParser[ele.nodeName])
                {
                    eles.push(...elementParser[ele.nodeName](ele));
                }
                else
                {
                    console.warn('not supported:', ele.nodeName);
                }
            }
            return eles;
        },
        'DIV': (element) => {
            console.log('parse div element...', element.childNodes);
            const eles = [];
            for (const ele of element.childNodes)
            {
                if (elementParser[ele.nodeName])
                {
                    eles.push(...elementParser[ele.nodeName](ele));
                }
                else
                {
                    console.warn('not supported:', ele.nodeName);
                }
            }
            eles.push({
                type: 'text',
                data: {
                    text: '\n'
                }
            });
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
            else
            {
                console.warn('not supported:', ele.nodeName);
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
(async () => {
    const htmls = document.getElementById('msg-elements');
    const renderElementMap = {
        text: async (data) => {
            data.text = data.text.replace(/ /g, '&nbsp;');
            data.text = data.text.replace(/\r\n/g, '\n');
            data.text = data.text.replace(/\n/g, '</span><br /><span class="ele-text">');
            return `<span class="ele-text">${data.text}</span>`.replace('<span class="ele-text"></span>', '');
        },
        image: async (data) => {
            if (data.pic.url && data.pic.url.startsWith('http'))
            {
                return `<img class="ele-image" src="${data.pic.url}" />`;
            }
            const ret = await sendToMain('get_url', {path: data.pic.path});
            return `<img class="ele-image" src="${ret}" />`;
        }
    };
    const renderElement = async (element) => {
        if (renderElementMap[element.type])
        {
            return await renderElementMap[element.type](element.data);
        }
        console.warn('不支持的元素类型:', element.type);
        return '';
    };
    htmls.onpaste = async (event) => {
         // 阻止默认粘贴行为
        event.preventDefault();
        const clipboard = (event.clipboardData || window.clipboardData);
        let clipboardData = clipboard.getData('text/html');
        if (!clipboardData)
        {
            clipboardData = clipboard.getData('text');
        }
        const msgs = await sendToWSServer('get_clipboard_msg', {});

        // 获取当前的光标位置
        const selection = window.getSelection();
        if (!selection.rangeCount) {return;}

        // 创建一个新的文本节点，插入修改后的内容
        selection.deleteFromDocument(); // 删除当前选中的内容

        console.log('clipboard msg:', msgs);
        let data = '';
        if (msgs.length > 0) {
            // 合成html
            console.log('使用NTQQ的消息元素合成');
            data = (await Promise.all(msgs.map(async e => await renderElement(e)))).join('');
        }
        else
        {
            console.log('使用剪贴板的html数据合成');
            // 获取剪贴板中的文本内容
            if (!clipboardData)
            {
                console.warn('clipboard empty!');
                return;
            }
            console.log('clipboardData:', clipboardData);
            // 对粘贴的内容进行修改，例如将所有字母转换为大写
            const modifiedData = clipboardData.replace(/\r|\n/g, '');

            data = modifiedData.match(/<!--StartFragment --><DIV>([\s\S]+)<\/DIV><!--EndFragment-->/);
            if (data === null)
            {
                console.log('math with second regex');
                data = modifiedData.match(/<!--StartFragment -->([\s\S]+)<!--EndFragment-->/);
            }
            if (data !== null && data.length > 1)
            {
                data = data[1];
            }
            else
            {
                data = modifiedData;
            }
            data = data.replace(/<br>/g, '<div><br></div>');
        }

        console.log('html:', data);
        const t = document.createElement('div');
        t.innerHTML = data;
        console.log('t:', t);
        let list = t.childNodes;
        if (list.length === 1 && list[0].nodeName === 'DIV')
        {
            list = list[0].childNodes;
        }
        const temp = document.createElement('div');
        temp.classList.add('temp');
        console.log('list:', list, list.length);
        for(const ele of list)
        {
            const l = ['STYLE', '#comment'];
            if (l.includes(ele.nodeName))
            {
                ele.remove();
            }
        }
        const last = list[list.length - 1];
        for (let i=list.length - 1; i >= 0; i--)
        {
            console.log('current ele:', list[i], list.length);
            
            // temp.append(list[i]);
            selection.getRangeAt(0).insertNode(list[i]);
        }
        console.log('last:', last);
        if (window.getSelection) {//ie11 10 9 ff safari
            console.log('window.getSelection');
            last.focus?.(); //解决ff不获取焦点无法定位问题
            var range = window.getSelection();//创建range
            // range.selectAllChildren(last);//range 选择obj下所有子内容
            range.collapseToEnd();//光标移至最后
        }
        else if (document.selection) {//ie10 9 8 7 6 5
            console.log('document.selection');
            var range = document.selection.createRange();//创建选择对象
            //var range = document.body.createTextRange();
            range.moveToElementText(last);//range定位到obj
            range.collapse(false);//光标移至最后
            range.select();
        }
    };
})();