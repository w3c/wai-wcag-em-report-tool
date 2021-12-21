# WCAG-EM Report Tool

<a href="https://wcag-em-report-tool-2021-redesign.netlify.app/"><img width="400"  alt="" src="https://user-images.githubusercontent.com/178782/114709430-d86bd700-9d2c-11eb-8508-c628ef6614d4.png"></a>

[Preview](https://wcag-em-report-tool-2021-redesign.netlify.app/) 

## About this tool

The WCAG-EM Report tool is an assistant that takes the user through the process of evaluating the accessibility of a website, using the [WCAG Evaluation Methodology](https://www.w3.org/TR/WCAG-EM/).

It is developed by the Web Accessibility Initiative (WAI) at the World Wide Web Consortium (W3C). Initially developed with support from the <a href="http://www.w3.org/WAI/ACT/">WAI-ACT Project</a>, and updated with support of the <a href="http://www.w3.org/WAI/Tools/">WAI-Tools Project</a>, co-funded by the European Commission (EC).

## Environments

This tool is available on: 

| Environment | URL(s) | Hosted at |
|:--|:--|:--|
| production | w3.org/WAI/eval/report-tool | GitHub Pages of this repository |
| preview of `main` branch | https://wcag-em-report-tool-2021-redesign.netlify.app/ | Netlify |
| previews of Pull Requests |  see comment at individual Pull Request | Netlify |

## Local development

For local development, you will need to have [Node](https://nodejs.org/en/) installed. 

We use [Svelte](https://svelte.dev/) so that we can express the code of this project in components and [Rollup](https://www.rollupjs.org/guide/en/) to bundle all JavaScript together. 

### First time

1. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository) the repository (you can [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) it first)
2. In the project folder, run `npm install`, this gets all the Node dependencies

### After first time

1. For development, run `npm run dev`, this builds the project, serves the application on a local server ([localhost:10001](http://localhost:10001) per default) so that you can look at it and watches for any changes you make to the code.
2. To only build the application, run `npm run build`, this builds the project without serving it.

### Publishing in a sub folder

If you want to publish this tool somewhere that is not the root domain (eg `w3.org/WAI/eval/report-tool` instead of `wcagemreporttool.com`), set the `BASEPATH` variable before you run `npm run build|dev`, for example:

```bash
export BASEPATH="/WAI/eval/report-tool"
``` 

This ensures routing and paths to assets continue to work.

## Contributing

If you find any problem, feel free to [file an issue](https://github.com/w3c/wai-wcag-em-report-tool/issues/new).

You can also add a new language, see [How to add a language](https://github.com/w3c/wai-wcag-em-report-tool/wiki/How-to-add-a-language).
