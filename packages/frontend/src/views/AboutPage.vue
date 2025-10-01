<script setup lang="ts">
import Card from 'primevue/card';
import Divider from 'primevue/divider';

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
	<div class="p-4 space-y-6">
		<!-- Plugin Overview -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-link" style="color: hsl(var(--c-info-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Plugin Overview</span>
				</div>
			</template>
			<template #content>
				<p class="leading-relaxed" style="color: hsl(var(--c-surface-300))">
					EasyHunting QuickScan Plugin serves as a bridge between Caido and the EasyHunting security platform. This
					integration allows you to seamlessly send scan requests from Caido directly to your EasyHunting instance for
					comprehensive security testing and analysis.
				</p>
			</template>
		</Card>

		<!-- Key Features -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-star" style="color: hsl(var(--c-secondary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Key Features</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Direct Integration</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Send scan requests directly from Caido to EasyHunting platform
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Streamlined Workflow</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Seamless workflow between reconnaissance and comprehensive scanning
							</p>
						</div>
					</div>
				</div>
			</template>
		</Card>

		<!-- Requirements -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-info-circle" style="color: hsl(var(--c-secondary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Requirements</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<i class="pi pi-dot-circle" style="color: hsl(var(--c-surface-500))"></i>
						<span style="color: hsl(var(--c-surface-300))">Active EasyHunting account</span>
					</div>
					<div class="flex items-center gap-2">
						<i class="pi pi-dot-circle" style="color: hsl(var(--c-surface-500))"></i>
						<span style="color: hsl(var(--c-surface-300))">Network access to EasyHunting platform</span>
					</div>
				</div>
			</template>
		</Card>

		<Divider />

		<!-- Footer -->
		<div class="text-center text-sm">
			<p style="color: hsl(var(--c-surface-400))">EasyHunting QuickScan Plugin v1.0.0</p>
			<p style="color: hsl(var(--c-surface-400))">
				For support, visit:
				<a
					@click.prevent="openExternalLink('https://easyhunting.app')"
					href="#"
					class="hover:underline cursor-pointer"
					style="color: hsl(var(--c-info-400))"
					>easyhunting.app</a
				>
			</p>
		</div>
	</div>
</template>

<style scoped>
.space-y-6 > * + * {
	margin-top: 1.5rem;
}

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
