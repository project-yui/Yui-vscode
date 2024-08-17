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
    // console.log('tag name:', node.tagName);
    return node.tagName === 'SCRIPT';
}
const container = document.getElementById('container');
(async () => {
    const html = await HTTP.get(window.pageSrc);
    container.innerHTML = html.response;
    nodeScriptReplace(container.firstElementChild);
})();