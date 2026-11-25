// Netlify Forms only stores fields it detected at deploy time, so every form and
// every field it can send is declared here AND in public/__forms.html (which is
// what Netlify parses). Keep the two in sync when adding fields.
export const FORMS = {
  contact: ["name", "email", "subject", "message", "page"],
  lead: ["name", "email", "company", "phone", "message", "offer", "page"],
  "career-application": ["name", "email", "position", "resume", "page"],
} as const;

export type FormName = keyof typeof FORMS;
