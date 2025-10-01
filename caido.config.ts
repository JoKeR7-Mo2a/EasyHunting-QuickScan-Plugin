import { defineConfig } from '@caido-community/dev';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';
// @ts-expect-error no declared types at this time
import tailwindPrimeui from 'tailwindcss-primeui';
import tailwindCaido from '@caido/tailwindcss';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import prefixwrap from 'postcss-prefixwrap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const id = 'easyhunting-quickscan';
export default defineConfig({
	id,
	name: 'EasyHunting QuickScan',
	description: 'Security scanning plugin for EasyHunting platform integration with Caido',
	version: '1.0.0',
	author: {
		name: 'EasyHunting Team',
		email: 'joker7@easyhunting.app',
		url: 'https://easyhunting.app'
	},
	plugins: [
		{
			kind: 'backend',
			id: 'backend',
			root: 'packages/backend'
		},
		{
			kind: 'frontend',
			id: 'frontend',
			root: 'packages/frontend',
			backend: {
				id: 'backend'
			},
			vite: {
				plugins: [vue()],
				build: {
					rollupOptions: {
						external: [
							'@caido/frontend-sdk',
							'@codemirror/autocomplete',
							'@codemirror/commands',
							'@codemirror/language',
							'@codemirror/lint',
							'@codemirror/search',
							'@codemirror/state',
							'@codemirror/view',
							'@lezer/common',
							'@lezer/highlight',
							'@lezer/lr',
							'vue'
						]
					}
				},
				resolve: {
					alias: [
						{
							find: '@',
							replacement: resolve(__dirname, 'packages/frontend/src')
						}
					]
				},
				css: {
					postcss: {
						plugins: [
							// This plugin wraps the root element in a unique ID
							// This is necessary to prevent styling conflicts between plugins
							prefixwrap(`#plugin--${id}`),

							tailwindcss({
								corePlugins: {
									preflight: false
								},
								content: ['./packages/frontend/src/**/*.{vue,ts}', './node_modules/@caido/primevue/dist/primevue.mjs'],
								// Check the [data-mode="dark"] attribute on the <html> element to determine the mode
								// This attribute is set in the Caido core application
								darkMode: ['selector', '[data-mode="dark"]'],
								plugins: [
									// This plugin injects the necessary Tailwind classes for PrimeVue components
									tailwindPrimeui,

									// This plugin injects the necessary Tailwind classes for the Caido theme
									tailwindCaido
								]
							})
						]
					}
				}
			}
		}
	]
});
