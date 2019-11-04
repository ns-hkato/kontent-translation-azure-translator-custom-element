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
        <template v-if="language.is_active && !language.is_default">
          <label
            :class="getOptionClasses(language.id)"
            @click="
              toggleLanguage(language.id, language.codename, language.name)
            "
          >
            <span class="option__label">{{ language.name }}</span>
          </label>
          <span :class="getStatusClasses(language.id)">{{
            getStatusText(language.id)
          }}</span>
        </template>
      </div>
    </div>
    <pre>
      {{ savedValue }}
    </pre>
  </div>
</template>

<script>
import axios from 'axios';
import { formatDistance } from 'date-fns'

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
      const selectedClass = this.selectedLanguages.filter(l => l.id === id).length > 0 ? 'option--is-selected' : ''
      const disabledClass = this.element.disabled ? 'option--is-disabled' : ''
      return `${baseClasses} ${selectedClass} ${disabledClass}`;
    },
    toggleLanguage (id, codename, name) {
      if (!this.element.disabled) {
        if (this.selectedLanguages.filter(l => l.id === id).length > 0) {
          this.selectedLanguages = this.selectedLanguages.filter(selected => selected.id !== id)
        } else {
          this.selectedLanguages.push({ id, codename, name, started: null, completed: null })
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
      }).then(response => {
        this.availableLanguages = response.data
        this.loading = false
      })
    },
    getStatusClasses: function (id) {
      const status = this.getLanguageStatus(id);
      return status.classes;
    },
    getStatusText: function (id) {
      const status = this.getLanguageStatus(id);
      return status.text;
    },
    getLanguageStatus: function (id) {
      const lang = this.selectedLanguages.find(l => l.id === id)
      if(!lang) return {
        classes: `item-status item-status--failed`,
        text: `Not selected`
      }

        const wasStarted = !!lang.started
      const wasCompleted = !!lang.completed
      const isDone = wasStarted && wasCompleted

      if (isDone) return {
        classes: `item-status item-status--is-successful`,
        text: `Completed ${formatDistance(new Date(lang.started), new Date(), { addSuffix: true })}`
      }

      if (wasStarted) return {
        classes: `item-status`,
        text: `Started ${formatDistance(new Date(lang.started), new Date(), { addSuffix: true })}`
      }

      return {
        classes: `item-status item-status--is-missing`,
        text: `Not started`
      }
    },
  },
  watch: {
    savedValue: function () {
      this.element.value = JSON.stringify(this.savedValue);
      this.$CustomElementApi.setValue(this.element.value)
    }
  }
}
</script>