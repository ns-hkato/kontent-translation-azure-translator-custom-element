# Kentico Kontent Custom Element: Azure Translator Text API Connector

This [custom element](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features) for [Kentico Kontent](https://kontent.ai) gives editors a way to configure and see the status of translations automated via the Azure Translator Text API. It's based on [VueJS](https://vuejs.org/) to enable more dynamic functionality and is intended for use with its [companion project for responding to Kontent webhooks](https://github.com/Kentico/kontent-translation-azure-translator-webhook-functions).

Features:

- Shows the languages configured for the project automatically
- Allows editors to see which languages have been processed by the translation connector, and which haven't
- Gives editors a button to re-trigger translation if it appears to have stalled
- The UI is only shown on the default language
- Started or completed translations tell the editor when this occured in a friendly format (e.g. "5 minutes ago")

## Quick testing

If you're interested in trying this out without deploying it yourself, you can use `https://kontent-translation-connector-custom-element.netlify.com/`. This is the deployed version of the master branch in this repo. **This should only be used for quick testing as it is subject to change**

## Deploying

First, fork this repo. You can use whatever build/deploy process you like. Netlify is a good option since you can easily connect it to your repo and do automatic builds if/when you modify the codebase. The main command to be aware of is `npm run build`. This will do a production build of the custom element. Once complete you can deploy the contents of the `dist` folder to anywhere you want. Keep in mind that Kentico Kontent requires that the URLs be publicly available and [served over HTTPS](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-2--secure-hosting).

## Configuring the Custom Element

As this custom element is meant to be used across multiple content types, you should [configure the custom element](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) inside a content snippet so you only have to configure it once.

The JSON parameters required for the component ar eas follows:

| Name | Value | Description |
| ---- | ----- | ----------- |
| debug | boolean | Turns on/off showing the saved value's JSON in the custom element |
| cmApiKey | string | This should be the project's CM API key. This is needed to load the languages dynamically and change the workflow step of variants if things get stuck |
| pendingWorkflowStepId | GUID | The GUID of the workflow step that triggers the translation connector. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint.

The full JSON will look something like this:

```json
{
    "debug": false,
    "cmApiKey": "<YOUR_API_KEY>",
    "pendingWorkflowStepId": "<YOUR_WORKFLOW_STEP_GUID>"
}
```

## Configuring Languages in Kontent

When configuring your languages in Kontent, the translation connector relies on the language codename matching one of the [language codes supported by Microsoft's Translator API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support)

## Developing

If you plan to customize the element for your own purposes or want to contribute to this project, the table of commands below should help you get started:

| You want to: | Command |
| ------------ | ------- |
| Do project setup | `npm install` |
| Compile with hot-reloads for development | `npm run serve` |
| Compile and minify for production | `npm run build` |
| Lint and fix files | `npm run lint` |

The project is configured to run the development version over HTTPS so you can point to localhost from Kentico Kontent. This should only be done on a development project or a content type dedicated to development.
