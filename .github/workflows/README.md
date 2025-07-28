# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the tech-product-api microservice.

## 📋 Available Workflows

### 1. Pull Request Validation (`pull-request.yml`)

**Trigger**: Pull requests to `main` or `master` branch

**Purpose**: Validates code quality, tests, and build before merging

**Jobs**:
- **Build and Test Validation**: Runs linting, tests with coverage validation, and build verification
- **Security Scan**: Performs security audits and vulnerability scanning

**Quality Gates**:
- ✅ ESLint passes (code quality)
- ✅ All tests pass (239+ test cases)
- ✅ Test coverage ≥ 80% (currently 82.51%)
- ✅ Build succeeds
- ✅ Security audit passes
- ✅ No high-severity vulnerabilities

### 2. CI/CD Pipeline (`ci-cd.yml`)

**Trigger**: Push to `main` branch and pull requests

**Purpose**: Full CI/CD pipeline including deployment to production

**Jobs**:
- **test**: Validates build and tests
- **build-and-push**: Builds and pushes Docker image (main branch only)
- **deploy**: Deploys to Kubernetes cluster (main branch only)

## 🚀 Pull Request Process

### Before Creating a PR

1. **Ensure local tests pass**:
   ```bash
   npm run test:cov
   ```

2. **Check coverage meets requirements**:
   ```bash
   npm run test:cov
   # Verify coverage is ≥ 80%
   ```

3. **Run linting**:
   ```bash
   npm run lint
   ```

4. **Build the application**:
   ```bash
   npm run build
   ```

### Creating a Pull Request

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push to remote**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request** on GitHub targeting `main` branch

### PR Validation Process

The PR validation workflow will automatically run and check:

1. **Code Quality**:
   - ESLint validation
   - TypeScript compilation
   - Code formatting

2. **Testing**:
   - Unit tests execution (239+ tests)
   - Coverage validation (≥80% required)
   - BDD test scenarios validation

3. **Build Validation**:
   - Application build
   - Build artifacts verification

4. **Security**:
   - npm audit
   - Snyk vulnerability scan

### PR Requirements

**Branch Protection Rules** require:

- ✅ All status checks must pass
- ✅ At least 1 approving review
- ✅ Branch must be up to date with main
- ✅ No merge conflicts
- ✅ Conversation resolution (if any)

### PR Comments

The workflow automatically comments on PRs with:

- 📊 Test coverage summary
- ✅ Quality gate status
- 🎯 Ready for merge confirmation

## 📊 Test Coverage Requirements

### Current Coverage: 82.51%

**Coverage Breakdown**:
- **Statements**: 82.51%
- **Branches**: 85.18%
- **Functions**: 83.15%
- **Lines**: 82.22%

**Test Suites**: 13
- Domain Layer: 100% coverage
- Business Layer: 97%+ coverage
- Application Layer: 100% coverage
- Infrastructure Layer: 69%+ coverage

### Coverage Validation

The workflow validates:
- Minimum 80% overall coverage
- All test suites pass
- BDD implementation included

## 🔧 Troubleshooting

### Common Issues

1. **Coverage Below 80%**:
   - Add more unit tests
   - Ensure all code paths are tested
   - Check for untested edge cases

2. **Linting Errors**:
   - Run `npm run lint` locally
   - Fix formatting issues
   - Address ESLint warnings

3. **Build Failures**:
   - Check TypeScript compilation
   - Verify all imports are correct
   - Ensure no missing dependencies

4. **Security Vulnerabilities**:
   - Run `npm audit fix`
   - Update vulnerable dependencies
   - Review Snyk recommendations

### Manual Workflow Trigger

You can manually trigger the PR validation:

1. Go to Actions tab in GitHub
2. Select "Pull Request Validation"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## 📈 Quality Metrics

### Code Quality
- ESLint: 0 errors, 0 warnings
- TypeScript: Strict mode enabled
- Prettier: Consistent formatting

### Testing
- Unit Tests: 239+ test cases
- Coverage: 82.51% (above 80% requirement)
- BDD: Implemented across all test suites
- Mocking: Comprehensive dependency mocking

### Security
- npm audit: No moderate+ vulnerabilities
- Snyk: No high-severity issues
- Dependencies: Regularly updated

## 🎯 Best Practices

1. **Write Tests First**: Follow TDD/BDD approach
2. **Maintain Coverage**: Keep coverage above 80%
3. **Code Quality**: Follow ESLint rules
4. **Security**: Regular dependency updates
5. **Documentation**: Update docs with changes
6. **Small PRs**: Keep changes focused and reviewable

## 📞 Support

For workflow issues:
1. Check the Actions tab for detailed logs
2. Review the troubleshooting section
3. Contact the development team
4. Check GitHub Actions documentation 