# Scribble Hub

## Project info

**URL**: https://scribble-hub-45904.web.app/

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with the following technologies:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment Variables

To run this project locally, you'll need to create a `.env` file in the root of the project and add the necessary Firebase configuration variables. You can get these from your Firebase project settings.

A `.env.example` file is provided in the repository. You can copy it to `.env` and fill in the values:
`cp .env.example .env`

## How can I deploy this project?

This project is configured for continuous deployment to Firebase Hosting using GitHub Actions.

- **Preview Deployments**: When a pull request is opened, a preview version of the site is automatically deployed.
- **Production Deployment**: When a pull request is merged into the `main` branch, the site is automatically deployed to the live channel on Firebase Hosting.
