<template>
	<Dialog
		v-if="visible"
		:visible="true"
		modal
		:header="`Add New ${selectedTool} Scan`"
		:style="{ width: '800px', maxHeight: '90vh' }"
		:closable="true"
		@hide="handleClose"
		class="overflow-y-auto"
	>
		<div class="space-y-6">
			<!-- Tool Input -->
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Tool Input</label>
					<InputText
						v-model="singleInput"
						class="w-full"
						placeholder="Enter input for the tool: domain, URL, IP, file path, or any format accepted by the tool"
					/>
				</div>
			</div>

			<!-- Extra Arguments Section -->
			<div class="space-y-4">
				<label class="block text-sm font-medium text-gray-700">Extra Arguments For Scan:</label>

				<!-- Loading state -->
				<div v-if="loadingExtraArgs" class="text-center py-4">
					<div class="inline-flex items-center gap-2 text-gray-600">
						<i class="pi pi-spin pi-spinner"></i>
						<span>Loading default arguments...</span>
					</div>
				</div>

				<!-- Arguments Table -->
				<div v-else class="caido-table-wrapper">
					<table class="caido-table w-full">
						<!-- Table Header -->
						<thead class="caido-table-header">
							<tr>
								<th class="caido-th description-col">Description</th>
								<th class="caido-th key-col">Key</th>
								<th class="caido-th value-col">Value</th>
								<th class="caido-th actions-col">Actions</th>
							</tr>
						</thead>
						<!-- Table Body -->
						<tbody class="caido-table-body">
							<!-- Default and Custom Arguments -->
							<tr v-for="(arg, index) in allExtraArgs" :key="index" class="caido-tr">
								<!-- Description Column -->
								<td class="caido-td description-col">
									<InputText
										v-model="arg.description"
										class="caido-input w-full"
										size="small"
										:readonly="!arg.isCustom"
										:placeholder="arg.isCustom ? 'Enter description...' : ''"
									/>
								</td>
								<!-- Key Column -->
								<td class="caido-td key-col">
									<InputText
										v-model="arg.key"
										class="caido-input w-full"
										size="small"
										:readonly="!arg.isCustom"
										:placeholder="arg.isCustom ? 'e.g., -t' : ''"
									/>
								</td>
								<!-- Value Column -->
								<td class="caido-td value-col">
									<InputText
										v-model="arg.value"
										:placeholder="
											arg.isFlagKey
												? 'Flag (no value required)'
												: arg.isCustom
												? 'Enter value...'
												: arg.description || `Enter value for ${arg.key}`
										"
										:disabled="arg.isFlagKey"
										class="caido-input w-full"
										:class="{ 'text-muted-foreground': arg.isFlagKey }"
										size="small"
									/>
								</td>
								<!-- Actions Column -->
								<td class="caido-td actions-col text-center">
									<Button
										label="Delete"
										severity="secondary"
										size="small"
										@click="removeExtraArg(index)"
										class="caido-danger-btn"
									/>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Empty State -->
					<div v-if="allExtraArgs.length === 0" class="caido-empty-state">
						<p class="caido-text-muted">No predefined arguments are configured for {{ selectedTool }} tool</p>
					</div>
				</div>
			</div>

			<!-- Error message -->
			<div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
				<div class="flex items-center gap-2 text-red-700">
					<i class="pi pi-exclamation-triangle"></i>
					<span class="font-medium">Error</span>
				</div>
				<p class="text-red-600 text-sm mt-1">{{ error }}</p>
			</div>

			<!-- No target warning -->
			<div v-if="!currentTarget" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
				<div class="flex items-center gap-2 text-yellow-700">
					<i class="pi pi-exclamation-triangle"></i>
					<span class="font-medium">No Target Selected</span>
				</div>
				<p class="text-yellow-600 text-sm mt-1">Please select a target in the Targets tab before adding a scan.</p>
			</div>
		</div>

		<template #footer>
			<div class="flex justify-between items-center w-full">
				<!-- Left side - Add Custom Argument -->
				<div class="flex-shrink-0">
					<Button
						icon="pi pi-plus"
						severity="secondary"
						label="Add Custom Arg"
						size="small"
						@click="addCustomArg"
						class="caido-add-btn"
					/>
				</div>
				<!-- Right side - Action buttons -->
				<div class="flex gap-2">
					<Button label="Cancel" severity="secondary" @click="handleClose" />
					<Button
						label="Add Scan"
						:disabled="!currentTarget || !selectedTool || !singleInput || isLoading"
						:loading="isLoading"
						@click="handleAddScan"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { onMounted, onUnmounted, ref, computed } from 'vue';

import { easyHuntingApi } from '../services/EasyHuntingApi';

// Reactive data
const visible = ref(false);
const selectedTool = ref('');
const singleInput = ref('');
const isLoading = ref(false);
const loadingExtraArgs = ref(false);
const error = ref<string | null>(null);
const currentTarget = ref<any>(null);

// Arguments data - separate default and custom args like ExtraArgsPanel
const defaultExtraArgs = ref<
	Array<{ key: string; value: string; description: string; isCustom: boolean; isFlagKey: boolean }>
>([]);
const customExtraArgs = ref<
	Array<{ key: string; value: string; description: string; isCustom: boolean; isFlagKey: boolean }>
>([]);

// Computed property to combine all args for table display
const allExtraArgs = computed(() => {
	return [...defaultExtraArgs.value, ...customExtraArgs.value];
});

// Event handler for showing dialog
const handleShowDialog = async (event: CustomEvent) => {
	console.log('Add scan dialog event received:', event.detail);

	const { tool, input } = event.detail;
	selectedTool.value = tool;
	singleInput.value = input || '';

	// Load current target
	currentTarget.value = easyHuntingApi.getCurrentTarget();

	// Load tool extra args
	await loadToolExtraArgs(tool);

	visible.value = true;
};

// Load tool extra arguments - auto display like ExtraArgsPanel
const loadToolExtraArgs = async (toolname: string) => {
	loadingExtraArgs.value = true;
	error.value = null;
	defaultExtraArgs.value = [];
	customExtraArgs.value = [];

	try {
		const response = await easyHuntingApi.getToolExtraArgs(toolname);

		if (response.status === 'success') {
			// Process and automatically display default extra args
			const processedArgs = (response.extraArgs || []).map((arg: any) => {
				if (typeof arg === 'string') {
					return {
						key: arg,
						value: '', // Start with empty value for user to fill
						description: `${arg} parameter`,
						isCustom: false, // This is a default arg from API
						isFlagKey: false // Default to false for string args
					};
				}
				return {
					key: arg.name || arg.key || '',
					value: '', // Start with empty value for user to fill
					description: arg.description || arg.help || `${arg.name || arg.key} parameter`,
					isCustom: false, // This is a default arg from API
					isFlagKey: arg.isFlagKey || false // Use isFlagKey from API
				};
			});

			// Automatically display all default args in the table
			defaultExtraArgs.value = processedArgs;

			console.log('Loaded default args for table display:', defaultExtraArgs.value);
		} else {
			error.value = response.error || 'Failed to load tool arguments';
		}
	} catch (err) {
		console.error('Error loading tool extra args:', err);
		error.value = 'Network error occurred';
	} finally {
		loadingExtraArgs.value = false;
	}
};

// Add custom argument - adds empty row for user to fill
const addCustomArg = () => {
	customExtraArgs.value.push({
		key: '',
		value: '',
		description: 'Custom argument',
		isCustom: true,
		isFlagKey: false
	});
};

// Remove argument - works for both default and custom args
const removeExtraArg = (index: number) => {
	const allArgs = allExtraArgs.value;
	const argToRemove = allArgs[index];

	if (!argToRemove) return;

	if (argToRemove.isCustom) {
		// Remove from custom args
		const customIndex = customExtraArgs.value.findIndex(arg => arg === argToRemove);
		if (customIndex > -1) {
			customExtraArgs.value.splice(customIndex, 1);
		}
	} else {
		// Remove from default args
		const defaultIndex = defaultExtraArgs.value.findIndex(arg => arg === argToRemove);
		if (defaultIndex > -1) {
			defaultExtraArgs.value.splice(defaultIndex, 1);
		}
	}
};

// Handle dialog close
const handleClose = () => {
	visible.value = false;
	selectedTool.value = '';
	singleInput.value = '';
	defaultExtraArgs.value = [];
	customExtraArgs.value = [];
	error.value = null;
};

// Handle add scan
const handleAddScan = async () => {
	if (!currentTarget.value || !selectedTool.value) return;

	if (!singleInput.value.trim()) {
		error.value = 'Please provide input data for the scan';
		return;
	}

	isLoading.value = true;
	error.value = null;

	try {
		// Prepare extra args from table data
		const extraArgsArray: string[] = [];

		// Process all arguments (default + custom) that have both key and value
		allExtraArgs.value.forEach(arg => {
			if (arg.key.trim()) {
				extraArgsArray.push(arg.key);
				// For flag keys, don't add value; for regular args, add value if it exists
				if (!arg.isFlagKey && arg.value.trim()) {
					extraArgsArray.push(arg.value);
				}
			}
		});

		// Single scan mode only
		const scanData = {
			action: 'addscan' as const,
			TargetName: currentTarget.value.TargetName,
			tool: selectedTool.value,
			toolParams: {
				extraArgs: extraArgsArray,
				input: singleInput.value
			}
		};

		console.log('Adding scan with data:', scanData);
		const result = await easyHuntingApi.addScan(scanData);

		if (result.status === 'success') {
			console.log('Scan added successfully:', result.message);
			handleClose();
		} else {
			error.value = result.error || result.message || 'Failed to add scan';
		}
	} catch (err) {
		console.error('Error adding scan:', err);
		error.value = 'Network error occurred';
	} finally {
		isLoading.value = false;
	}
}; // Setup event listeners
onMounted(() => {
	document.addEventListener('showAddScanDialog', handleShowDialog as unknown as EventListener);
});

onUnmounted(() => {
	document.removeEventListener('showAddScanDialog', handleShowDialog as unknown as EventListener);
});
</script>

<style scoped>
/* Caido-consistent table styling */
.caido-table-wrapper {
	border: 1px solid #d1d5db;
	border-radius: 8px;
	overflow: hidden;
	background: #ffffff;
}

.caido-table {
	border-collapse: collapse;
	width: 100%;
	table-layout: fixed;
}

.caido-table-header {
	background: #f8fafc;
	border-bottom: 2px solid #e2e8f0;
}

.caido-th {
	padding: 12px 16px;
	text-align: left; /* Headers محاذاة يسار */
	font-weight: 600;
	font-size: 14px;
	color: #374151;
	border-bottom: 1px solid #e2e8f0;
	border-right: 1px solid #e2e8f0; /* حدود بين الأعمدة */
}

.caido-th:last-child {
	border-right: none; /* إزالة الحد الأخير */
}

.caido-table-body .caido-tr {
	border-bottom: 1px solid #e5e7eb; /* حدود واضحة بين الصفوف */
	transition: background-color 0.15s ease;
}

.caido-table-body .caido-tr:hover {
	background: #f8fafc;
}

.caido-table-body .caido-tr:nth-child(even) {
	background: #fafbfc;
}

.caido-table-body .caido-tr:nth-child(even):hover {
	background: #f1f5f9;
}

.caido-td {
	padding: 12px 16px;
	vertical-align: middle;
	font-size: 14px;
	color: #374151;
	border-right: 1px solid #f1f5f9; /* حدود خفيفة بين الأعمدة */
}

.caido-td:last-child {
	border-right: none; /* إزالة الحد الأخير */
}

.caido-text-muted {
	color: #6b7280;
	font-size: 13px;
}

.caido-key-badge {
	display: inline-block;
	background: #e5e7eb;
	color: #374151;
	padding: 4px 8px;
	border-radius: 4px;
	font-family: 'Monaco', 'Consolas', monospace;
	font-size: 12px;
	font-weight: 500;
}

.caido-input {
	border: 1px solid #d1d5db !important;
	border-radius: 4px !important;
	padding: 6px 8px !important;
	font-size: 13px !important;
	background: #ffffff !important;
	color: #374151 !important;
	transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.caido-input:focus {
	border-color: #3b82f6 !important;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
	outline: none !important;
}

.caido-input[readonly] {
	background: #f8f9fa !important;
	color: #6b7280 !important;
	cursor: not-allowed !important;
	border-color: #e5e7eb !important;
}

.caido-input[readonly]:focus {
	border-color: #e5e7eb !important;
	box-shadow: none !important;
}

.caido-input[disabled] {
	background: #f8f9fa !important;
	color: #6b7280 !important;
	cursor: not-allowed !important;
	border-color: #e5e7eb !important;
}

.caido-input[disabled]:focus {
	border-color: #e5e7eb !important;
	box-shadow: none !important;
}

.text-muted-foreground {
	color: #6b7280 !important;
}

.caido-add-section {
	padding: 16px;
	text-align: center;
	border-top: 2px dashed #d1d5db; /* حد مميز للقسم السفلي */
	background: #fafbfc;
}

.caido-add-btn {
	border-color: #d1d5db !important;
	color: #374151 !important;
}

.caido-add-btn:hover {
	background: #f3f4f6 !important;
	border-color: #9ca3af !important;
}

.caido-danger-btn {
	color: #dc2626 !important;
}

.caido-danger-btn:hover {
	background: #fef2f2 !important;
	color: #b91c1c !important;
}

.caido-empty-state {
	padding: 48px 24px;
	text-align: center;
	background: #fafbfc;
	border: 2px dashed #d1d5db;
	border-radius: 8px;
}

/* Column widths */
.description-col {
	width: 30%;
	min-width: 120px;
}

.key-col {
	width: 20%;
	min-width: 100px;
}

.value-col {
	width: 35%;
	min-width: 120px;
}

.actions-col {
	width: 15%;
	min-width: 80px;
	text-align: center;
}

/* Utility classes */
.w-full {
	width: 100%;
}

.text-center {
	text-align: center;
}

.mt-3 {
	margin-top: 12px;
}

.flex {
	display: flex;
}

.justify-end {
	justify-content: flex-end;
}

/* Space utilities */
.space-y-4 > * + * {
	margin-top: 1rem;
}

.space-y-2 > * + * {
	margin-top: 0.5rem;
}

.grid-cols-2 {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid {
	display: grid;
}

.gap-4 {
	gap: 1rem;
}

.gap-2 {
	gap: 0.5rem;
}
</style>
