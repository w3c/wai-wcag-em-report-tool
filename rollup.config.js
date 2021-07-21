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

export default {
  input: pkg.main,
  output: {
    sourcemap: true,
    format: 'esm',
    name: pkg.name,
    dir: `build${BASEPATH}/bundles`
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write('main.css');
      }
    }),

    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    json({
      compact: production
    }),

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
          dest: `${BASEPATH}build/bundles`
        },
        {
          // Images
          src: 'src/static/**/*.{svg,png,jpeg,jpg}',
          dest: `${BASEPATH}build/images`
        },
        {
          // index.html
          src: 'src/index.html',
          dest: 'build',
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

    replace({
      __BASEPATH__: BASEPATH
    }),


    !production &&
      serve({
        contentBase: 'build',
        historyApiFallback: true
      }),

    !production && livereload('build'),
    production && terser()
  ],
  watch: {
    exclude: [
      'node_modules/**',
      // Exclude _underscore-prefixed.files
      'src/locales/translations_*.json'
    ],
  }
};
