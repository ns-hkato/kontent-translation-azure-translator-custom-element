<template>
  <div>
    <h2>Translate into:</h2>
    <div v-if="!loading" class="option__list">
      <div
        class="option__pane"
        v-for="language in availableLanguages.languages"
        :key="language.id"
      >
        <!-- <input class="option__input--hidden" /> -->
        <label
          v-if="language.is_active && ! language.is_default"
          :class="getOptionClasses(language.id)"
          @click="toggleLanguage(language.id, language.codename, language.name)"
        >
          <span class="option__label">{{ language.name }}</span>
        </label>
      </div>
    </div>
    <!-- <pre>
      {{ savedValue }}
    </pre> -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    loading: true,
    item: {},
    type: {},
    defaultVariant: {},
    selectedLanguages: [],
    availableLanguages: []
  }),
  props: {
    context: {
      type: Object,
      required: false
    },
    element: {
      type: Object,
      required: false
    },
  },
  created () {
    this.fetchLanguages()
  },
  mounted () {
    const value = JSON.parse(this.element.value)
    this.selectedLanguages = value.selectedLanguages
    // const cmApi = this.$ContentManagementApi.Client
    // cmApi.viewContentItem()
    //   .byItemId(this.context.item.id)
    //   .toPromise()
    //   .then(response=>{
    //     this.item = response.data
    //     cmApi.viewContentType()
    //       .byTypeId(this.item.type.id)
    //       .toPromise()
    //       .then(response => {
    //         this.type = response.data
    //       })
    //   })
    // cmApi.viewLanguageVariant()
    //   .byItemId(this.context.item.id)
    //   .byLanguageId("00000000-0000-0000-0000-000000000000")
    //   .toPromise()
    //   .then(response => {
    //     this.defaultVariant = response.data
    //   })
  },
  computed: {
    savedValue: function () {
      return {
        selectedLanguages: this.selectedLanguages
      }
    }
  },
  methods: {
    getOptionClasses: function (id) {
      const baseClasses = 'option option--is-checkbox'
      const selectedClass = this.selectedLanguages.filter(l=>l.id === id).length > 0 ? 'option--is-selected' : ''
      const disabledClass = this.element.disabled ? 'option--is-disabled' : ''
      return `${baseClasses} ${selectedClass} ${disabledClass}`;
    },
    toggleLanguage (id, codename, name) {
      if (!this.element.disabled) {
        if(this.selectedLanguages.filter(l=>l.id === id).length > 0) {
          this.selectedLanguages = this.selectedLanguages.filter(selected => selected.id !== id)
        } else {
          this.selectedLanguages.push({ id, codename, name, started: null, copmleted: null })
        }
      }
    },
    fetchLanguages () {
      this.loading = true
      const url = `https://manage.kontent.ai/v2/projects/${this.context.projectId}/languages`
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.element.config.cmApiKey}`
        }
      }).then(response=> {
        this.availableLanguages = response.data
        this.loading = false
      })
    }
  },
  watch: {
    savedValue: function () {
      this.element.value = JSON.stringify(this.savedValue);
      this.$CustomElementApi.setValue(this.element.value)
    }
  }
}
</script>