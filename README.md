## Description
A quickly build VS Code extension to add a statusbar message to monitor your GitHub Codespaces includes hours.

The only thing I know now is that it works on my computer ☺️ \
I encourage you to test it, but use at your own risk!

Fetches your remaining core hours at the start of VS Code when the extension is enables,\
or when you enable the extension.
Fetches your remaining hours when clicking the statusbar message.

![alt text](Schermafbeelding%202025-06-08%20003332.png)

## Required Permissions

When you first use this extension, VS Code will ask you to sign in to GitHub and grant the **`read:user`** OAuth scope.

**What the `read:user` scope allows:**
- Read-only access to your public and private profile information (name, login, etc.)

**What this extension actually does with the permission:**\
This extension is read-only. It retrieves your GitHub username directly from the VS Code
authentication session (no profile API call is made), and reads your Codespaces billing usage
from the GitHub billing API. The access token is stored and managed securely by VS Code's
built-in authentication system and is never transmitted anywhere other than the GitHub API.

**Note on plan type:**\
To keep the requested permissions as narrow as possible, this extension does not fetch your
GitHub plan from the API. Instead, it reads the plan from the `codespaces-usage-monitor.plan`
VS Code setting (default: `free`). If you are on GitHub Pro, change this setting to `pro` so
that the correct included-hours quota (180 h/month) is used.

**If the billing API returns an authorization error:**\
GitHub's billing usage endpoint may require a broader token scope than `read:user` in some
configurations. If you see a "refresh failed" message in the status bar, revoke the extension's
token in your [GitHub authorized apps settings](https://github.com/settings/apps/authorizations)
and re-connect — VS Code will ask for permission again.

## Known Issues
Will only work on VS Code 1.100+, because of the reliance on Octokit ESM.\
If there is demand, I will make it work for versions prior 1.100

There are no functional tests yet. I will write them for the next version.

Works only in VS Code Desktop. When there is demand, I will build it for VS Code Web

There is no icon yet. I would love to receive an icon made by you!
Contributions are highly welcomed. Just open a PR at the github repo.

## Feedback
Feedback is highly appreciated.\
Open een issue in the [GitHub Repo](https://github.com/cschot/codespaces-usage-monitor) for any issues, enhancements or feature requests.

## Changelog

### 0.0.1

Initial release

### 0.0.2

Added screenshot and changelog to README

### 0.0.3

Changed screenshot URL so it will show on VS code marketplace