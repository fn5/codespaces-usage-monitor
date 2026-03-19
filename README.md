## Description
A quickly build VS Code extension to add a statusbar message to monitor your GitHub Codespaces includes hours.

The only thing I know now is that it works on my computer ☺️ \
I encourage you to test it, but use at your own risk!

Fetches your remaining core hours at the start of VS Code when the extension is enables,\
or when you enable the extension.
Fetches your remaining hours when clicking the statusbar message.

![alt text](Schermafbeelding%202025-06-08%20003332.png)

## Required Permissions

When you first use this extension, VS Code will ask you to sign in to GitHub and grant the **`user`** OAuth scope.

**What the `user` scope allows:**
- Read access to your public and private profile information (name, email, plan type, etc.)
- Write access to your public profile (bio, location, etc.)
- Access to your billing and usage data

**Why this extension needs it:**\
GitHub's billing API endpoint (`GET /users/{username}/billing/usage`) requires the full `user` scope.
The narrower `read:user` scope is not accepted by that endpoint, so this broader scope is unavoidable
with the current GitHub API design.

**What this extension actually does with the permission:**\
This extension is read-only. It only reads your account plan type and your monthly Codespaces billing
usage. It never modifies your profile or any other data. The access token is stored and managed
securely by VS Code's built-in authentication system and is never transmitted anywhere other than
the GitHub API.

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