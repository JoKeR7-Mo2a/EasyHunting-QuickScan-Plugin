# EasyHunting QuickScan Plugin

A Caido plugin that integrates with the EasyHunting security scanning platform, allowing users to launch security scans directly from within Caido.

<img width="2558" height="1358" alt="image" src="https://github.com/user-attachments/assets/6b648b0e-0485-446d-9441-86145d2170cc" />

## ⚠️ Important Disclosures

This plugin requires the following external dependencies and services:

### Account Requirement

- **EasyHunting Account Required**: This plugin requires a valid EasyHunting platform account for full functionality
- **Authentication**: Users must authenticate with their EasyHunting credentials to access scanning tools

### External Services

- **EasyHunting Backend Server**: This plugin connects to external EasyHunting servers to:
  - Authenticate users and validate accounts
  - Retrieve available security tools lists
  - Submit scan configurations and target information
  - Receive scan results and status updates
- **Data Transmission**: The plugin sends target URLs, scan parameters, and receives tool outputs
- **No Client-Side Telemetry**: This plugin does not collect or transmit usage analytics

### Privacy & Data Handling

- Target URLs and scan parameters are transmitted to EasyHunting servers for processing
- All data transmission occurs over secure HTTPS connections
- No personal data is stored locally beyond authentication tokens
- For detailed privacy information, visit: [EasyHunting Privacy Policy](https://easyhunting.app/privacy)

### Internet Assets

- Loads tool configurations and scan results from EasyHunting servers
- Embeds YouTube videos for tutorial content
- Links to external documentation and resources

## Installation & Setup

1. Install the plugin through Caido's plugin store
2. Create an EasyHunting account at [easyhunting.app](https://easyhunting.app)
3. Authenticate within the plugin using your EasyHunting credentials
4. Select targets from your Caido project and launch scans

## Usage

Follow these simple steps to integrate Caido with EasyHunting platform for comprehensive security scanning:

1. **Authentication**: Log in with your EasyHunting credentials to establish a secure connection

2. **Target Selection**: Select targets from your EasyHunting dashboard for comprehensive scanning

3. **Select Input for Scanning**: Select the input you want to scan, right-click and choose "EasyHunting QuickScan" from the plugin menu, then select the tool you want to use for scanning

4. **Scan Execution**: The scan will be automatically added to your EasyHunting platform. Now open the EasyHunting program, select the new scans that have been added, and start the scanning process

5. **Results & Analysis**: View detailed results and analysis in your EasyHunting dashboard

## Video Tutorial

Watch this comprehensive step-by-step video tutorial to see exactly how the EasyHunting QuickScan Plugin integrates with Caido:

[![EasyHunting QuickScan Plugin - How It Works](https://img.youtube.com/vi/p5w1SBfoErI/maxresdefault.jpg)](https://www.youtube.com/watch?v=p5w1SBfoErI)

**[🎥 Watch Tutorial Video](https://www.youtube.com/watch?v=p5w1SBfoErI)**

_This video demonstrates the complete workflow from authentication to scan results analysis._

### Data Collection

- Target URLs and hostnames from your Caido project
- Scan configurations and parameters you specify
- Authentication tokens for EasyHunting platform access

### Data Usage

- Target information is sent to EasyHunting servers to execute security scans
- Scan results are retrieved and displayed within Caido
- No usage analytics or personal information is collected

### Data Storage

- Authentication tokens are stored locally in browser storage
- No scan data or results are stored locally
- All scan data is managed by EasyHunting platform servers

## Third-Party Services

This plugin integrates with the following external services:

### EasyHunting Platform

- **Purpose**: Security tool execution and scan management
- **Website**: [easyhunting.app](https://easyhunting.app)
- **Data Shared**: Target URLs, scan parameters, authentication credentials
- **Privacy Policy**: [EasyHunting Privacy Policy](https://easyhunting.app/privacy)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Plugin Issues: Create an issue in this repository
- EasyHunting Platform: Contact [joker7@easyhunting.app](mailto:joker7@easyhunting.app)
- Documentation: Visit [easyhunting.app/docs](https://easyhunting.app/docs)

## Technical Stack

- [pnpm](https://pnpm.io/) as package manager
- [TypeScript](https://www.typescriptlang.org/)
- [VueJS](https://vuejs.org/)
- [PrimeVue](https://primevue.org/) for UI components

## Disclaimer

This plugin is designed for authorized security testing only. Users are responsible for ensuring they have proper authorization before scanning any targets. The developers are not responsible for any misuse of this tool.
