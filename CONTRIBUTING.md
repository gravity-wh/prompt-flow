# Contributing to PromptFlow

Thank you for your interest in contributing to PromptFlow! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add new features
- 🎨 Improve UI/UX
- ⚡ Optimize performance

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/prompt-flow.git
cd prompt-flow
npm install
```

### 2. Set Up Development Environment

Follow the [QUICKSTART.md](QUICKSTART.md) guide to set up Supabase and environment variables.

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 5. Test

```bash
# Run lint
npm run lint

# Build the project
npm run build

# Test manually
npm run dev
```

### 6. Commit

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 7. Push & Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear title and description
- Link to related issues
- Screenshots (for UI changes)
- Testing steps

## 📝 Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
export interface User {
  id: string
  name: string
}

function getUserName(user: User): string {
  return user.name
}

// ❌ Avoid
function getUserName(user: any) {
  return user.name
}
```

### React Components

```typescript
// ✅ Good - Descriptive names, typed props
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export default function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}

// ❌ Avoid - Unclear names, no types
export default function Btn(props: any) {
  return <button onClick={props.click}>{props.text}</button>
}
```

### Tailwind CSS

```typescript
// ✅ Good - Organized, readable
<div className="
  flex items-center justify-between
  px-4 py-2
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">

// ❌ Avoid - Single long line
<div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

### File Organization

```
src/
├── app/              # Pages and API routes
│   ├── actions/     # Server Actions
│   └── [route]/     # Individual routes
├── components/       # Reusable components
├── lib/             # Utilities and helpers
└── types/           # TypeScript types
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Works with and without authentication
- [ ] No broken links
- [ ] Images load correctly
- [ ] Forms validate properly

### Testing New Features

1. **Authentication Required**: Test both logged-in and logged-out states
2. **Database Changes**: Test create, read, update, delete operations
3. **UI Changes**: Test on different screen sizes
4. **Forms**: Test validation, error messages, success states

## 📦 Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Commit messages are clear
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console warnings/errors
- [ ] Build succeeds (`npm run build`)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Tested on mobile

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
```

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**:
   ```
   1. Go to '...'
   2. Click on '...'
   3. See error
   ```
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Environment**:
   - OS: [e.g., macOS, Windows]
   - Browser: [e.g., Chrome, Safari]
   - Version: [e.g., 22]

## 💡 Feature Requests

When suggesting features, include:

1. **Problem**: What problem does this solve?
2. **Solution**: How should it work?
3. **Alternatives**: Other solutions you considered
4. **Examples**: Similar features in other apps

## 🎨 UI/UX Contributions

For design contributions:

- Follow existing design patterns
- Maintain consistency
- Consider accessibility (colors, contrast, keyboard navigation)
- Test on different devices
- Provide mockups/screenshots

## 📚 Documentation Contributions

Documentation improvements are always welcome!

- Fix typos and grammar
- Add examples
- Clarify confusing sections
- Add diagrams
- Translate to other languages

## 🔒 Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email the maintainers directly with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 🤝 Code Review Process

1. Maintainer reviews PR
2. Feedback provided (if needed)
3. Author makes changes
4. Final review
5. Merge! 🎉

**Review criteria:**
- Code quality
- Tests coverage
- Documentation
- Performance impact
- Security implications

## 🌟 Recognition

Contributors will be:
- Listed in README
- Credited in release notes
- Added to contributors page (when we build it!)

## 📞 Questions?

- Open a discussion on GitHub
- Check existing issues
- Read the documentation:
  - [README.md](README.md)
  - [DEVELOPMENT.md](DEVELOPMENT.md)
  - [ARCHITECTURE.md](ARCHITECTURE.md)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated!

Happy coding! 🚀
