<template>
  <div id="app">
    <CustomElement v-slot:default="customElementApi">
      <TranslationConnector :context="customElementApi.context" :element="customElementApi.element" />
    </CustomElement>
  </div>
</template>

<script>
import CustomElement from './components/CustomElement'
import TranslationConnector from './components/TranslationConnector'


export default {
  name: 'app',
  components: {
    CustomElement,
    TranslationConnector
  }
}
</script>

<style scoped>
#app {
  position: relative;
}
</style>
