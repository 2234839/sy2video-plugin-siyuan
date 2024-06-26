(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode("body.sy2video-plugin-siyuan > * {\r\n  visibility: hidden;\r\n}\r\n.sy2video-plugin-siyuan .block__popover .protyle-content {\r\n  position: fixed;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform-origin: center center; /* 设置缩放的基点 */\r\n  transform: translate(-50%, -50%) scale(var(--scale-factor));\r\n  visibility: visible;\r\n  overflow: visible;\r\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const { fetchSyncPost } = require("siyuan");
async function request(url, data) {
  let response = await fetchSyncPost(url, data);
  let res = response.code === 0 ? response.data : null;
  return res;
}
async function upload(assetsDirPath, files) {
  let form = new FormData();
  form.append("assetsDirPath", assetsDirPath);
  for (let file of files) {
    form.append("file[]", file);
  }
  let url = "/api/asset/upload";
  return request(url, form);
}
async function appendBlock(dataType, data, parentID) {
  let payload = {
    dataType,
    data,
    parentID
  };
  let url = "/api/block/appendBlock";
  return request(url, payload);
}
function chatTTS(...arg) {
  const [apiURL, data] = arg.length == 2 ? [arg[0], arg[1]] : ["http://127.0.0.1:9966/tts", arg[0]];
  const par = Object.assign(
    {
      text: "",
      prompt: "",
      voice: "11.csv",
      speed: 5,
      temperature: 0.3,
      top_p: 0.7,
      top_k: 20,
      refine_max_new_token: 384,
      infer_max_new_token: 2048,
      text_seed: 42,
      skip_refine: 0,
      custom_voice: 0
    },
    data
  );
  const from = new FormData();
  Object.entries(par).forEach(([key, value]) => {
    from.append(key, String(value));
  });
  return fetch(apiURL, {
    body: from,
    method: "POST"
  }).then((r) => r.json());
}
const { Plugin } = require("siyuan");
class SiyuanPlugin extends Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "onunloadFn", []);
  }
  // 在 unload 时执行注册的函数
  addUnloadFn(fn) {
    this.onunloadFn.push(fn);
  }
  onunload() {
    this.onunloadFn.forEach((fn) => fn());
  }
}
const classFlag = `sy2video-plugin-siyuan`;
class sy2video extends SiyuanPlugin {
  async onLayoutReady() {
    var _a;
    {
      const urlParams = new URLSearchParams(window.location.search);
      const blockId = urlParams.getAll("block_id");
      const block_show = urlParams.get("block_show");
      if (block_show && blockId) {
        this.addFloatLayer({
          x: 0,
          y: 0,
          ids: [...blockId]
        });
        const el = window.siyuan.blockPanels[0].element;
        (_a = el.querySelector(`[data-type="pin"]`)) == null ? void 0 : _a.click();
        setTimeout(() => {
          const contentEL = el.querySelector(`.protyle-content`);
          const rate_w = window.innerWidth / contentEL.getBoundingClientRect().width;
          const rate_h = window.innerHeight / contentEL.getBoundingClientRect().height;
          const rate = rate_h < rate_w ? rate_h : rate_w;
          contentEL.style.setProperty("--scale-factor", String(rate));
        }, 5e3);
        document.body.classList.add(classFlag);
        this.onunloadFn.push(() => {
          document.body.classList.remove(classFlag);
        });
      }
    }
    this.eventBus.on("click-blockicon", (event) => {
      window.siyuan.menus.menu.addItem({
        label: "转音频",
        icon: ``,
        click: () => {
          const el = event.detail.blockElements[0];
          const id = el.dataset.nodeId;
          const text = el.textContent;
          this.ttsInsert(id, text);
        }
      });
    });
  }
  async ttsInsert(id, text) {
    const res = await chatTTS({
      text
    });
    const res2 = await fetch(res.audio_files[0].url).then((response) => response.blob()).then((blob) => {
      return upload("/assets/", [
        new File(
          [blob],
          `${Date.now()}-${Math.random().toString(36).slice(2)}.${res.audio_files[0].url.split(".").pop()}`
        )
      ]);
    });
    const assets = Object.entries(res2.succMap);
    await Promise.all(
      assets.map(([_, assertName]) => {
        return appendBlock(
          "markdown",
          `<audio controls="controls" src="${assertName}" data-src="${assertName}"></audio>`,
          id
        );
      })
    );
  }
}
module.exports = sy2video;
//# sourceMappingURL=index.js.map
