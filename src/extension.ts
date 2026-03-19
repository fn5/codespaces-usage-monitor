// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
// credentials.js takes care of GitHub Authentication
import { Credentials } from './credentials.js';

export async function activate(context: vscode.ExtensionContext) {

	const credentials = new Credentials();
	credentials.initialize(context);

	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	context.subscriptions.push(myStatusBarItem);
	myStatusBarItem.command = "codespaces-usage-monitor.refresh"
	myStatusBarItem.tooltip = "Click to refresh"

	let username: string;
	let amountIncludedInPlan: number;

	try {
		// Octokit (https://github.com/octokit/rest.js#readme) is a library for making REST API calls to GitHub.
		const octokit = await credentials.getOctokit();

		//fetch user object of the authenticated user and destruct username and planName from it
		const {
			data: {
				login: authenticatedUsername, // const username = data.login
				plan: { name: planName } = { name: 'free' } // const planName = data.plan ? data.plan.name || data.plan.name = 'free'
			}
		} = await octokit.users.getAuthenticated();

		username = authenticatedUsername;

		// hardcode included core hours and core hour price as there is no way to fetch them with the API
		const coreHourPrice = 0.09
		amountIncludedInPlan = ({
			free: 120 * coreHourPrice,
			pro: 180 * coreHourPrice
		})[planName] || 0

		const refreshCommand = vscode.commands.registerCommand('codespaces-usage-monitor.refresh', async () => {
			try {
				const usage = await octokit.rest.billing.getGithubBillingUsageReportUser({
					username: username,
					month: new Date().getUTCMonth() + 1
				});

				let grossAmountThisMonth = 0
				for (const item of usage.data.usageItems || []) {
					grossAmountThisMonth += item.grossAmount
				}

				// round( hours * 10) / 10 for showing 1 decimal
				const remainningCoreHoursThisMonth = Math.round(((amountIncludedInPlan - grossAmountThisMonth) / coreHourPrice) * 10) / 10

				myStatusBarItem.text = `${remainningCoreHoursThisMonth} free hours left`
			} catch (err) {
				myStatusBarItem.text = `$(warning) Codespaces: refresh failed`
				const detail = err instanceof Error ? err.message : 'Failed to fetch usage data.'
				myStatusBarItem.tooltip = `${detail} Click to retry.`
			}
		})

		context.subscriptions.push(refreshCommand)
		myStatusBarItem.show()
		vscode.commands.executeCommand('codespaces-usage-monitor.refresh')
	} catch (err) {
		// Authentication was cancelled or failed; show a status bar prompt instead of crashing.
		// Clear the command so clicking the item does not invoke an unregistered command.
		myStatusBarItem.command = undefined
		myStatusBarItem.text = `$(github) Sign in to see Codespaces hours`
		myStatusBarItem.tooltip = 'Sign in to GitHub and re-enable the extension to see your Codespaces usage.'
		myStatusBarItem.show()
	}
}