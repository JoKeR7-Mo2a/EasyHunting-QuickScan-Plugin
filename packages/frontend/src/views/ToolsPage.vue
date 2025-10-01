<template>
	<div class="space-y-4">
		<div class="flex justify-between items-center">
			<h2 class="text-xl font-bold" style="color: hsl(var(--c-surface-0))">Available Tools</h2>
			<Button icon="pi pi-refresh" label="Refresh" :loading="isLoading" @click="refreshToolsList" size="small" />
		</div>

		<!-- Loading state -->
		<div v-if="isLoading" class="text-center py-8">
			<div class="inline-flex items-center gap-2">
				<i class="pi pi-spin pi-spinner"></i>
				<span>Loading tools...</span>
			</div>
		</div>

		<!-- Error state -->
		<div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
			<div class="flex items-center gap-2 text-red-700">
				<i class="pi pi-exclamation-triangle"></i>
				<span class="font-medium">Error loading tools</span>
			</div>
			<p class="text-red-600 text-sm mt-1">{{ error }}</p>
		</div>

		<!-- Storage limit exceeded -->
		<div v-else-if="storageExceeded" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
			<div class="flex items-center gap-2 text-yellow-700">
				<i class="pi pi-exclamation-triangle"></i>
				<span class="font-medium">Storage Limit Exceeded</span>
			</div>
			<p class="text-yellow-600 text-sm mt-1">
				Cannot access tools. Your storage limit has been exceeded. Please upgrade your plan or free up space.
			</p>
		</div>

		<!-- Empty state -->
		<div v-else-if="tools.length === 0" class="text-center py-12">
			<div class="text-gray-400 mb-4">
				<i class="pi pi-box text-4xl"></i>
			</div>
			<h3 class="text-lg font-medium text-gray-700 mb-2">No Tools Installed</h3>
			<p class="text-gray-500 text-sm mb-4">You haven't installed any tools in your EasyHunting platform yet.</p>
			<p class="text-gray-500 text-xs">Visit your EasyHunting dashboard to install and configure tools.</p>
		</div>

		<!-- Tools list -->
		<div v-else class="space-y-2">
			<div
				class="rounded-lg p-4 mb-4 shadow-sm"
				style="background-color: hsl(var(--c-success-900) / 0.8); border: 1px solid hsl(var(--c-success-700))"
			>
				<div class="flex items-center gap-2">
					<i class="pi pi-check-circle text-lg" style="color: hsl(var(--c-success-400))"></i>
					<span class="font-semibold" style="color: hsl(var(--c-success-200))">{{ tools.length }} Tools Available</span>
				</div>
				<p class="text-sm mt-2" style="color: hsl(var(--c-success-300))">
					These tools are installed and ready to use in your EasyHunting platform.
				</p>
			</div>

			<div class="grid gap-2">
				<div
					v-for="tool in tools"
					:key="tool"
					class="tool-item flex items-center justify-between p-3 rounded-lg transition-all duration-200"
				>
					<div class="flex items-center gap-3 cursor-pointer flex-1" @click="openAddScanDialog(tool)">
						<div class="w-8 h-8 flex items-center justify-center">
							<span class="text-lg">⚙️</span>
						</div>
						<div>
							<span class="font-medium tool-text">{{ tool }}</span>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<Button icon="pi pi-plus" label="Add Scan" size="small" @click="openAddScanDialog(tool)" />
						<span class="text-xs px-3 py-1 rounded-full font-medium shadow-sm tool-badge">
							<i class="pi pi-check mr-1"></i>Installed
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Cache info -->
		<div
			v-if="tools.length > 0"
			class="rounded-lg p-3 shadow-sm"
			style="background-color: hsl(var(--c-surface-800)); border: 1px solid hsl(var(--c-surface-600))"
		>
			<div class="flex items-center gap-2 text-sm">
				<i class="pi pi-info-circle" style="color: hsl(var(--c-info-400))"></i>
				<span class="font-medium" style="color: hsl(var(--c-surface-200))"
					>Tools list is cached locally. Use refresh to update from server.</span
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { onMounted, onUnmounted, ref } from 'vue';

import { easyHuntingApi } from '../services/EasyHuntingApi';

// Reactive data
const tools = ref<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const storageExceeded = ref(false);

// Load tools from cache on mount
const loadCachedTools = () => {
	const cachedTools = easyHuntingApi.getCachedToolsList();
	tools.value = cachedTools;
};

// Refresh tools list from server
const refreshToolsList = async () => {
	isLoading.value = true;
	error.value = null;
	storageExceeded.value = false;

	try {
		const response = await easyHuntingApi.getToolsList();

		if (response.status === 'success') {
			tools.value = response.tools || [];
			error.value = null;
			storageExceeded.value = false;

			// Trigger menu items refresh after successful tools update
			if ((window as any).refreshEasyHuntingMenuItems) {
				(window as any).refreshEasyHuntingMenuItems();
				console.log('🔄 Triggered menu items refresh after tools update');
			}
		} else if (response.status === 'storage_limit_exceeded') {
			tools.value = [];
			storageExceeded.value = true;
			error.value = null;
		} else {
			tools.value = [];
			error.value = response.error || 'Failed to load tools';
			storageExceeded.value = false;
		}
	} catch (err) {
		console.error('Error refreshing tools list:', err);
		error.value = 'Network error occurred';
		tools.value = [];
		storageExceeded.value = false;
	} finally {
		isLoading.value = false;
	}
};

// Handle refresh event from login
const handleRefresh = () => {
	// Load cached tools first for instant display
	loadCachedTools();

	// Then refresh from server
	if (easyHuntingApi.isAuthenticated()) {
		refreshToolsList();
	}
};

// Initialize on mount
onMounted(() => {
	// Load cached tools first for instant display
	loadCachedTools();

	// Then refresh from server
	if (easyHuntingApi.isAuthenticated()) {
		refreshToolsList();
	}

	// Listen for refresh events triggered by login
	document.addEventListener('refreshTools', handleRefresh);
});

// Clean up event listener
onUnmounted(() => {
	document.removeEventListener('refreshTools', handleRefresh);
});

// Open add scan dialog for specific tool
const openAddScanDialog = (tool: string) => {
	console.log('Opening add scan dialog for tool:', tool);

	// Trigger custom event to show add scan dialog
	const event = new CustomEvent('showAddScanDialog', {
		detail: {
			tool,
			input: '' // Empty input, user will fill it
		}
	});
	document.dispatchEvent(event);
};
</script>

<style scoped>
.space-y-4 > * + * {
	margin-top: 1rem;
}

.space-y-2 > * + * {
	margin-top: 0.5rem;
}

.grid {
	display: grid;
}

.gap-2 {
	gap: 0.5rem;
}

.gap-3 {
	gap: 0.75rem;
}

/* Caido-themed tool items */
.tool-item {
	background-color: hsl(var(--c-surface-700));
	border: 1px solid hsl(var(--c-surface-600));
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.tool-item:hover {
	background-color: hsl(var(--c-surface-600));
	border-color: hsl(var(--c-surface-500));
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
}

.tool-item .cursor-pointer:hover {
	background-color: hsl(var(--c-surface-600) / 0.5);
	border-radius: 8px;
}

.tool-icon {
	/* No background - just the emoji icon */
}

.tool-text {
	color: hsl(var(--c-surface-0));
}

.tool-badge {
	background: linear-gradient(135deg, hsl(var(--c-success-500)), hsl(var(--c-success-600)));
	color: white;
}
</style>
