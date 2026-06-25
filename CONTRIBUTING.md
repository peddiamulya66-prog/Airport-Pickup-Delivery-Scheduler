# Contributing Guidelines - Airport Pickup & Delivery Scheduler

## Welcome! 👋

Thank you for being part of the Airport Pickup & Delivery Scheduler internship project. This document explains how we work together as a team.

## Team Structure

```
Team of 3 Students:
├── Student 1: Frontend Developer
│   └── Responsible for UI/UX, forms, dashboard
├── Student 2: Backend Developer
│   └── Responsible for APIs, database, business logic
└── Student 3: Testing & Deployment
    └── Responsible for testing, GitHub, deployment
```

## Communication

### Daily Standups
- **When:** Start of each day
- **Duration:** 15 minutes
- **Format:** What you did yesterday, what you'll do today, any blockers
- **Location:** [Team meeting platform]

### Code Reviews
- All code must be reviewed before merging to main
- At least one other team member reviews each pull request
- Feedback is constructive and focused on code quality

### Documentation
- Keep README files updated
- Document complex functions with comments
- Update API documentation when endpoints change

## Git Workflow

### Branches

We follow this branching strategy:

```
main (production)
└── feature/[feature-name] (development)
```

### Branch Naming

- **Frontend:** `feature/frontend-[name]` (e.g., `feature/frontend-dashboard`)
- **Backend:** `feature/backend-[name]` (e.g., `feature/backend-api-requests`)
- **Bug fixes:** `bugfix/[issue-name]` (e.g., `bugfix/form-validation`)
- **Docs:** `docs/[name]` (e.g., `docs/api-reference`)

### Commit Messages

Write clear, descriptive commit messages:

```
✨ Add feature: Brief description (50 chars max)

Longer description if needed. Explain why this change 
was made and what it accomplishes.

Fixes: #123 (if closing an issue)
Related: #456 (if related to other work)
```

**Examples:**
- `✨ Add feature: Create POST /api/requests endpoint`
- `🐛 Fix: Correct form validation for weight field`
- `📚 Docs: Update API reference with new endpoints`
- `🎨 Style: Improve dashboard responsive layout`

**Emoji Guide:**
- ✨ `Feature` - New feature
- 🐛 `Bug` - Bug fix
- 📚 `Docs` - Documentation
- 🎨 `Style` - UI/styling changes
- ♻️ `Refactor` - Code refactoring
- ✅ `Test` - Adding tests
- 🚀 `Deploy` - Deployment changes

### Pull Requests

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with frequent commits

3. **Push your branch** to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** with:
   - Clear title
   - Description of changes
   - Link to related issues/tasks
   - Screenshots for UI changes

5. **Request review** from team member

6. **Address feedback** and update PR

7. **Merge** once approved
   ```bash
   git merge feature/your-feature-name
   ```

## Code Standards

### Frontend (HTML/CSS/JavaScript)

**File Structure:**
```
frontend/
├── index.html      # Main HTML
├── app.js          # Main JavaScript
├── styles.css      # Main CSS
├── components/     # Reusable components
└── assets/         # Images, fonts
```

**Naming Conventions:**
```javascript
// Variables and functions: camelCase
const customerName = "John Doe";
function handleFormSubmit() { }

// CSS classes: kebab-case
<div class="form-container"></div>

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000/api';
```

**Code Style:**
```javascript
// ✓ Good
const request = {
  customerName: "John",
  originAirport: "DEL",
  status: "pending"
};

// ✗ Avoid
const request = {customerName: "John",originAirport: "DEL",status: "pending"};
```

### Backend (Node.js/Express)

**File Structure:**
```
backend/
├── server.js           # Main server file
├── routes/             # API routes
├── controllers/        # Business logic
├── middleware/         # Custom middleware
├── models/            # Database models
├── config/            # Configuration
└── tests/             # Test files
```

**Naming Conventions:**
```javascript
// Functions: camelCase
function createPickupRequest() { }

// Database tables: snake_case
CREATE TABLE pickup_requests

// API endpoints: kebab-case and RESTful
GET /api/requests
POST /api/requests
PUT /api/requests/:id
DELETE /api/requests/:id
```

**API Response Format:**
```javascript
// ✓ Success
{
  "success": true,
  "data": { ... },
  "message": "Request created successfully"
}

// ✓ Error
{
  "success": false,
  "error": "Bad Request",
  "message": "Missing required field: customerName"
}
```

## Testing

### When to Test

- Test after every significant change
- Test before making a pull request
- Test edge cases and error scenarios

### How to Test Frontend

1. Open browser console (F12)
2. Check for JavaScript errors
3. Test form submission
4. Test all UI interactions
5. Test on different screen sizes

### How to Test Backend

1. Use Postman to test endpoints
2. Test with valid data
3. Test with missing fields
4. Test with invalid data types
5. Verify database changes

### Test Checklist Before PR

- [ ] No console errors
- [ ] All features working
- [ ] No hardcoded values
- [ ] Error handling in place
- [ ] Code follows style guide
- [ ] Comments where needed
- [ ] Documentation updated

## Documentation

### What to Document

1. **README.md** - Setup and overview
2. **API_REFERENCE.md** - All endpoints
3. **DATABASE_SCHEMA.md** - Database design
4. **ARCHITECTURE.md** - System design
5. **Code comments** - Complex logic
6. **Git commit messages** - What and why
7. **Logbook** - Daily progress

### Documentation Standards

```markdown
# Heading 1

## Heading 2

### Code Examples
\`\`\`javascript
const example = true;
\`\`\`

### Tables
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

### Lists
- Item 1
- Item 2
- Item 3
```

## Issues & Bug Reporting

### When to Create an Issue

- Found a bug
- Need a clarification
- Have a feature idea
- Need help with something

### Issue Template

```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
Add if applicable

## Assigned To
[Team member name]
```

## Code Review Checklist

When reviewing code, check for:

- [ ] Code follows style guide
- [ ] Variables are well named
- [ ] Comments are clear
- [ ] No hardcoded values
- [ ] Error handling is present
- [ ] Tests are included
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Performance is acceptable

## Deployment Guidelines

### Before Deploying

1. **Test thoroughly** - All tests pass
2. **Review changes** - Code review complete
3. **Update docs** - Documentation current
4. **Backup data** - Database backed up
5. **Notify team** - Let others know

### Deployment Process

```bash
# 1. Create release branch
git checkout -b release/v1.0.0

# 2. Bump version number
# Update package.json version

# 3. Test in staging
npm test

# 4. Deploy
npm run deploy

# 5. Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 6. Merge back to main
git checkout main
git merge release/v1.0.0
```

## Conflict Resolution

### If You Have a Merge Conflict

1. **Don't panic** - Conflicts are normal
2. **Open the file** in your editor
3. **Look for conflict markers**:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> branch-name
   ```
4. **Decide which version to keep**
5. **Remove conflict markers**
6. **Test thoroughly**
7. **Commit the fix**

## Performance Optimization

### Frontend
- Minimize CSS/JavaScript
- Lazy load images
- Use efficient selectors
- Cache API responses

### Backend
- Add database indexes
- Use pagination
- Implement caching
- Optimize queries

## Security Best Practices

- Never commit `.env` files with secrets
- Validate all user input
- Use HTTPS in production
- Keep dependencies updated
- Review code for vulnerabilities
- Don't commit API keys or passwords

## Team Responsibilities

### Frontend Student
- [ ] Create responsive UI
- [ ] Handle form validation
- [ ] Manage API integration
- [ ] Ensure good UX
- [ ] Test on multiple browsers

### Backend Student
- [ ] Build RESTful APIs
- [ ] Handle database operations
- [ ] Implement business logic
- [ ] Add error handling
- [ ] Write API documentation

### Testing & Deployment Student
- [ ] Create test cases
- [ ] Execute tests
- [ ] Manage GitHub repository
- [ ] Deploy to production
- [ ] Monitor performance

## Timeline & Milestones

| Milestone | Date | Deliverables |
|-----------|------|--------------|
| Review 1 | 06 June | Wireframes, objectives, abstract |
| Review 2 | 19-20 June | Architecture, DB design, code |
| Review 3 | 29-30 June | Full prototype, report, demo |

## Help & Support

- **Stuck?** Ask team member first
- **Need technical help?** Check documentation
- **Still stuck?** Ask mentor
- **Have ideas?** Share with team

## Final Checklist

Before every submission:

- [ ] All code committed to Git
- [ ] Pull request reviewed and merged
- [ ] Documentation updated
- [ ] Tests passing
- [ ] No errors in console
- [ ] Logbook updated
- [ ] Team notified

---

**Thank you for contributing! Together we'll build an awesome project. 🚀**

*For questions, reach out to your team or mentor.*
