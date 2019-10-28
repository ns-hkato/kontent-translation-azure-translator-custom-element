// Declare that CustomElement is globally available (since it's added as a separate script)
/* global CustomElement */

export default {
  // eslint-disable-next-line no-unused-vars
  install(vue, options) {
    vue.prototype.$CustomElementApi = {
      ...CustomElement,
      updateSize() {
        vue.nextTick(function() {
          CustomElement.setHeight(document.body.offsetHeight)
        })
      },
    }
  }
}