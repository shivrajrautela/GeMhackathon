# 🐙 GitHub Repository Setup Guide

Setting up a GitHub repository is mandatory for hackathon submissions and the only safe way to share code with your teammate. 

> **🛡️ Security Check:** I have already updated your `.gitignore` file to ensure that folders like `node_modules` (which are huge) and files like `.env` (which contain your secret API keys) are **never** uploaded to GitHub.

---

## 🛠️ Step 1: Initialize Git on Your Computer
Open your terminal in the main project folder (`d:\vs code file\Internal_hackathon1`) and run these commands one by one:

```bash
# 1. Start tracking the project with Git
git init

# 2. Add all your folders and files to the staging area
git add .

# 3. Save this exact version of the code
git commit -m "Initial commit: Organized Frontend and Backend folders"

# 4. Make sure your main branch is called 'main'
git branch -M main
```

---

## 🌐 Step 2: Create the Repo on GitHub
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **"+"** icon in the top right and select **"New repository"**.
3. Name it something like `tender-verification-hackathon`.
4. Make it **Public** (or Private if you prefer).
5. **IMPORTANT:** Do *not* check the boxes for "Add a README" or "Add .gitignore". Leave them blank because we already have them locally!
6. Click **"Create repository"**.

---

## 🔗 Step 3: Link and Upload (Push) Your Code
After creating the repo, GitHub will show you a page with some code snippets. Look for the section titled **"…or push an existing repository from the command line"**.

Copy those two commands and run them in your VS Code terminal. They will look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/tender-verification-hackathon.git
git push -u origin main
```

*Congratulations! Your code is now live on GitHub.* 🎉

---

## 👨‍💻 Step 4: How Your Teammate Clones the Code
Send the GitHub link to your teammate. Have them open their terminal and run:

```bash
# 1. Download the code to their computer
git clone https://github.com/YOUR_USERNAME/tender-verification-hackathon.git

# 2. Go into the project folder
cd tender-verification-hackathon

# 3. Install frontend dependencies
cd frontend
npm install

# 4. Start the frontend server!
npm run dev
```

> **🔑 Note on API Keys (.env):** 
> Because we ignored `.env` files, your teammate won't have them when they clone the repo. You will need to privately copy-paste your `.env` variables to them on WhatsApp/Discord so they can create their own `.env` file locally!
