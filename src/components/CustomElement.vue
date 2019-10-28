<template>
  <div>
    <div v-if="!loaded">
      Custom element not loaded. (Not in an iFrame?)
    </div>
    <slot v-else :context="context" :element="element" />
    <ResizeObserver @notify="$CustomElementApi.updateSize" />
  </div>
</template>

<script>
export default {
  data: () => ({
    loaded: false,
    element: {
      value: null,
      disabled: true,
      config: {
        debugIsEnabled: false
      }
    },
    context: {}
  }),
  mounted: function () {
    // Perform init of Kentico CLoud Custom Element code

    this.$CustomElementApi.init((element, context) => {
      // Map element and context details to local state
      this.element = element
      this.context = context
      this.$CustomElementApi.updateSize()
      this.$CustomElementApi.onDisabledChanged(this.handleDisabledChanged)
      this.loaded = true
    })
  },
  methods: {
    handleDisabledChanged (disabledState) {
      this.element.disabled = disabledState
    }
  }
}
</script>