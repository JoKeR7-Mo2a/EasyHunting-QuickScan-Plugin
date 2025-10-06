import { Classic } from '@caido/primevue';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';

import { SDKPlugin } from './plugins/sdk';
import './styles/index.css';
import type { FrontendSDK } from './types';
import App from './views/App.vue';

// This is the entry point for the frontend plugin
export const init = (sdk: FrontendSDK) => {
	console.log('🚀 EasyHunting Frontend Plugin Starting...');

	const app = createApp(App);

	// Load the PrimeVue component library
	app.use(PrimeVue, {
		unstyled: true,
		pt: Classic
	});

	// Provide the FrontendSDK
	app.use(SDKPlugin, sdk);

	// Register commands for menu items
	try {
		// Get cached tools list for creating commands
		const toolsListStr = localStorage.getItem('ToolsList');
		let tools: string[] = [];

		if (toolsListStr) {
			try {
				tools = JSON.parse(toolsListStr);
			} catch (error) {
				console.error('Error parsing tools list:', error);
			}
		}

		// If no tools cached, don't register any menu items yet
		if (tools.length === 0) {
			console.log('🔍 No tools available yet. Menu items will be registered after tools are loaded.');
			// Don't register any menu items until tools are actually loaded from user's account
		} else {
			// Register individual commands for each tool
			tools.forEach(tool => {
				const commandId = `easyhunting:scan:${tool.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

				sdk.commands.register(commandId, {
					name: `Add ${tool} Scan`,
					run: async (context: any) => {
						console.log(`🎯 EasyHunting ${tool} Scan command executed with context:`, context);

						// Extract request data from context
						let targetUrl = '';
						let selectedText = '';

						// Build URL from RequestRowContext
						if (context?.requests && context.requests.length > 0) {
							const request = context.requests[0];
							const protocol = request.isTls ? 'https' : 'http';
							const port =
								(request.isTls && request.port === 443) || (!request.isTls && request.port === 80)
									? ''
									: `:${request.port}`;
							const query = request.query ? `?${request.query}` : '';

							targetUrl = `${protocol}://${request.host}${port}${request.path}${query}`;
							console.log('🔗 Built URL:', targetUrl);
						}

						if (context?.selection) {
							selectedText = context.selection;
							console.log('📝 Found selection:', selectedText);
						}

						// Priority: Selected text first, then full URL
						const inputData = selectedText || targetUrl || '';
						console.log('📤 Final input:', inputData);

						// Trigger add scan dialog with specific tool
						const event = new CustomEvent('showAddScanDialog', {
							detail: {
								tool: tool,
								input: inputData
							}
						});
						document.dispatchEvent(event);

						console.log(`✅ EasyHunting ${tool} dialog triggered successfully`);
					}
				});
			});

			// Register menu items with submenu for different contexts
			tools.forEach(tool => {
				const commandId = `easyhunting:scan:${tool.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

				// RequestRow context menu
				sdk.menu.registerItem({
					type: 'RequestRow',
					commandId: commandId,
					leadingIcon: 'fas fa-tools'
				});

				// Request context menu
				sdk.menu.registerItem({
					type: 'Request',
					commandId: commandId,
					leadingIcon: 'fas fa-tools'
				});

				// Response context menu
				sdk.menu.registerItem({
					type: 'Response',
					commandId: commandId,
					leadingIcon: 'fas fa-tools'
				});
			});

			console.log(`✅ EasyHunting menu items registered successfully for ${tools.length} tools`);
		}
	} catch (error) {
		console.error('💥 Error registering EasyHunting commands/menus:', error);
	}

	// Setup dialog handlers
	const showAddScanDialog = (data: any) => {
		console.log('Opening Add Scan dialog with:', data);

		// Trigger custom event to show add scan dialog
		const event = new CustomEvent('showAddScanDialog', {
			detail: data
		});
		document.dispatchEvent(event);
	};

	// Function to refresh menu items when tools list is updated
	const refreshMenuItems = () => {
		console.log('🔄 Refreshing menu items with updated tools list...');

		// Get updated tools list
		const toolsListStr = localStorage.getItem('ToolsList');
		let tools: string[] = [];

		if (toolsListStr) {
			try {
				tools = JSON.parse(toolsListStr);
			} catch (error) {
				console.error('Error parsing tools list:', error);
				return;
			}
		}

		if (tools.length === 0) {
			console.warn('No tools available for menu refresh.');
			return;
		}

		// Register new commands for updated tools
		tools.forEach(tool => {
			const commandId = `easyhunting:scan:${tool.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

			try {
				sdk.commands.register(commandId, {
					name: `Add ${tool} Scan`,
					run: async (context: any) => {
						console.log(`🎯 EasyHunting ${tool} Scan command executed with context:`, context);

						// Extract request data from context
						let targetUrl = '';
						let selectedText = '';

						// Build URL from RequestRowContext
						if (context?.requests && context.requests.length > 0) {
							const request = context.requests[0];
							const protocol = request.isTls ? 'https' : 'http';
							const port =
								(request.isTls && request.port === 443) || (!request.isTls && request.port === 80)
									? ''
									: `:${request.port}`;
							const query = request.query ? `?${request.query}` : '';

							targetUrl = `${protocol}://${request.host}${port}${request.path}${query}`;
							console.log('🔗 Built URL:', targetUrl);
						}

						if (context?.selection) {
							selectedText = context.selection;
							console.log('📝 Found selection:', selectedText);
						}

						// Priority: Selected text first, then full URL
						const inputData = selectedText || targetUrl || '';
						console.log('📤 Final input:', inputData);

						// Trigger add scan dialog with specific tool
						const event = new CustomEvent('showAddScanDialog', {
							detail: {
								tool: tool,
								input: inputData
							}
						});
						document.dispatchEvent(event);

						console.log(`✅ EasyHunting ${tool} dialog triggered successfully`);
					}
				});

				// Register menu items for each context
				['RequestRow', 'Request', 'Response'].forEach(contextType => {
					sdk.menu.registerItem({
						type: contextType as any,
						commandId: commandId,
						leadingIcon: 'fas fa-tools'
					});
				});
			} catch (error) {
				// Command might already exist, ignore error
				console.log(`Command ${commandId} already exists or error:`, error);
			}
		});

		console.log('✅ Menu items refreshed successfully');
	};

	// Listen for tools list updates
	window.addEventListener('storage', event => {
		if (event.key === 'ToolsList') {
			console.log('📦 Tools list updated, refreshing menu items...');
			refreshMenuItems();
		}
	});

	// Make functions available globally
	(window as any).showAddScanDialog = showAddScanDialog;
	(window as any).refreshEasyHuntingMenuItems = refreshMenuItems;

	// Create the root element for the app
	const root = document.createElement('div');
	Object.assign(root.style, {
		height: '100%',
		width: '100%'
	});

	// Set the ID of the root element
	// Replace this with the value of the prefixWrap plugin in caido.config.ts
	// This is necessary to prevent styling conflicts between plugins
	root.id = `plugin--easyhunting-quickscan`;

	// Mount the app to the root element
	app.mount(root);

	// Add the page to the navigation
	// Make sure to use a unique name for the page
	sdk.navigation.addPage('/easyhunting-quickscan', {
		body: root
	});

	// Add a sidebar item
	sdk.sidebar.registerItem('EasyHunting', '/easyhunting-quickscan');
};
