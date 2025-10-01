<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Badge from 'primevue/badge';
import { easyHuntingApi, type Target } from '../services/EasyHuntingApi';

// Reactive data
const targets = ref<Target[]>([]);
const selectedTarget = ref<Target | null>(null);
const currentTarget = ref<Target | null>(null);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Load targets from API
const loadTargets = async () => {
	isLoading.value = true;
	errorMessage.value = '';

	try {
		const response = await easyHuntingApi.getTargetsList();

		if (response.status === 'success') {
			targets.value = response.targets;

			// Load current target from localStorage
			const current = easyHuntingApi.getCurrentTarget();
			if (current) {
				// Check if current target still exists in the list
				const existingTarget = targets.value.find(t => t._id === current._id);
				if (existingTarget) {
					currentTarget.value = existingTarget;
					selectedTarget.value = existingTarget;
				} else {
					// Clear invalid current target
					easyHuntingApi.clearCurrentTarget();
					currentTarget.value = null;
				}
			}
		} else {
			errorMessage.value = response.error || 'Failed to load targets';
		}
	} catch (error) {
		console.error('Load targets error:', error);
		errorMessage.value = 'Network error occurred while loading targets';
	} finally {
		isLoading.value = false;
	}
};

// Set selected target as current (triggered when dropdown changes)
const setCurrentTarget = (target: Target | null) => {
	if (target) {
		easyHuntingApi.setCurrentTarget(target);
		currentTarget.value = target;
		successMessage.value = `Target "${target.TargetName}" selected as current target`;

		// Clear success message after 3 seconds
		setTimeout(() => {
			successMessage.value = '';
		}, 3000);
	}
};

// Clear current target
const clearCurrentTarget = () => {
	easyHuntingApi.clearCurrentTarget();
	currentTarget.value = null;
	selectedTarget.value = null;
	successMessage.value = 'Current target cleared';

	// Clear success message after 3 seconds
	setTimeout(() => {
		successMessage.value = '';
	}, 3000);
};

// Format target for dropdown display
const formatTargetForDropdown = (target: Target) => {
	const targetName = target.TargetName || 'Unnamed Target';

	return {
		label: targetName,
		value: target,
		disabled: target.TargetAccessLimited || false
	};
};

// Handle refresh event from login
const handleRefresh = () => {
	loadTargets();
};

// Load targets on component mount
onMounted(() => {
	loadTargets();

	// Listen for refresh events triggered by login
	document.addEventListener('refreshTargets', handleRefresh);
});

// Clean up event listener
onUnmounted(() => {
	document.removeEventListener('refreshTargets', handleRefresh);
});
</script>

<template>
	<div class="space-y-4">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold" style="color: hsl(var(--c-surface-0))">Target Selection</h2>
			<Button
				@click="loadTargets"
				:disabled="isLoading"
				size="small"
				icon="pi pi-refresh"
				label="Refresh"
				:loading="isLoading"
			/>
		</div>

		<!-- Loading state -->
		<div v-if="isLoading" class="text-center py-8">
			<div class="inline-flex items-center gap-2">
				<i class="pi pi-spin pi-spinner"></i>
				<span>Loading targets...</span>
			</div>
		</div>

		<!-- Error state -->
		<div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
			<div class="flex items-center gap-2 text-red-700">
				<i class="pi pi-exclamation-triangle"></i>
				<span class="font-medium">Error loading targets</span>
			</div>
			<p class="text-red-600 text-sm mt-1">{{ errorMessage }}</p>
		</div>

		<!-- Success message -->
		<div
			v-else-if="successMessage"
			class="rounded-lg p-4 mb-4 shadow-sm"
			style="background-color: hsl(var(--c-success-900) / 0.8); border: 1px solid hsl(var(--c-success-700))"
		>
			<div class="flex items-center gap-2">
				<i class="pi pi-check-circle text-lg" style="color: hsl(var(--c-success-400))"></i>
				<span class="font-semibold" style="color: hsl(var(--c-success-200))">{{ successMessage }}</span>
			</div>
		</div>

		<!-- Target Selection Card -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-list" style="color: hsl(var(--c-primary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Available Targets</span>
					<Badge :value="targets.length" v-if="targets.length > 0" />
				</div>
			</template>
			<template #content>
				<!-- No Targets Available -->
				<div v-if="!isLoading && targets.length === 0 && !errorMessage" class="text-center py-12">
					<div class="text-gray-400 mb-4">
						<i class="pi pi-inbox text-4xl"></i>
					</div>
					<h3 class="text-lg font-medium text-gray-700 mb-2" style="color: hsl(var(--c-surface-200))">
						No Targets Available
					</h3>
					<p class="text-sm mb-4" style="color: hsl(var(--c-surface-400))">
						You don't have any targets configured. Please add a target in the EasyHunting platform.
					</p>
					<Button
						as="a"
						href="https://easyhunting.app/dashboard"
						target="_blank"
						icon="pi pi-external-link"
						label="Open EasyHunting Platform"
						size="small"
					/>
				</div>

				<!-- Target Selection Dropdown -->
				<div v-if="!isLoading && targets.length > 0" class="space-y-4">
					<div>
						<label for="targetSelect" class="block text-sm font-medium mb-2" style="color: hsl(var(--c-surface-300))">
							Select Target
						</label>
						<Dropdown
							id="targetSelect"
							v-model="selectedTarget"
							:options="targets.map(formatTargetForDropdown)"
							optionLabel="label"
							optionValue="value"
							:optionDisabled="option => option.disabled"
							placeholder="Choose a target..."
							class="w-full"
							:disabled="isLoading"
							@change="setCurrentTarget(selectedTarget)"
						>
							<template #option="{ option }">
								<div class="flex items-center gap-2">
									<div>
										<div class="font-medium">{{ option.value.TargetName }}</div>
										<div v-if="option.disabled" class="text-xs" style="color: hsl(var(--c-warning-400))">
											<i class="pi pi-lock mr-1"></i>
											Access Limited - Upgrade Plan
										</div>
									</div>
								</div>
							</template>
						</Dropdown>
					</div>

					<!-- Limited Access Warning -->
					<div v-if="selectedTarget?.TargetAccessLimited" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div class="flex items-center gap-2 text-yellow-700">
							<i class="pi pi-exclamation-triangle"></i>
							<span class="font-medium">Limited Access</span>
						</div>
						<p class="text-yellow-600 text-sm mt-1">
							This target has limited access based on your subscription plan. Please upgrade to access this target.
						</p>
					</div>
				</div>
			</template>
		</Card>

		<!-- Help Section -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-info-circle" style="color: hsl(var(--c-info-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Target Information</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Target Management</h4>
							<p style="color: hsl(var(--c-surface-400))">Targets are managed in your EasyHunting platform dashboard</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Scan Operations</h4>
							<p style="color: hsl(var(--c-surface-400))">
								The selected target will be used for all scan operations from this plugin
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Access Limitations</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Target access may be limited based on your subscription plan
							</p>
						</div>
					</div>
				</div>
			</template>
		</Card>

		<!-- Cache info -->
		<div
			class="rounded-lg p-3 shadow-sm"
			style="background-color: hsl(var(--c-surface-800)); border: 1px solid hsl(var(--c-surface-600))"
		>
			<div class="flex items-center gap-2 text-sm">
				<i class="pi pi-info-circle" style="color: hsl(var(--c-info-400))"></i>
				<span class="font-medium" style="color: hsl(var(--c-surface-200))">
					Use refresh to update targets list from server if you've recently added new targets.
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.space-y-4 > * + * {
	margin-top: 1rem;
}

.space-y-3 > * + * {
	margin-top: 0.75rem;
}

.space-y-2 > * + * {
	margin-top: 0.5rem;
}
</style>
