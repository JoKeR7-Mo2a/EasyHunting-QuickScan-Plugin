<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { easyHuntingApi } from '../services/EasyHuntingApi';

import AboutPage from './AboutPage.vue';
import AddScanDialog from './AddScanDialog.vue';
import AuthPage from './AuthPage.vue';
import EasyHuntingDescriptionPage from './EasyHuntingDescriptionPage.vue';
import HowItWorksPage from './HowItWorksPage.vue';
import TargetsPage from './TargetsPage.vue';
import ToolsPage from './ToolsPage.vue';

// Check authentication status on mount
const isAuthenticated = ref(false);

// Add scan dialog state
const showAddScanDialog = ref(false);
const dialogData = ref({
	tool: '',
	input: ''
});

// Check if user is authenticated using API service
const checkAuthStatus = () => {
	isAuthenticated.value = easyHuntingApi.isAuthenticated();
};

const handleAuthSuccess = () => {
	isAuthenticated.value = true;
};

const handleLogout = () => {
	isAuthenticated.value = false;
};

const handleScanAdded = (scanData: any) => {
	console.log('✅ Scan added successfully:', scanData);
	showAddScanDialog.value = false;
	dialogData.value = { tool: '', input: '' };
};

onMounted(() => {
	checkAuthStatus();

	// Listen for global events to show Add Scan dialog
	document.addEventListener('showAddScanDialog', (event: any) => {
		console.log('📢 Received showAddScanDialog event:', event.detail);
		dialogData.value = event.detail;
		showAddScanDialog.value = true;
	});

	// Check if user is already authenticated
	const token = localStorage.getItem('authToken');
	if (token) {
		isAuthenticated.value = true;
	}
});
</script>

<template>
	<div id="app">
		<!-- Main Content -->
		<div class="p-3">
			<h1 class="text-2xl font-bold mb-4">🎯 EasyHunting Dashbaord Integration</h1>

			<!-- Tab navigation -->
			<TabView>
				<TabPanel header="🔐 Authentication">
					<AuthPage
						:isAuthenticated="isAuthenticated"
						@auth-success="handleAuthSuccess"
						@logout="handleLogout"
						@auth-changed="checkAuthStatus"
					/>
				</TabPanel>

				<TabPanel header="🎯 Targets" :disabled="!isAuthenticated">
					<TargetsPage />
				</TabPanel>

				<TabPanel header="🛠️ Tools" :disabled="!isAuthenticated">
					<ToolsPage />
				</TabPanel>

				<TabPanel header="📋 How It Works">
					<HowItWorksPage />
				</TabPanel>

				<TabPanel header="🏢 EasyHunting Description">
					<EasyHuntingDescriptionPage />
				</TabPanel>

				<TabPanel header="ℹ️ About">
					<AboutPage />
				</TabPanel>
			</TabView>
		</div>

		<!-- Add Scan Dialog -->
		<AddScanDialog
			v-model:visible="showAddScanDialog"
			:selectedTool="dialogData.tool"
			:initialInput="dialogData.input"
			@scan-added="handleScanAdded"
		/>
	</div>
</template>

<style scoped>
.h-full {
	height: 100%;
}
</style>
