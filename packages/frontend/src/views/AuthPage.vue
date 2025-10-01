<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { easyHuntingApi } from '../services/EasyHuntingApi';

// Props
interface Props {
	isAuthenticated?: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
	authChanged: [];
}>();

// Reactive data
const isAuthenticated = ref(false);
const loginForm = ref({
	identifier: '',
	password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const userInfo = ref<any>(null);
const currentTarget = ref<any>(null);

// Check user info from API service
const checkUserInfo = async () => {
	const storedUserInfo = easyHuntingApi.getUserInfo();
	if (storedUserInfo) {
		userInfo.value = storedUserInfo;
	}

	// Load current target
	const storedTarget = easyHuntingApi.getCurrentTarget();
	if (storedTarget) {
		currentTarget.value = storedTarget;
	}
};

// Preload user data (targets and tools) after successful login
const preloadUserData = async () => {
	try {
		console.log('Preloading user data after login...');

		// Load targets list in background
		const targetsPromise = easyHuntingApi
			.getTargetsList()
			.then(response => {
				if (response.status === 'success') {
					console.log(`Loaded ${response.targets.length} targets`);
				}
			})
			.catch(error => {
				console.error('Error preloading targets:', error);
			});

		// Load tools list in background
		const toolsPromise = easyHuntingApi
			.getToolsList()
			.then(response => {
				if (response.status === 'success') {
					console.log(`Loaded ${response.tools.length} tools`);
				}
			})
			.catch(error => {
				console.error('Error preloading tools:', error);
			});

		// Wait for both to complete
		await Promise.allSettled([targetsPromise, toolsPromise]);
		console.log('User data preloading completed');
	} catch (error) {
		console.error('Error in preloadUserData:', error);
	}
};

// Login function using API service
const handleLogin = async () => {
	if (!loginForm.value.identifier || !loginForm.value.password) {
		errorMessage.value = 'Please enter both email and password';
		return;
	}

	isLoading.value = true;
	errorMessage.value = '';
	successMessage.value = '';

	try {
		const response = await easyHuntingApi.login({
			identifier: loginForm.value.identifier,
			password: loginForm.value.password
		});

		if (response.status === 'success') {
			successMessage.value = 'Login successful!';
			userInfo.value = response.user;
			isAuthenticated.value = true;

			// Clear form
			loginForm.value.identifier = '';
			loginForm.value.password = '';

			// Clear cached tools list to ensure fresh data
			easyHuntingApi.clearCachedToolsList();

			// Preload targets and tools after successful login
			await preloadUserData();

			// Update current target after login
			const storedTarget = easyHuntingApi.getCurrentTarget();
			if (storedTarget) {
				currentTarget.value = storedTarget;
			}

			// Trigger refresh events for other components
			setTimeout(() => {
				document.dispatchEvent(new CustomEvent('refreshTargets'));
				document.dispatchEvent(new CustomEvent('refreshTools'));
			}, 500);

			// Emit auth changed event
			emit('authChanged');
		} else {
			errorMessage.value = response.error || 'Login failed. Please check your credentials.';
		}
	} catch (error) {
		console.error('Login error:', error);
		errorMessage.value = 'Network error. Please check your connection and try again.';
	} finally {
		isLoading.value = false;
	}
};

// Logout function using API service
const handleLogout = () => {
	easyHuntingApi.logout();

	// Clear all cached data
	easyHuntingApi.clearCachedToolsList();

	userInfo.value = null;
	currentTarget.value = null;
	isAuthenticated.value = false;
	successMessage.value = 'Logged out successfully';
	emit('authChanged');
};

// Validate token on mount
const validateAuth = async () => {
	isAuthenticated.value = easyHuntingApi.isAuthenticated();

	if (isAuthenticated.value) {
		const isValid = await easyHuntingApi.validateToken();
		if (!isValid) {
			userInfo.value = null;
			isAuthenticated.value = false;
			emit('authChanged');
		} else {
			checkUserInfo();
			// Preload data if user is already authenticated
			await preloadUserData();

			// Load current target after login
			const storedTarget = easyHuntingApi.getCurrentTarget();
			if (storedTarget) {
				currentTarget.value = storedTarget;
			}

			// Trigger refresh events for other components
			setTimeout(() => {
				document.dispatchEvent(new CustomEvent('refreshTargets'));
				document.dispatchEvent(new CustomEvent('refreshTools'));
			}, 500);
		}
	}
};

// Check auth status on mount
onMounted(() => {
	validateAuth();
});

// Handle external link opening
const openExternalLink = (url: string) => {
	// Try different methods to open external link
	if (window.open) {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
		if (newWindow) {
			newWindow.opener = null;
		}
	} else {
		// Fallback for environments that don't support window.open
		window.location.href = url;
	}
};
</script>

<template>
	<div class="p-4 max-w-md mx-auto">
		<!-- Authenticated State -->
		<Card v-if="isAuthenticated && userInfo" class="mb-4">
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-check-circle text-green-500"></i>
					<span>Authentication Status</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-4">
					<!-- Success Message -->
					<Message v-if="successMessage" severity="success" :closable="false">
						{{ successMessage }}
					</Message>

					<!-- User Information -->
					<div
						class="p-4 rounded-lg"
						style="background-color: hsl(var(--c-surface-800)); border: 1px solid hsl(var(--c-surface-600))"
					>
						<div class="flex items-center gap-2 mb-3">
							<i class="pi pi-user" style="color: hsl(var(--c-info-400))"></i>
							<span class="font-semibold" style="color: hsl(var(--c-surface-200))">Connected Account</span>
						</div>

						<div class="space-y-3 text-sm">
							<div class="flex justify-between items-center">
								<span class="font-medium" style="color: hsl(var(--c-surface-300))">Username:</span>
								<span class="text-right" style="color: hsl(var(--c-surface-0))">{{ userInfo.username }}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="font-medium" style="color: hsl(var(--c-surface-300))">Email:</span>
								<span class="text-right" style="color: hsl(var(--c-surface-0))">{{ userInfo.email }}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="font-medium" style="color: hsl(var(--c-surface-300))">Plan:</span>
								<span
									class="text-right px-2 py-1 rounded text-xs font-medium"
									style="background-color: hsl(var(--c-primary-900) / 0.5); color: hsl(var(--c-primary-300))"
								>
									{{ userInfo.planType }}
								</span>
							</div>
						</div>
					</div>

					<!-- Current Target Information -->
					<div
						v-if="currentTarget"
						class="p-4 rounded-lg"
						style="background-color: hsl(var(--c-primary-900) / 0.3); border: 1px solid hsl(var(--c-primary-700))"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<i class="pi pi-crosshairs" style="color: hsl(var(--c-primary-400))"></i>
								<span class="font-semibold" style="color: hsl(var(--c-surface-200))">Current Target:</span>
							</div>
							<span class="font-mono" style="color: hsl(var(--c-primary-200))">{{ currentTarget.TargetName }}</span>
						</div>
					</div>

					<!-- No Target Selected -->
					<div
						v-else
						class="p-4 rounded-lg text-center"
						style="background-color: hsl(var(--c-warning-900) / 0.3); border: 1px solid hsl(var(--c-warning-700))"
					>
						<div class="flex items-center justify-center gap-2 mb-2">
							<i class="pi pi-exclamation-triangle" style="color: hsl(var(--c-warning-400))"></i>
							<span class="font-semibold" style="color: hsl(var(--c-surface-200))">No Target Selected</span>
						</div>
						<p class="text-sm" style="color: hsl(var(--c-surface-400))">
							Please go to the Targets tab to select a target first
						</p>
					</div>

					<!-- Connection Status -->
					<div class="flex items-center gap-2">
						<i class="pi pi-wifi" style="color: hsl(var(--c-success-400))"></i>
						<span class="text-sm" style="color: hsl(var(--c-success-300))">Connected to EasyHunting Platform</span>
					</div>

					<!-- Logout Button -->
					<Button @click="handleLogout" severity="secondary" outlined class="w-full">
						<i class="pi pi-sign-out mr-2"></i>
						Logout
					</Button>
				</div>
			</template>
		</Card>

		<!-- Unauthenticated State -->
		<Card v-else>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-lock text-orange-500"></i>
					<span>Login to EasyHunting</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-4">
					<!-- Info Message -->
					<Message severity="info" :closable="false">
						Please login with your EasyHunting credentials to connect the plugin.
					</Message>

					<!-- Error Message -->
					<Message v-if="errorMessage" severity="error" :closable="false">
						{{ errorMessage }}
					</Message>

					<!-- Success Message -->
					<Message v-if="successMessage" severity="success" :closable="false">
						{{ successMessage }}
					</Message>

					<!-- Login Form -->
					<form @submit.prevent="handleLogin" class="space-y-4">
						<div>
							<label for="identifier" class="block text-sm font-medium mb-2"> Email Address </label>
							<InputText
								id="identifier"
								v-model="loginForm.identifier"
								placeholder="Enter your email address"
								type="email"
								class="w-full"
								:disabled="isLoading"
							/>
						</div>

						<div>
							<label for="password" class="block text-sm font-medium mb-2"> Password </label>
							<Password
								id="password"
								v-model="loginForm.password"
								placeholder="Enter password"
								class="w-full"
								:disabled="isLoading"
								:feedback="false"
								toggleMask
							/>
						</div>

						<Button type="submit" class="w-full" :disabled="isLoading || !loginForm.identifier || !loginForm.password">
							<ProgressSpinner v-if="isLoading" style="width: 20px; height: 20px" strokeWidth="8" class="mr-2" />
							<i v-else class="pi pi-sign-in mr-2"></i>
							{{ isLoading ? 'Logging in...' : 'Login' }}
						</Button>
					</form>

					<!-- Help Text -->
					<div class="text-center text-sm text-gray-500 mt-4">
						<p class="mb-3">Don't have an EasyHunting account?</p>
						<Button
							@click="openExternalLink('https://easyhunting.app/register')"
							severity="secondary"
							outlined
							size="small"
							class="w-full"
						>
							<i class="pi pi-user-plus mr-2"></i>
							Create Free Account
						</Button>
					</div>
				</div>
			</template>
		</Card>
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

.max-w-md {
	max-width: 28rem;
}
</style>
