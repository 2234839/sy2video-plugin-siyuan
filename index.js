(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode("body > * {\r\n  visibility: hidden;\r\n}\r\n.block__popover .protyle-content {\r\n  position: fixed;\r\n  top: 0px;\r\n  left: 0px;\r\n  visibility: visible;\r\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
"use strict";
const { Plugin } = require("siyuan");
class VitePlugin extends Plugin {
  async onLayoutReady() {
    var _a;
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
      await Promise.resolve().then(() => require("./view_block-Dyvby5gX.cjs"));
    }
  }
}
module.exports = VitePlugin;
//# sourceMappingURL=index.js.map
