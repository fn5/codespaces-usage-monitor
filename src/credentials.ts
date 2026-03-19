import * as vscode from 'vscode';
import * as Octokit from '@octokit/rest';
//const { runTests } = module.createRequire(import.meta.url)('@vscode/test-electron');

const GITHUB_AUTH_PROVIDER_ID = 'github';
// The GitHub Authentication Provider accepts the scopes described here:
// https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
//
// `read:user` grants read-only access to a user's profile data.
// This extension retrieves the username directly from the VS Code authentication
// session (session.account.label) and reads the plan from VS Code settings,
// so no API call to GET /user is needed. Only the billing usage endpoint is
// called, and `read:user` is the narrowest classic OAuth scope that may satisfy it.
const SCOPES = ['read:user'];

export class Credentials {
	private octokit: Octokit.Octokit | undefined;
	private _username: string | undefined;

	get username(): string | undefined {
		return this._username;
	}

	async initialize(context: vscode.ExtensionContext): Promise<void> {
		this.registerListeners(context);
		await this.setOctokit();
	}

	private async setOctokit() {
		/**
		 * By passing `createIfNone: false`, the extension silently checks for an existing session
		 * without prompting the user to sign in. The user is only asked to sign in when
		 * `getOctokit()` is called with `createIfNone: true`.
		 */
		const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: false });

		if (session) {
			this.octokit = new Octokit.Octokit({
				auth: session.accessToken
			});
			this._username = session.account.label;

			return;
		}

		this.octokit = undefined;
		this._username = undefined;
	}

	registerListeners(context: vscode.ExtensionContext): void {
		/**
		 * Sessions are changed when a user logs in or logs out.
		 */
		context.subscriptions.push(vscode.authentication.onDidChangeSessions(async e => {
			if (e.provider.id === GITHUB_AUTH_PROVIDER_ID) {
				await this.setOctokit();
			}
		}));
	}

	async getOctokit(): Promise<Octokit.Octokit> {
		if (this.octokit) {
			return this.octokit;
		}

		/**
		 * When the `createIfNone` flag is passed, a modal dialog will be shown asking the user to sign in.
		 * Note that this can throw if the user clicks cancel.
		 */
		const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: true });
		this.octokit = new Octokit.Octokit({
			auth: session.accessToken
		});
		this._username = session.account.label;

		return this.octokit;
	}
}