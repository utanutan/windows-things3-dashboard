# Code Review Report: Windows Things3 Dashboard

**Reviewer**: Review-Guardian Agent
**Date**: 2026-02-02
**Project**: Windows Things3 Dashboard (Next.js 15 + React 18)
**Total Files Reviewed**: 79 files (25 components, 6 pages, 8 API routes, 4 custom hooks, utilities, types)

---

## Executive Summary

Overall code quality is **GOOD** with strong TypeScript typing, comprehensive validation, and adherence to Next.js best practices. The codebase demonstrates solid architecture with proper separation of concerns. However, several **Critical** and **Major** issues require immediate attention before production deployment.

**Status**: REQUIRES FIXES (差し戻し)

---

## Critical Issues (Must Fix)

### CRIT-1: Missing Input Sanitization in API Routes
**Location**: `src/app/api/tasks/route.ts`, `src/app/api/tasks/[id]/complete/route.ts`
**Severity**: CRITICAL - Security Vulnerability

**Issue**: While validation exists, there's no explicit HTML/XSS sanitization before storing user input in the backend API.

**Evidence**:
```typescript
// src/app/api/tasks/route.ts:15
const body = await request.json() as CreateTaskRequest

// Validation exists but no sanitization
const titleValidation = validateTaskTitle(body.title)
```

**Risk**: Potential stored XSS if the Mac API or future UI displays unsanitized content.

**Recommendation**:
- Add `sanitizeString()` to all user inputs before sending to backend API
- Consider using a library like `dompurify` (server-side) for notes/description fields
- Update validation.ts to include HTML entity encoding

**Fix Priority**: P0 (Blocker)

---

### CRIT-2: Missing Rate Limiting on API Routes
**Location**: All API routes in `src/app/api/*`
**Severity**: CRITICAL - Security & Performance

**Issue**: No rate limiting implemented on any API endpoints.

**Risk**:
- DoS attacks via repeated task creation
- Resource exhaustion
- Abuse of search endpoints

**Recommendation**:
Implement rate limiting middleware using `next-rate-limit` or similar:
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
```

**Fix Priority**: P0 (Blocker)

---

### CRIT-3: Environment Variables Exposed to Client
**Location**: `src/lib/config.ts:46-55`
**Severity**: CRITICAL - Security Configuration

**Issue**: `NEXT_PUBLIC_MOCK_MODE` allows client-side code to toggle between mock and real API modes.

**Evidence**:
```typescript
// .env.example:3
NEXT_PUBLIC_MOCK_MODE=false
```

**Risk**: Malicious users could manipulate this to bypass real API validation or expose internal endpoints.

**Recommendation**:
- Remove `NEXT_PUBLIC_MOCK_MODE` from client-side config
- Control mock mode purely server-side via `NODE_ENV` or server-only env vars
- Use `MOCK_MODE` (without NEXT_PUBLIC prefix) for server-side only

**Fix Priority**: P0 (Blocker)

---

### CRIT-4: Missing Error Details Sanitization
**Location**: `src/lib/types/api.ts:48-65`
**Severity**: CRITICAL - Information Disclosure

**Issue**: API errors may expose internal stack traces or sensitive details to client.

**Evidence**:
```typescript
static async fromResponse(response: Response): Promise<APIError> {
  let details: string | undefined
  if (data.details) {
    details = data.details  // No sanitization
  }
}
```

**Risk**: Stack traces, database errors, or internal paths could leak to client.

**Recommendation**:
- Never pass raw `details` to client in production
- Add environment check: only include details in development
- Log full errors server-side, return generic messages to client

**Fix Priority**: P0 (Blocker)

---

## Major Issues (Should Fix)

### MAJ-1: Missing CSRF Protection
**Location**: All POST/PUT/DELETE API routes
**Severity**: MAJOR - Security

**Issue**: No CSRF token validation on state-changing operations.

**Recommendation**:
- Implement CSRF tokens for all mutations
- Use Next.js middleware or custom CSRF solution
- Consider using SameSite cookies

**Fix Priority**: P1 (High)

---

### MAJ-2: No Request Validation Schema
**Location**: API routes (e.g., `src/app/api/tasks/route.ts`)
**Severity**: MAJOR - Data Integrity

**Issue**: Manual validation instead of schema-based validation (Zod, Yup).

**Evidence**:
```typescript
// Manual validation, no type narrowing
if (body.due_date) {
  const dateValidation = validateDateString(body.due_date)
  if (!dateValidation.valid) {
    return NextResponse.json({ error: dateValidation.error }, { status: 400 })
  }
}
```

**Recommendation**:
- Adopt Zod or Yup for schema validation
- Benefits: Type inference, better error messages, easier maintenance

**Example**:
```typescript
import { z } from 'zod'

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  notes: z.string().max(10000).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
})
```

**Fix Priority**: P1 (High)

---

### MAJ-3: Missing Input Length Limits in Frontend
**Location**: `src/components/ui/Input.tsx`, `TaskCreateForm.tsx`
**Severity**: MAJOR - UX & Security

**Issue**: No `maxLength` attribute on input fields, allowing users to enter >500 characters before validation error.

**Evidence**:
```typescript
// Input.tsx has no maxLength enforcement
<input
  ref={ref}
  id={inputId}
  className={...}
  // Missing: maxLength prop
  {...props}
/>
```

**Recommendation**:
Add `maxLength` to all inputs:
```typescript
<Input
  label="Task Title"
  maxLength={500}  // Add this
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

**Fix Priority**: P1 (High)

---

### MAJ-4: Missing Content Security Policy (CSP)
**Location**: `next.config.js`, headers configuration
**Severity**: MAJOR - Security

**Issue**: No CSP headers configured to prevent XSS attacks.

**Recommendation**:
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ]
  },
}
```

**Fix Priority**: P1 (High)

---

### MAJ-5: Unhandled Error in SWR Fetcher
**Location**: `src/hooks/useTasks.ts:11-18`
**Severity**: MAJOR - Error Handling

**Issue**: Generic error thrown without detailed error handling.

**Evidence**:
```typescript
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('Failed to fetch')  // Generic error
    throw error
  }
  return res.json()
}
```

**Recommendation**:
```typescript
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const error = new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`)
    throw error
  }
  return res.json()
}
```

**Fix Priority**: P1 (High)

---

### MAJ-6: Missing Accessibility - Focus Management in Modal
**Location**: `src/components/ui/Modal.tsx:83-116`
**Severity**: MAJOR - Accessibility (WCAG 2.1 Level AA)

**Issue**: Focus trap implementation exists but doesn't restore focus on close.

**Evidence**:
```typescript
// Modal.tsx has focus trap but no focus restoration
useEffect(() => {
  if (!isOpen || !modalRef.current) return
  const firstElement = focusableElements[0] as HTMLElement
  firstElement?.focus()  // Focus on open, but no restoration on close
}, [isOpen])
```

**Recommendation**:
```typescript
useEffect(() => {
  if (isOpen) {
    const previouslyFocused = document.activeElement as HTMLElement
    return () => {
      previouslyFocused?.focus() // Restore focus on close
    }
  }
}, [isOpen])
```

**Fix Priority**: P1 (High)

---

### MAJ-7: Missing Error Boundary for Route Segments
**Location**: `src/app/layout.tsx`, individual pages
**Severity**: MAJOR - Error Handling

**Issue**: Only one global ErrorBoundary in providers. Route-level errors should have granular boundaries.

**Evidence**:
```typescript
// src/app/layout.tsx
<Providers>
  <LayoutClient>{children}</LayoutClient>
</Providers>
// No per-route error boundaries
```

**Recommendation**:
Wrap individual pages/sections with ErrorBoundary for better error isolation:
```typescript
// src/app/page.tsx
export default function InboxPage() {
  return (
    <ErrorBoundary fallback={(error) => <ErrorDisplay error={error} />}>
      <TaskList ... />
    </ErrorBoundary>
  )
}
```

**Fix Priority**: P1 (High)

---

### MAJ-8: Zustand Store Not Persisted
**Location**: `src/stores/uiStore.ts`
**Severity**: MAJOR - UX

**Issue**: UI preferences (sidebar collapsed state) are not persisted across sessions.

**Recommendation**:
```typescript
import { persist } from 'zustand/middleware'

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({ ... }),
    { name: 'ui-storage' }
  )
)
```

**Fix Priority**: P2 (Medium)

---

## Minor Issues (Nice to Fix)

### MIN-1: Inconsistent Error Handling in API Routes
**Location**: Multiple API routes
**Severity**: MINOR - Code Quality

**Issue**: Some routes log errors to console, others don't. Inconsistent error response format.

**Recommendation**: Standardize error handling with a shared utility:
```typescript
export function handleAPIError(error: unknown, context: string) {
  console.error(`[${context}]`, error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

---

### MIN-2: Missing Loading States in Modal
**Location**: `src/components/ui/Modal.tsx`
**Severity**: MINOR - UX

**Issue**: No loading skeleton when modal content is async.

**Recommendation**: Add `isLoading` prop to Modal component.

---

### MIN-3: Hard-coded Timeout Values
**Location**: `src/lib/api/client.ts:76-77`
**Severity**: MINOR - Configuration

**Issue**: Default timeout and retry values are hard-coded.

**Evidence**:
```typescript
timeout = serverConfig.apiTimeout,  // Good, uses config
maxRetries = serverConfig.apiMaxRetries,  // Good
retryDelay = 1000,  // Hard-coded
```

**Recommendation**: Add `API_RETRY_DELAY` to config.

---

### MIN-4: Missing `lang` Attribute Values
**Location**: `src/app/layout.tsx:18`
**Severity**: MINOR - Accessibility

**Issue**: `lang="en"` is hard-coded, no i18n support.

**Recommendation**: If i18n is planned, prepare for dynamic lang attribute.

---

### MIN-5: Console Warnings Not Suppressed in Production
**Location**: `src/lib/api/client.ts:100-102`, `src/lib/config.ts:107-111`
**Severity**: MINOR - Production Noise

**Issue**: `console.warn` and `console.log` in production code.

**Recommendation**:
```typescript
if (process.env.NODE_ENV !== 'production') {
  console.warn(...)
}
```

---

### MIN-6: Missing aria-live for Toast Notifications
**Location**: `src/components/ui/Toast.tsx` (not found in review)
**Severity**: MINOR - Accessibility

**Issue**: Toast component not found. If implemented, ensure `aria-live="polite"` or `"assertive"`.

**Recommendation**: Add ARIA live regions for dynamic notifications.

---

### MIN-7: Date Validation Timezone Issues
**Location**: `src/lib/utils/validation.ts:65-79`
**Severity**: MINOR - Data Integrity

**Issue**: Date validation uses `new Date()` which is timezone-dependent.

**Evidence**:
```typescript
const date = new Date(dateString)
if (date.getMonth() + 1 !== month) {
  return { valid: false, error: 'Invalid date' }
}
```

**Risk**: `2024-02-29` might be valid in UTC but invalid in user's timezone.

**Recommendation**: Use UTC methods or date library (date-fns, dayjs).

---

### MIN-8: Missing PropTypes Documentation
**Location**: All components
**Severity**: MINOR - Documentation

**Issue**: Good TypeScript interfaces but missing JSDoc examples.

**Recommendation**:
```typescript
/**
 * Task item component
 * @example
 * <TaskItem
 *   task={task}
 *   onToggleComplete={(id) => console.log(id)}
 *   onClick={(id) => console.log(id)}
 * />
 */
export function TaskItem({ ... }) { ... }
```

---

## Security Assessment

### Strengths
- Strong TypeScript typing reduces runtime errors
- Comprehensive input validation with `validation.ts`
- Type guards for runtime type checking
- No use of `eval()`, `innerHTML`, or `dangerouslySetInnerHTML`
- No use of `localStorage` or `sessionStorage` (avoiding XSS vector)
- Proper use of environment variables for configuration

### Weaknesses
- Missing input sanitization (CRIT-1)
- Missing rate limiting (CRIT-2)
- Client-accessible mock mode toggle (CRIT-3)
- Error details leakage (CRIT-4)
- Missing CSRF protection (MAJ-1)
- Missing CSP headers (MAJ-4)

**Overall Security Score**: 6/10 (Requires Improvements)

---

## Code Quality Assessment

### Strengths
- Clean, readable code with consistent naming conventions
- Excellent TypeScript usage with strict mode enabled
- Proper separation of concerns (types, utils, components, hooks)
- Good use of React hooks and modern patterns
- Zustand state management is clean and well-structured
- SWR for data fetching with proper cache configuration
- Error boundaries implemented
- Comprehensive validation utilities with tests

### Weaknesses
- Manual validation instead of schema-based (MAJ-2)
- Generic error messages in SWR fetcher (MAJ-5)
- Hard-coded magic numbers (MIN-3)
- Console logs in production code (MIN-5)

**Overall Code Quality Score**: 8/10 (Good)

---

## Accessibility Assessment (WCAG 2.1 Level AA)

### Strengths
- Semantic HTML elements used consistently
- ARIA labels on interactive elements (`aria-label`, `aria-describedby`)
- Proper `role` attributes (e.g., `role="dialog"`, `role="alert"`)
- Focus management in Modal component
- Keyboard navigation support (Escape key, Tab focus trap)
- `aria-invalid` for form validation errors
- Required field indicators with `required` attribute
- Focus ring styles with `focus:ring-2`

### Issues
- Missing focus restoration on modal close (MAJ-6)
- Missing `aria-live` regions for toast notifications (MIN-6)
- Missing skip navigation link
- No landmark roles (`<nav>`, `<main>`, `<aside>` are used but could be enhanced)

**Recommendations**:
1. Add skip navigation link in header
2. Add `aria-live` to toast notifications
3. Test with screen readers (NVDA, JAWS, VoiceOver)
4. Add `aria-expanded` to collapsible sidebar sections

**Overall Accessibility Score**: 7.5/10 (Good, needs minor fixes)

---

## Performance Assessment

### Strengths
- SWR cache deduplication (`dedupingInterval: 2000`)
- Proper memoization with Zustand selectors
- Next.js 15 automatic code splitting
- Optimistic UI updates for task completion
- Debounce hook for search input
- React.forwardRef for component refs (avoiding re-renders)

### Issues
- No `React.memo` on list items (TaskItem component)
- Missing virtualization for large lists (100+ tasks)
- No image optimization (not applicable, no images yet)
- Missing bundle analysis setup

**Recommendations**:
1. Add `React.memo` to `TaskItem`:
```typescript
export const TaskItem = React.memo(function TaskItem({ ... }) {
  ...
})
```

2. Add virtual scrolling for lists >50 items:
```typescript
import { FixedSizeList } from 'react-window'
```

3. Add bundle analyzer:
```bash
npm install @next/bundle-analyzer
```

**Overall Performance Score**: 8/10 (Good, room for optimization)

---

## Testing Assessment

### Current Coverage
- Unit tests: 4 test files found
  - `cn.test.ts` - Utility function
  - `date.test.ts` - Date utilities
  - `validation.test.ts` - Comprehensive validation tests (excellent)
  - `Button.test.tsx` - UI component tests

### Coverage Gaps
- Missing tests for:
  - API routes (0% coverage)
  - Custom hooks (useTasks, useAreas, useHealth, useDebounce)
  - State management (uiStore)
  - Complex components (Modal, TaskCreateForm, Sidebar)
  - Error boundary
  - Integration tests

### Recommendations
1. Add API route tests using `@testing-library/react` + MSW
2. Add custom hook tests with `@testing-library/react-hooks`
3. Add integration tests for critical user flows
4. Increase coverage to meet thresholds:
   - Lines: 80% (current: unknown, likely ~20-30%)
   - Branches: 70%
   - Functions: 70%

**Jest Config**: Good coverage thresholds defined but likely not met.

**Overall Testing Score**: 4/10 (Insufficient coverage)

---

## Best Practices Adherence

### Next.js 15 Best Practices
- ✅ App Router used correctly
- ✅ Server/Client components separated (`'use client'` directive)
- ✅ Metadata API for SEO
- ✅ Route Handlers for API routes
- ✅ Dynamic imports ready (not used yet)
- ✅ Font optimization ready (not configured yet)
- ❌ Missing Image optimization (no images yet)
- ❌ Missing middleware for auth/rate limiting

### React 18 Best Practices
- ✅ Strict mode enabled
- ✅ Hooks used correctly (no violations of Rules of Hooks)
- ✅ Error boundaries implemented
- ✅ forwardRef for component library
- ❌ Missing `React.memo` for performance
- ❌ Missing `useCallback` in some event handlers

### TypeScript Best Practices
- ✅ Strict mode enabled (`strict: true`)
- ✅ No `any` types found (excellent)
- ✅ Proper type guards (`isTask`, `isTaskStatus`)
- ✅ Interface documentation with JSDoc
- ✅ Generic types used correctly (`fetchJSON<T>`)
- ✅ Discriminated unions for error types

**Overall Best Practices Score**: 8.5/10 (Very Good)

---

## File-by-File Critical Findings

### src/lib/config.ts
- CRIT-3: `NEXT_PUBLIC_MOCK_MODE` exposed to client
- MIN-5: Console logs in production

### src/lib/api/client.ts
- Good: Comprehensive retry logic with exponential backoff
- Good: Timeout handling with AbortController
- MIN-3: Hard-coded retry delay

### src/lib/types/api.ts
- CRIT-4: Error details leakage
- Good: Custom error classes with proper inheritance

### src/lib/utils/validation.ts
- Excellent: Comprehensive validation functions
- MIN-7: Date validation timezone issues
- Missing: HTML sanitization function

### src/app/api/tasks/route.ts
- CRIT-1: Missing input sanitization
- CRIT-2: Missing rate limiting
- MAJ-2: No schema validation
- Good: Proper error responses

### src/hooks/useTasks.ts
- MAJ-5: Generic error in fetcher
- Good: Optimistic updates implemented correctly
- Missing: Type validation of API responses

### src/components/ui/Modal.tsx
- MAJ-6: Missing focus restoration
- Good: Focus trap implementation
- Good: Escape key handling
- Good: Body scroll prevention

### src/components/tasks/TaskCreateForm.tsx
- MAJ-3: Missing maxLength on inputs
- Good: Client-side validation
- Good: Form state management
- Missing: Debounce on validation (minor)

### src/stores/uiStore.ts
- MAJ-8: No persistence
- Good: Clean Zustand implementation
- Good: Selector hooks for performance

---

## Recommendations Summary

### Immediate Actions (P0 - Blocker)
1. Implement input sanitization (CRIT-1)
2. Add rate limiting to all API routes (CRIT-2)
3. Remove `NEXT_PUBLIC_MOCK_MODE` from client config (CRIT-3)
4. Sanitize error details in production (CRIT-4)

### High Priority (P1 - Before Production)
1. Implement CSRF protection (MAJ-1)
2. Adopt Zod/Yup for schema validation (MAJ-2)
3. Add maxLength to all input fields (MAJ-3)
4. Configure Content Security Policy (MAJ-4)
5. Improve SWR error handling (MAJ-5)
6. Fix modal focus restoration (MAJ-6)
7. Add route-level error boundaries (MAJ-7)

### Medium Priority (P2 - Post-Launch)
1. Persist UI store (MAJ-8)
2. Add comprehensive testing (4 → 80% coverage)
3. Add React.memo to list items
4. Standardize error handling
5. Add skip navigation link
6. Remove console logs in production

### Nice to Have (P3)
1. Add loading states to modals
2. Improve JSDoc documentation
3. Add bundle analyzer
4. Consider virtual scrolling for large lists

---

## Conclusion

The Windows Things3 Dashboard codebase demonstrates **good engineering practices** with strong TypeScript typing, clean architecture, and modern React patterns. However, **4 Critical security issues** must be addressed before production deployment.

**Final Verdict**: 差し戻し (Send Back to Senior-Coder)

### Action Items for Senior-Coder
1. Fix CRIT-1 through CRIT-4 (Priority: P0)
2. Address MAJ-1 through MAJ-7 (Priority: P1)
3. Add tests for critical paths (API routes, hooks)
4. Re-submit for review after fixes

### Estimated Remediation Time
- Critical fixes: 4-6 hours
- Major fixes: 8-12 hours
- Testing: 6-8 hours
- **Total**: 18-26 hours

---

**Report Generated By**: Review-Guardian Agent
**Next Steps**: Forward to Senior-Coder for remediation
**Re-review Required**: Yes, after all Critical and Major issues are resolved
