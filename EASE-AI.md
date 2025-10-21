# [Ease.io](http://ease.io/) AI Code Challenge: Process Monitor

## Objective

Build a light-weight Process Monitor that evaluates whether actions taken during a process comply with established guidelines using a simple AI model integration.

## Scenario

Organizations rely on repeatable processes — like processing support tickets, running IT checks, or completing safety steps. But sometimes actions don't follow guidelines, and processes are not carried out correctly.

Your task is to build a Process Monitor that:

- Accepts a reported action (what someone did)
- Decides whether the action complies with guidelines (COMPLIES) or deviates from them (DEVIATES)
- Stores the results and displays them in a simple UI

For example:
If the action is "Closed ticket #48219 and sent confirmation email" and the guideline is "All closed tickets must include a confirmation email", then the expected result should be COMPLIES.

## Requirements

### Backend API

Expose a POST `/analyze` endpoint that accepts:

```json
{
  "action": "Closed ticket #48219 and sent confirmation email",
  "guideline": "All closed tickets must include a confirmation email"
}
```

Use the Hugging Face model `facebook/bart-large-mnli` (Zero-Shot NLI) to classify the input and return:

```json
{
  "action": "Closed ticket #48219 and sent confirmation email",
  "guideline": "All closed tickets must include a confirmation email",
  "result": "COMPLIES",
  "confidence": 0.94,
  "timestamp": "2025-10-03T10:15:00Z"
}
```

Save results in a database (SQLite or Postgres).

### Calling the Inference API

1. Create a free Hugging Face account at [huggingface.co](http://huggingface.co/)
2. In Profile → Access Tokens, create a new Read token
3. Refer to the official Zero-Shot Classification API docs for details on the JSON payload structure and authentication

**Hint**: Use "complies", "deviates", and "unclear" as candidate labels.

### Frontend

A simple web app (React/Next.js preferred) with:

- A form to submit action and guideline
- A result view showing COMPLIES/DEVIATES/UNCLEAR
- A history table of past submissions

## Test Cases

Use the following cases to validate your system:

### Case 1

- **Action**: Closed ticket #48219 and sent confirmation email
- **Guideline**: All closed tickets must include a confirmation email
- **Should return**: COMPLIES

### Case 2

- **Action**: Closed ticket #48219 without sending confirmation email
- **Guideline**: All closed tickets must include a confirmation email
- **Should return**: DEVIATES

### Case 3

- **Action**: Rebooted the server and checked logs
- **Guideline**: Servers must be rebooted weekly and logs reviewed after restart
- **Should return**: DEVIATES

### Case 4

- **Action**: Skipped torque confirmation at Station 3
- **Guideline**: No guidelines exist for this case
- **Should return**: UNCLEAR

## Hints & Expectations

- TypeScript preferred
- Include a README with setup, run, and test instructions
- Include tests

## Bonus (Optional)

- Add a `/classify` endpoint (match an action against multiple guidelines, instead of just one)

## What to Submit

- GitHub repository link
- README with:
  - Setup instructions
  - How to run the project
  - How to run tests
