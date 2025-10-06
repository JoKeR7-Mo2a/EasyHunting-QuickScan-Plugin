<script setup lang="ts">
import Card from 'primevue/card';
</script>

<template>
	<div class="p-4 space-y-6">
		<!-- How It Works -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-cog" style="color: hsl(var(--c-primary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">How It Works</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-4">
					<p class="leading-relaxed mb-6" style="color: hsl(var(--c-surface-300))">
						Follow these simple steps to integrate Caido with EasyHunting platform for comprehensive security scanning:
					</p>

					<div class="flex items-start gap-3">
						<div
							class="rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm"
							style="background-color: hsl(var(--c-info-800)); color: hsl(var(--c-info-200))"
						>
							1
						</div>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Authentication</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Log in with your EasyHunting credentials to establish a secure connection
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm"
							style="background-color: hsl(var(--c-info-800)); color: hsl(var(--c-info-200))"
						>
							2
						</div>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Target Selection</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Select targets from your EasyHunting dashboard for comprehensive scanning
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm"
							style="background-color: hsl(var(--c-info-800)); color: hsl(var(--c-info-200))"
						>
							3
						</div>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Select Input for Scanning</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Select the input you want to scan, right-click and choose "EasyHunting QuickScan" from the plugin menu,
								then select the tool you want to use for scanning
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm"
							style="background-color: hsl(var(--c-info-800)); color: hsl(var(--c-info-200))"
						>
							4
						</div>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Scan Execution</h4>
							<p style="color: hsl(var(--c-surface-400))">
								The scan will be automatically added to your EasyHunting platform. Now open the EasyHunting program,
								select the new scans that have been added, and start the scanning process
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm"
							style="background-color: hsl(var(--c-info-800)); color: hsl(var(--c-info-200))"
						>
							5
						</div>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Results & Analysis</h4>
							<p style="color: hsl(var(--c-surface-400))">
								View detailed results and analysis in your EasyHunting dashboard
							</p>
						</div>
					</div>
				</div>
			</template>
		</Card>

		<!-- Video Tutorial -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-video" style="color: hsl(var(--c-primary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Video Tutorial</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-4">
					<p class="leading-relaxed" style="color: hsl(var(--c-surface-300))">
						Watch this comprehensive step-by-step video tutorial to see exactly how the EasyHunting QuickScan Plugin
						integrates with Caido:
					</p>

					<!-- YouTube Video Embed -->
					<div class="relative w-full" style="padding-bottom: 56.25%; height: 0">
						<iframe
							class="absolute top-0 left-0 w-full h-full rounded-lg"
							src="https://www.youtube.com/embed/p5w1SBfoErI"
							title="EasyHunting QuickScan Plugin - How It Works"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>

					<div class="flex items-center gap-2 text-sm" style="color: hsl(var(--c-surface-400))">
						<i class="pi pi-info-circle"></i>
						<span>This video demonstrates the complete workflow from authentication to scan results analysis.</span>
					</div>
				</div>
			</template>
		</Card>

		<!-- Tips & Best Practices -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-lightbulb" style="color: hsl(var(--c-secondary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Tips & Best Practices</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Choose the Right Tool</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Select the appropriate security tool based on your target type and testing objectives
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Monitor Scan Progress</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Keep track of your scanning progress in the EasyHunting platform dashboard
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Analyze Results Thoroughly</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Review detailed scan results and leverage AI-powered insights for comprehensive analysis
							</p>
						</div>
					</div>
				</div>
			</template>
		</Card>
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
</style>
