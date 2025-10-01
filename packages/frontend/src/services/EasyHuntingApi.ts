// EasyHunting API Service
export interface LoginRequest {
	identifier: string;
	password: string;
}

export interface LoginResponse {
	status: 'success' | 'failed';
	message?: string;
	token?: string;
	sessionId?: string;
	expiresIn?: string;
	user?: {
		id: string;
		username: string;
		email: string;
		planType: string;
		isActive: boolean;
		isEmailVerified: boolean;
		isTeamLeader: boolean;
		createdAt: string;
	};
	error?: string;
}

export interface ApiResponse<T = any> {
	status: 'success' | 'failed';
	message?: string;
	data?: T;
	error?: string;
}

export interface Target {
	_id: string;
	TargetName: string;
	TargetURL: string;
	created: string;
	updated?: string;
	TargetAccessLimited?: boolean;
}

export interface TargetsListResponse {
	status: 'success' | 'failed';
	AllTargetsCount: number;
	targets: Target[];
	totalReturned: number;
	filteredByPermissions?: boolean;
	error?: string;
}

export interface ToolsListResponse {
	status: 'success' | 'storage_limit_exceeded' | 'error';
	tools: string[];
	message?: string;
	userPlanType?: string;
	error?: string;
}

export interface ToolExtraArgsResponse {
	status: 'success' | 'error';
	toolname: string;
	extraArgs: any[];
	error?: string;
}

export interface AddScanRequest {
	action: 'addscan';
	TargetName: string;
	tool: string;
	toolParams: {
		extraArgs: any[];
		input: string;
	};
}

// EasyHunting API configuration
const EASYHUNTING_API_BASE = 'https://api.easyhunting.app/api';

// Storage keys
export const STORAGE_KEYS = {
	AUTH_TOKEN: 'EasyHunting_AuthToken',
	USER_INFO: 'EasyHunting_UserInfo',
	CURRENT_TARGET: 'CurrentTarget',
	TOOLS_LIST: 'ToolsList'
};

class EasyHuntingApiService {
	/**
	 * Get stored authentication token
	 */
	getAuthToken(): string | null {
		return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
	}

	/**
	 * Get stored user information
	 */
	getUserInfo(): any | null {
		const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
		if (userInfoStr) {
			try {
				return JSON.parse(userInfoStr);
			} catch (error) {
				console.error('Error parsing user info:', error);
				return null;
			}
		}
		return null;
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		return !!this.getAuthToken();
	}

	/**
	 * Clear authentication data
	 */
	clearAuth(): void {
		localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
		localStorage.removeItem(STORAGE_KEYS.USER_INFO);
	}

	/**
	 * Make authenticated API request
	 */
	private async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		const token = this.getAuthToken();

		const defaultHeaders: HeadersInit = {
			'Content-Type': 'application/json'
		};

		if (token) {
			defaultHeaders['Authorization'] = `Bearer ${token}`;
		}

		const requestOptions: RequestInit = {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers
			}
		};

		try {
			const response = await fetch(`${EASYHUNTING_API_BASE}${endpoint}`, requestOptions);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('API request error:', error);
			return {
				status: 'failed',
				error: 'Network error occurred'
			};
		}
	}

	/**
	 * Login user
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		try {
			const response = await fetch(`${EASYHUNTING_API_BASE}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'loginUser',
					...credentials
				})
			});

			const data: LoginResponse = await response.json();

			// If login successful, store auth data
			if (data.status === 'success' && data.token && data.user) {
				localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
				localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
			}

			return data;
		} catch (error) {
			console.error('Login API request error:', error);
			return {
				status: 'failed',
				error: 'Network error occurred'
			};
		}
	}

	/**
	 * Logout user
	 */
	logout(): void {
		this.clearAuth();
	}

	/**
	 * Validate current token
	 */
	async validateToken(): Promise<boolean> {
		if (!this.isAuthenticated()) {
			return false;
		}

		try {
			const token = this.getAuthToken();

			const response = await fetch(`${EASYHUNTING_API_BASE}/validateToken`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			const data = await response.json();

			if (data.status !== 'success') {
				this.clearAuth();
				return false;
			}

			return true;
		} catch (error) {
			console.error('Token validation error:', error);
			this.clearAuth();
			return false;
		}
	}

	/**
	 * Get targets list
	 */
	async getTargetsList(): Promise<TargetsListResponse> {
		try {
			const token = this.getAuthToken();

			if (!token) {
				return {
					status: 'failed',
					error: 'Authentication required',
					AllTargetsCount: 0,
					targets: [],
					totalReturned: 0
				};
			}

			const response = await fetch(`${EASYHUNTING_API_BASE}/targets`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					action: 'getTargetList'
				})
			});

			const data: TargetsListResponse = await response.json();
			return data;
		} catch (error) {
			console.error('Get targets list error:', error);
			return {
				status: 'failed',
				error: 'Network error occurred',
				AllTargetsCount: 0,
				targets: [],
				totalReturned: 0
			};
		}
	}

	/**
	 * Get current selected target
	 */
	getCurrentTarget(): Target | null {
		const targetStr = localStorage.getItem(STORAGE_KEYS.CURRENT_TARGET);
		if (targetStr) {
			try {
				return JSON.parse(targetStr);
			} catch (error) {
				console.error('Error parsing current target:', error);
				return null;
			}
		}
		return null;
	}

	/**
	 * Set current selected target
	 */
	setCurrentTarget(target: Target): void {
		localStorage.setItem(STORAGE_KEYS.CURRENT_TARGET, JSON.stringify(target));
	}

	/**
	 * Clear current target
	 */
	clearCurrentTarget(): void {
		localStorage.removeItem(STORAGE_KEYS.CURRENT_TARGET);
	}

	/**
	 * Get tools list from EasyHunting
	 */
	async getToolsList(): Promise<ToolsListResponse> {
		try {
			const token = this.getAuthToken();

			if (!token) {
				return {
					status: 'error',
					tools: [],
					error: 'Authentication required'
				};
			}

			const response = await fetch(`${EASYHUNTING_API_BASE}/ToolsManager`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					action: 'getSideBarToolsList'
				})
			});

			const data: ToolsListResponse = await response.json();

			// Store tools list in localStorage if successful
			if (data.status === 'success' && data.tools) {
				localStorage.setItem(STORAGE_KEYS.TOOLS_LIST, JSON.stringify(data.tools));
			}

			return data;
		} catch (error) {
			console.error('Get tools list error:', error);
			return {
				status: 'error',
				tools: [],
				error: 'Network error occurred'
			};
		}
	}

	/**
	 * Get cached tools list from localStorage
	 */
	getCachedToolsList(): string[] {
		const toolsStr = localStorage.getItem(STORAGE_KEYS.TOOLS_LIST);
		if (toolsStr) {
			try {
				return JSON.parse(toolsStr);
			} catch (error) {
				console.error('Error parsing cached tools list:', error);
				return [];
			}
		}
		return [];
	}

	/**
	 * Clear cached tools list
	 */
	clearCachedToolsList(): void {
		localStorage.removeItem(STORAGE_KEYS.TOOLS_LIST);
	}

	/**
	 * Get tool extra arguments
	 */
	async getToolExtraArgs(toolname: string): Promise<ToolExtraArgsResponse> {
		try {
			const token = this.getAuthToken();

			if (!token) {
				return {
					status: 'error',
					toolname,
					extraArgs: [],
					error: 'Authentication required'
				};
			}

			const response = await fetch(`${EASYHUNTING_API_BASE}/ToolsManager`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					action: 'getToolsExtraArgs',
					toolname
				})
			});

			const data: ToolExtraArgsResponse = await response.json();
			return data;
		} catch (error) {
			console.error('Get tool extra args error:', error);
			return {
				status: 'error',
				toolname,
				extraArgs: [],
				error: 'Network error occurred'
			};
		}
	}

	/**
	 * Add scan to EasyHunting
	 */
	async addScan(scanData: AddScanRequest): Promise<ApiResponse> {
		try {
			const token = this.getAuthToken();

			if (!token) {
				return {
					status: 'failed',
					error: 'Authentication required'
				};
			}

			const response = await fetch(`${EASYHUNTING_API_BASE}/scanlist`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(scanData)
			});

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Add scan error:', error);
			return {
				status: 'failed',
				error: 'Network error occurred'
			};
		}
	}

	/**
	 * Send scan request to EasyHunting (placeholder for future implementation)
	 */
	async sendScanRequest(targets: string[], scanType: string): Promise<ApiResponse> {
		// This will be implemented in future iterations
		console.log('Sending scan request:', { targets, scanType });

		return this.makeRequest('/scanlist', {
			method: 'POST',
			body: JSON.stringify({
				action: 'createScan',
				targets,
				scanType
			})
		});
	}
}

// Export singleton instance
export const easyHuntingApi = new EasyHuntingApiService();
export default EasyHuntingApiService;
