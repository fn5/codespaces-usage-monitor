import * as vscode from 'vscode';
import * as Octokit from '@octokit/rest';
//const { runTests } = module.createRequire(import.meta.url)('@vscode/test-electron');

const GITHUB_AUTH_PROVIDER_ID = 'github';
// The GitHub Authentication Provider accepts the scopes described here:
// https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
//
// The `user` scope grants read/write access to public and private profile information
// (including email addresses, followers, and billing data). It is broader than ideal,
// but GitHub's billing API endpoint requires this full scope — the narrower `read:user`
// scope is not sufficient. This extension only reads data and never modifies the user's
// profile.
const SCOPES = ['user'];

export class Credentials {
	private octokit: Octokit.Octokit | undefined;

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

			return;
		}

		this.octokit = undefined;
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

		return this.octokit;
	}
}