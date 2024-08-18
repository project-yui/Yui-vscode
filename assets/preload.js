const HTTP = {
  get(url, headers = {}) {
    return new Promise((resolve, reject) => {
      const Http = new XMLHttpRequest();
      Http.timeout = 10000;
      Http.open("GET", url);
      if (headers) {
        for (let key in headers) {
          Http.setRequestHeader(key, headers[key]);
        }
      }
      Http.send();
      Http.onloadend = (e) => {
        resolve(Http);
      };
      Http.onerror = (e) => reject;
    });
  },
  /**
   *
   * @param {string} url 访问的URL
   * @param {string | null} body 请求体
   * @param headers
   * @return {Promise<XMLHttpRequest>}
   */
  post(url, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const Http = new XMLHttpRequest();
      Http.timeout = 5000;
      Http.open("POST", url);
      if (headers) {
        for (let key in headers) {
          Http.setRequestHeader(key, headers[key]);
        }
      }
      Http.send(body);
      Http.onloadend = (e) => {
        resolve(Http);
      };
      Http.onerror = (e) => reject;
    });
  },
};
function nodeScriptReplace(node) {
    if ( nodeScriptIs(node) === true ) {
            node.parentNode.replaceChild( nodeScriptClone(node) , node );
    }
    else {
            var i = -1, children = node.childNodes;
            while ( ++i < children.length ) {
                  nodeScriptReplace( children[i] );
            }
    }

    return node;
}
function nodeScriptClone(node){
    var script  = document.createElement("script");
    script.text = node.innerHTML;

    var i = -1, attrs = node.attributes, attr;
    while ( ++i < attrs.length ) {                                    
          script.setAttribute( (attr = attrs[i]).name, attr.value );
    }
    return script;
}

function nodeScriptIs(node) {
    console.log('tag name:', node.tagName);
    return node.tagName === 'SCRIPT';
}
const container = document.getElementById('container');
(async () => {
    const html = await HTTP.get(window.pageSrc);
    container.innerHTML = html.response;
    nodeScriptReplace(container.firstElementChild);
})();

// function getUuid () {
//   if (typeof crypto === 'object') {
//     if (typeof crypto.randomUUID === 'function') {
//       return crypto.randomUUID();
//     }
//     if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
//       const callback = (c) => {
//         const num = Number(c);
//         return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
//       };
//       return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, callback);
//     }
//   }
//   let timestamp = new Date().getTime();
//   let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     let random = Math.random() * 16;
//     if (timestamp > 0) {
//       random = (timestamp + random) % 16 | 0;
//       timestamp = Math.floor(timestamp / 16);
//     } else {
//       random = (perforNow + random) % 16 | 0;
//       perforNow = Math.floor(perforNow / 16);
//     }
//     return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
//   });
// };

// const vscode = acquireVsCodeApi();
// const waitMap = new Map();
// window.addEventListener('message', event => {
//   const msg = event.data; // The JSON data our extension sent
//   if (!msg.id) {return;}
//   clearTimeout(waitMap[msg.id].timer);
//   waitMap[msg.id].callback(msg);
// });
// const sendToMain = async (data) => {
//   data.id = getUuid();
//   vscode.postMessage(data);
//   return new Promise((resolve, reject) => {
//     const t = setTimeout(() => {
//       delete waitMap[data.id];
//       reject(new Error('timeout'));
//     }, 30000);
//     waitMap[data.id] = {
//       callback: resolve,
//       reject,
//       timer: t,
//     };
//   });
// };