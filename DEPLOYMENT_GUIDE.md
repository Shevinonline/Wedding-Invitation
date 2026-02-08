# How to Deploy Your Wedding Invitation Website to Vercel

You can deploy your website for free in just a few minutes using Vercel. Here are two easy methods:

## Method 1: Drag & Drop (Easiest)

1.  Go to [Vercel](https://vercel.com/dashboard) and create an account (or log in).
2.  Click the **"Add New..."** button and select **"Project"**.
3.  Look for the **"Import Git Repository"** screen, but instead of clicking Import:
    *   Find the subtle **"Upload"** link/area or simply **Drag and Drop** your entire `wed inv` folder from your Desktop into the browser window.
4.  Follow the prompts to deploy.

## Method 2: GitHub Integration (Recommended for Updates)

This method is better because every time you edit a file and push to GitHub, your website updates automatically.

1.  **Create a GitHub Repository**:
    *   Go to [GitHub.com](https://github.com) and create a new repository (e.g., `wedding-invite`).

2.  **Push your code**:
    *   Open your terminal in this folder (`/Users/shevinnikesh/Desktop/wed inv`).
    *   Run these commands:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/wedding-invite.git
        git push -u origin main
        ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

3.  **Connect to Vercel**:
    *   Go to [Vercel](https://vercel.com/dashboard).
    *   Click **"Add New Project"**.
    *   Select **"Continue with GitHub"**.
    *   Find your `wedding-invite` repository and click **"Import"**.
    *   Click **"Deploy"**.

## After Deployment

*   Vercel will give you a domain like `wedding-invite-shevin-hansani.vercel.app`.
*   You can buy a custom domain (e.g., `hansaniandshevin.com`) and add it in the Vercel project settings -> **Domains**.

---

**Note**: Your Google Sheet integration will continue to work perfectly on the deployed site because the script URL is external!
