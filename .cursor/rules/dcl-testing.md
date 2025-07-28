---
description: "Comprehensive testing standards for all Decentraland projects: React, Redux, Node, E2E, and more."
globs: **/*.spec.ts,**/*.test.ts,**/*.spec.tsx,**/*.test.tsx
alwaysApply: true
---

# Testing

## Scope

These standards MUST be applied to all files that match the following patterns, always:

- `src/**/*.test.ts`
- `src/**/*.spec.ts`
- `src/**/*.test.tsx`
- `src/**/*.spec.tsx`

> **Note:** The globs should be as specific as possible to avoid false positives. Adjust them if your project structure is different.

## Rules

1. **MUST** (required)

   - Use Jest and TypeScript for all tests.
   - Organize tests with `describe` (context: "when", "and") and `it` (behavior: "should ...").
   - Each context variant must have its own describe block with "when" or "and"
   - Use "when" for main contexts and "and" for nested contexts
   - Do NOT use "when" in it() descriptions - the context is already defined in the describe
   - **it() descriptions must be specific and descriptive about the expected behavior**
   - **Prefer specific outcomes over generic ones (e.g., "should respond with a 500 and the error" vs "should return 500 status")**
   - Use `beforeEach` for setup, never mix with `beforeAll`.
   - All test variables, input data, and mocks must be declared and assigned in beforeEach
   - Do NOT define input variables inside it() blocks
   - Each describe context should have its own beforeEach for its specific setup
   - Use `afterEach` to clean up mocks, test data, and side effects to ensure test isolation.
   - Use `let` for mutable, `const` for immutable variables. Type variables explicitly.
   - Have one assertion per `it` unless justified for performance or testing multiple aspects of the same behavior.
   - Test behavior, not implementation. Focus on what the code does, not how.
   - Use `jest.fn()` for mocks, prefer `mockReturnValueOnce`/`mockResolvedValueOnce`, and reset mocks in `afterEach`.
   - Keep tests independent and use clear, explicit descriptions.
   - Use semantic naming: `describe` with "when", "and"; `it` with "should"; write full, meaningful sentences.

   **Example:**

   ```typescript
   describe("when the user clicks the button", () => {
     let onClick: jest.Mock;

     beforeEach(() => {
       onClick = jest.fn();
       render(<MyButton onClick={onClick} />);
     });

     afterEach(() => {
       jest.resetAllMocks();
       // Clean up any other state or data here
     });

     it("should call onClick", async () => {
       await userEvent.click(screen.getByRole("button"));
       expect(onClick).toHaveBeenCalled();
     });
   });
   ```

2. **SHOULD** (recommended)

   - Use React Testing Library and accessible queries (`getByRole`, `getByLabelText`, etc.) for React components.
   - Test reducers with action creators, selectors as functions, sagas with `redux-saga-test-plan`.
   - Use `supertest` for API tests and Cypress for E2E.
   - Place test files next to the code they test, named `*.spec.ts(x)` or `*.test.ts(x)`.
   - Test accessibility and keyboard navigation.
   - Use meaningful test descriptions and keep tests independent.
   - Place test utilities in a `__tests__/` directory when needed.

   **Example:**

   ```typescript
   // Good
   it("should disable submit button when form is invalid", () => {
     // test
   });
   // Bad
   it("should work as expected", () => {
     // test
   });
   ```

## Examples

```typescript
// ❌ Incorrect

describe("form", () => {
  it("should work", () => {
    // ...
  });
});

// ✅ Correct

describe("when the form is submitted", () => {
  let mockSubmit: jest.Mock;

  beforeEach(() => {
    mockSubmit = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    // Clean up any other state or data here
  });

  describe("and the input is valid", () => {
    let validInput: any;

    beforeEach(() => {
      validInput = { name: "test", email: "test@test.com" };
    });

    it("should call the onSubmit callback", () => {
      mockSubmit();
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe("and the input is invalid", () => {
    let invalidInput: any;

    beforeEach(() => {
      invalidInput = { name: "", email: "invalid" };
    });

    it("should display a validation error", () => {
      /* ... */
    });
  });
});
```

## Common Mistakes to Avoid

❌ **Wrong: Using "when" in it() descriptions**

```typescript
it('should fail when email is missing', () => { // WRONG
```

✅ **Correct: Context in describe, behavior in it()**

```typescript
describe('when email is missing', () => {
  it('should return 400 status', () => { // CORRECT
```

❌ **Wrong: Defining variables inside it()**

```typescript
it('should work', () => {
  const testData = { email: 'test' }; // WRONG
```

✅ **Correct: Variables in beforeEach**

```typescript
describe('when testing email', () => {
  let testData: any;

  beforeEach(() => {
    testData = { email: 'test' }; // CORRECT
  });
```

❌ **Wrong: Flat structure without context separation**

```typescript
describe('form', () => {
  it('should work with valid input', () => { // WRONG
  it('should fail with invalid input', () => { // WRONG
```

✅ **Correct: Nested describes for different contexts**

```typescript
describe('when the form is submitted', () => {
  describe('and the input is valid', () => {
    it('should call onSubmit', () => { // CORRECT
  });
  describe('and the input is invalid', () => {
    it('should show error', () => { // CORRECT
  });
});
```

❌ **Wrong: Generic it() descriptions**

```typescript
it('should return 500 status', () => { // TOO GENERIC
it('should work', () => { // TOO GENERIC
```

✅ **Correct: Specific and descriptive it() descriptions**

```typescript
it('should respond with a 500 and the error', () => { // SPECIFIC
it('should propagate the error to the client', () => { // DESCRIPTIVE
it('should return 400 status when email is missing', () => { // SPECIFIC
it('should display validation error message', () => { // DESCRIPTIVE
```

## Validation Checklist

Before writing tests, ensure:

- [ ] MUST and SHOULD sections are clearly defined
- [ ] Each "when" and "and" context has its own describe block
- [ ] All variables are declared and assigned in beforeEach
- [ ] it() descriptions use "should" without "when"
- [ ] it() descriptions are specific and descriptive about expected behavior
- [ ] Context is defined in describe, not repeated in it()
- [ ] Each describe has appropriate beforeEach/afterEach
- [ ] Tests are independent and don't share state
- [ ] Prefer specific outcomes over generic ones
- [ ] Specific code examples are included
- [ ] Incorrect (❌) and correct (✅) patterns are shown
- [ ] Rules are specific and actionable
- [ ] Scope clearly defines file patterns
- [ ] Description is concise and descriptive
- [ ] Glob patterns are appropriate for common
- [ ] Rules follow the established format and structure
- [ ] Content is comprehensive and well-organized
- [ ] Examples are relevant and demonstrate best practices
- [ ] Context is properly defined and not repeated
- [ ] Each section has appropriate setup and cleanup
