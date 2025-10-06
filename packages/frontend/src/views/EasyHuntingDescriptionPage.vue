<script setup lang="ts">
import Card from 'primevue/card';

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
		<!-- Platform Overview -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-shield" style="color: hsl(var(--c-primary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">EasyHunting Platform Overview</span>
				</div>
			</template>
			<template #content>
				<p class="leading-relaxed" style="color: hsl(var(--c-surface-300))">
					EasyHunting is a professional security testing platform that simplifies penetration testing by providing a
					unified dashboard for managing targets, automating scans, integrating diverse tools, and delivering AI-powered
					insights. The platform is specifically designed for bug bounty hunters and security researchers to maximize
					efficiency and productivity.
				</p>
			</template>
		</Card>

		<!-- Key Features -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-star" style="color: hsl(var(--c-secondary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Platform Features</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Security Tools Marketplace</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Built-in marketplace for installing and managing penetration testing and reconnaissance tools
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Web-based Scan Management</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Create and configure security scans through intuitive dashboard interfaces
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Electron Agent Execution</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Desktop agent handles tool execution and communicates results back to the backend
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">AI-Powered Analysis</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Integrated AI capabilities that automate repetitive tasks, analyze results intelligently, and deliver
								actionable insights
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Internal Terminal</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Built-in terminal interface for viewing real-time tool execution output and results
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Hunting Browser</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Specialized browser component for performing specific operations during target testing phases
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<i class="pi pi-check-circle mt-1" style="color: hsl(var(--c-success-400))"></i>
						<div>
							<h4 class="font-semibold" style="color: hsl(var(--c-surface-200))">Result Upload System</h4>
							<p style="color: hsl(var(--c-surface-400))">
								Automated collection and upload of scan results to the backend for centralized management
							</p>
						</div>
					</div>
				</div>
			</template>
		</Card>

		<!-- Demo Video -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-video" style="color: hsl(var(--c-primary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Platform Demo</span>
				</div>
			</template>
			<template #content>
				<div class="space-y-4">
					<p class="leading-relaxed" style="color: hsl(var(--c-surface-300))">
						Watch this comprehensive demo video to see EasyHunting platform in action:
					</p>

					<!-- YouTube Video Embed -->
					<div class="relative w-full" style="padding-bottom: 56.25%; height: 0">
						<iframe
							class="absolute top-0 left-0 w-full h-full rounded-lg"
							src="https://www.youtube.com/embed/9fR9LDzXC9I"
							title="EasyHunting Platform Demo"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>
				</div>
			</template>
		</Card>

		<!-- Links -->
		<Card>
			<template #title>
				<div class="flex items-center gap-2">
					<i class="pi pi-link" style="color: hsl(var(--c-secondary-400))"></i>
					<span style="color: hsl(var(--c-surface-200))">Learn More</span>
				</div>
			</template>
			<template #content>
				<div class="flex flex-wrap gap-3">
					<a
						@click.prevent="openExternalLink('https://github.com/JoKeR7-Mo2a/EasyHunting')"
						href="#"
						class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
						style="border-color: hsl(var(--c-surface-600)); color: hsl(var(--c-surface-300))"
					>
						<i class="pi pi-github"></i>
						<span>GitHub Repository</span>
					</a>
					<a
						@click.prevent="openExternalLink('https://www.youtube.com/watch?v=9fR9LDzXC9I')"
						href="#"
						class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
						style="border-color: hsl(var(--c-surface-600)); color: hsl(var(--c-surface-300))"
					>
						<i class="pi pi-video"></i>
						<span>Watch Demo</span>
					</a>
					<a
						@click.prevent="openExternalLink('https://easyhunting.app/')"
						href="#"
						class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
						style="border-color: hsl(var(--c-surface-600)); color: hsl(var(--c-surface-300))"
					>
						<i class="pi pi-external-link"></i>
						<span>Official Website</span>
					</a>
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
