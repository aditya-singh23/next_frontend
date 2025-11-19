# Husky Git Hooks Setup

## Overview
Husky is configured to run automated checks before commits to ensure code quality and consistency.

## What's Configured

### **1. Pre-commit Hook** (`.husky/pre-commit`)
Runs automatically before every commit to check code quality.

**What it does:**
- ✅ **ESLint** - Fixes linting errors automatically
- ✅ **Prettier** - Formats code automatically
- ✅ **Staged files only** - Only checks files you're committing

**Files checked:**
- TypeScript/JavaScript: `*.ts`, `*.tsx`, `*.js`, `*.jsx`
- JSON, CSS, Markdown: `*.json`, `*.css`, `*.md`

### **2. Lint-staged Configuration**
Defined in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## How It Works

### **Normal Commit Flow:**
```bash
git add .
git commit -m "feat: add user dashboard"
```

**What happens:**
1. Husky intercepts the commit
2. Lint-staged runs on staged files
3. ESLint fixes any linting issues
4. Prettier formats the code
5. If successful, commit proceeds
6. If errors, commit is blocked

### **Example Output:**

**✅ Successful commit:**
```
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main abc1234] feat: add user dashboard
 3 files changed, 45 insertions(+), 2 deletions(-)
```

**❌ Failed commit (with errors):**
```
✖ Running tasks for staged files...
  ✖ eslint --fix
    Error: 'user' is not defined
✖ lint-staged failed
```

## Available Scripts

### **Format all files:**
```bash
npm run format
```
Formats all TypeScript, JavaScript, JSON, CSS files in `src/`

### **Check formatting:**
```bash
npm run format:check
```
Checks if files are formatted correctly (doesn't modify)

### **Run linter:**
```bash
npm run lint
```
Runs Next.js ESLint on the entire project

## Configuration Files

### **1. `.prettierrc`**
Prettier formatting rules:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

### **2. `.eslintrc.json`**
ESLint configuration:
```json
{
  "extends": "next/core-web-vitals"
}
```

### **3. `.prettierignore`**
Files/folders Prettier should ignore (if exists)

## Bypassing Hooks (Emergency Only)

### **Skip pre-commit hook:**
```bash
git commit -m "message" --no-verify
```

⚠️ **Warning:** Only use this in emergencies. It bypasses all quality checks.

## Common Issues & Solutions

### **Issue 1: Commit blocked by linting errors**
**Solution:**
```bash
# Run lint to see errors
npm run lint

# Fix errors manually or run
npm run lint -- --fix

# Then commit again
git commit -m "your message"
```

### **Issue 2: Formatting conflicts**
**Solution:**
```bash
# Format all files
npm run format

# Stage the formatted files
git add .

# Commit
git commit -m "your message"
```

### **Issue 3: Husky not running**
**Solution:**
```bash
# Reinstall Husky hooks
npm run prepare

# Or manually
npx husky install
```

### **Issue 4: "command not found" error**
**Solution:**
```bash
# Make sure dependencies are installed
npm install

# Reinstall Husky
npm run prepare
```

## Benefits

### **1. Code Quality**
- ✅ Consistent code style across the team
- ✅ Catches errors before they reach the repository
- ✅ Automatic formatting saves time

### **2. Team Collaboration**
- ✅ Everyone follows the same standards
- ✅ Reduces code review time
- ✅ Prevents "style wars" in PRs

### **3. Automation**
- ✅ No manual formatting needed
- ✅ Catches issues early
- ✅ Reduces CI/CD failures

## Best Practices

### **1. Commit Often**
Make small, focused commits. Husky runs faster on fewer files.

### **2. Fix Issues Immediately**
If Husky blocks a commit, fix the issues right away.

### **3. Don't Skip Hooks**
Avoid using `--no-verify` unless absolutely necessary.

### **4. Keep Dependencies Updated**
```bash
npm update husky lint-staged
```

## Customization

### **Add more file types:**
Edit `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"],
    "*.scss": ["prettier --write"],  // Add SCSS
    "*.html": ["prettier --write"]   // Add HTML
  }
}
```

### **Add custom scripts:**
Edit `.husky/pre-commit`:
```bash
npx lint-staged
npm run test  # Add tests before commit
```

### **Add type checking:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "tsc --noEmit",  // Type check
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Troubleshooting

### **Husky not installed?**
```bash
npm install --save-dev husky lint-staged
npm run prepare
```

### **Hooks not executable?**
```bash
chmod +x .husky/pre-commit
```

### **Git hooks not working?**
```bash
# Check Git hooks path
git config core.hooksPath

# Should output: .husky
```

## Team Setup

When a new team member clones the repository:

```bash
# Install dependencies (includes Husky)
npm install

# Husky hooks are automatically installed via "prepare" script
# No additional setup needed!
```

## CI/CD Integration

Husky runs locally, but you should also run checks in CI/CD:

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint

- name: Format Check
  run: npm run format:check
```

## Summary

✅ **Husky is now configured!**
- Pre-commit hook runs ESLint + Prettier
- Only staged files are checked
- Automatic code formatting
- Blocks commits with errors
- Easy to customize

**Next steps:**
1. Make a test commit to see it in action
2. Share this guide with your team
3. Enjoy automated code quality! 🎉
