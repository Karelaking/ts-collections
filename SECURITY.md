# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities in ts-collections seriously. If you discover a security vulnerability, please report it responsibly by emailing [security@example.com] rather than using the public issue tracker.

### Guidelines for Reporting

Please include the following in your security report:

1. **Description** - A clear description of the vulnerability
2. **Location** - The file(s) and line number(s) where the vulnerability exists
3. **Steps to Reproduce** - Detailed steps to reproduce the vulnerability
4. **Impact** - An analysis of the potential impact and severity
5. **Suggested Fix** - If you have one (optional)

### Response Timeline

- **Initial Response:** Within 48 hours of receiving a vulnerability report
- **Investigation:** We will investigate and develop a fix
- **Disclosure:** We will coordinate with you on the disclosure timeline
- **Release:** A security patch will be released as soon as possible

## Security Practices

### In Development

- All code is reviewed before merging
- TypeScript strict mode is enabled to catch type-related issues
- ESLint rules enforce code quality and security best practices
- Tests provide comprehensive coverage (100% for new code)
- Dependencies are kept up-to-date

### In Distribution

- Built artifacts are verified before publishing to NPM
- Source maps are included for debugging
- No credentials or secrets are included in the published package
- Dependencies are minimal and well-maintained

## Dependency Security

We actively monitor our dependencies for known vulnerabilities. Our dependencies include:

- **zod** - Runtime schema validation
- **yaml** - YAML parsing
- **path** - Path utilities

All dependencies are:
- Actively maintained
- Regularly updated
- Checked for known vulnerabilities
- Used with version pinning to ensure consistency

## Supported Versions

| Version | Status | Security Updates |
|---------|--------|------------------|
| 1.x     | Active | Yes              |

## Secrets and Credentials

**DO NOT** include any of the following in issues or pull requests:

- API keys or tokens
- Private credentials
- Environment variables with secrets
- Personal or sensitive information

If you accidentally commit secrets, please report it immediately via email.

## Best Practices for Users

When using ts-collections:

1. **Keep dependencies updated** - Regularly update to the latest version
2. **Use type-safe collections** - Enable strict mode (default) for runtime type checking
3. **Validate input data** - Use Zod schemas for complex validation scenarios
4. **Report issues privately** - Use the security reporting process for vulnerabilities

## CVE Disclosures

Any CVEs related to ts-collections will be published at:
- [CVE Database](https://cve.mitre.org/)
- GitHub Security Advisory

---

**Last Updated:** January 2026  
**Contact:** For security issues, please reach out to the maintainers privately
