<template>
  <div>
    <h2>Translation Connector</h2>
    <div v-if="loading" class="form__loader">Loading...</div>
    <div v-if="!loading && isDefaultLanguage">
      <div class="option__list">
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
      <div v-if="hasTranslationStarted() && !hasTranslationFinished()">
        <h4>Translation seem stuck?</h4>
        <p>
          <button
            class="btn btn--secondary"
            @click="resubmit()"
            :disabled="resubmitInProgress"
          >
            Resubmit any unfinished translation requests
          </button>
        </p>
      </div>
      <div v-if="message">
        {{ message }}
      </div>
      <div v-if="element.config.debug" class="form__message">
        <h3>Debug values</h3>
        <p>Saved value:</p>
        <pre>{{ savedValue }}</pre>
      </div>
    </div>
    <div v-if="!loading && !isDefaultLanguage">
      <p>You can only manage translation from the default language.</p>
    </div>
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
    availableLanguages: [],
    message: "",
    resubmitInProgress: false
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
    },
    isDefaultLanguage: function () {
      return this.context.variant.id === "00000000-0000-0000-0000-000000000000"
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
      if (!lang) return {
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
    resubmit: function () {
      this.element.disabled = true
      this.resubmitInProgress = true
      const nextLanguageId = this.getNextLanguageId()
      const workflowId = this.element.config.pendingWorkflowStepId
      const url = `https://manage.kontent.ai/v2/projects/${this.context.projectId}/items/${this.context.item.id}/variants/${nextLanguageId}/workflow/${workflowId}`
      axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${this.element.config.cmApiKey}`
        }
      }).then(() => {
        this.message = "Resubmission successful."
      })
    },
    getNextLanguageId: function () {
      const language = this.selectedLanguages.find(l => !l.completed)
      return language ? language.id : null
    },
    hasTranslationStarted: function () {
      return this.selectedLanguages.filter(l => l.started !== null).length > 0
    },
    hasTranslationFinished: function () {
      return this.selectedLanguages.filter(l => l.completed === null).length === 0
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