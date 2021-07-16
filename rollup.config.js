import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import mergeJson from './rollup/rollup-plugin-merge-json/index.js';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import locales from './src/locales/index.json';

const production = !process.env.ROLLUP_WATCH;

const BASEPATH = process.env.BASEPATH || '';
const PATHS = {
  BUILD: `_site/build${BASEPATH}`,
  DEV: `_site/development${BASEPATH}`
};

export default {
  input: pkg.main,
  output: {
    sourcemap: true,
    format: 'esm',
    name: pkg.name,
    dir: `${production ? PATHS.BUILD : PATHS.DEV}/bundles`
  },
  plugins: [
    mergeJson({
      targets: locales.map((locale) => {
        return {
          src: `src/locales/${locale.lang}/**/*.json`,
          dest: `src/locales/translations_${locale.lang}.json`
        };
      }),
      verbose: false,
      watch: true,
      wrapWithPath: true
    }),

    alias({
      entries: {
        '@app': './src'
      }
    }),

    copy({
      targets: [
        {
          // Styles
          src: 'src/static/css/**/*.css',
          dest: `${production ? PATHS.BUILD : PATHS.DEV}/css`
        },
        {
          // Images
          src: 'src/static/**/*.{svg,png,jpeg,jpg}',
          dest: `${production ? PATHS.BUILD : PATHS.DEV}/images`
        },
        {
          // index.html
          src: 'src/index.html',
          dest: production ? PATHS.BUILD : PATHS.DEV,
          transform: (contents) => {
            let contentsString = contents.toString();
            const buildDate = new Date();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const replacement = {
              __APP_BUILD_DATE__: `${buildDate.getDate()} ${months[buildDate.getMonth()]} ${buildDate.getFullYear()}`,
              __APP_VERSION__: production ? pkg.version : 'DEVELOPMENT',
              __BASEPATH__: BASEPATH,
              __TITLE__: pkg.name
            };

            let replaceRegexp;

            // e.g. "{__TITLE__}" => "WCAG-EM-Report-Tool"
            for (var key in replacement) {
              replaceRegexp = new RegExp(`\\{${key}\\}`, 'g');

              if (Object.prototype.hasOwnProperty.call(replacement, key)) {
                contentsString = contentsString.replace(
                  replaceRegexp,
                  replacement[key]
                );
              }
            }

            return contentsString;
          }
        }
      ],
      verbose: false
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write('app.css');
      }
    }),

    replace({
      __BASEPATH__: BASEPATH
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // Babel used to provide legacy (IE 11) support
    babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      babelHelpers: 'runtime',
      exclude: ['node_modules/@babel/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead, ie 11'
          }
        ]
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true
          }
        ]
      ]
    }),
    json({
      compact: production
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production &&
      serve({
        contentBase: '_site/development',

        // Automaticly start your default browser
        // with serve url; http://localhost:10001<BASEPATH>/
        open: true,
        openPage: `${BASEPATH}/`,
        historyApiFallback: true
      }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload(PATHS.DEV),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    exclude: [
      'node_modules/**',
      // Exclude _underscore-prefixed.files
      'src/locales/translations_*.json'
    ],
    clearScreen: false
  }
};
