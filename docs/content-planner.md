# Content Planner Feature

## Overview
The Content Planner replaces the previous blog-writer feature. Instead of generating full article text, it produces a comprehensive **research help sheet** to assist a human author in writing their own content.

## Key Decisions
- Feature renamed from "blog-writer" to "content-planner"
- Web search integration for competitive analysis
- One-time generation workflow (no database storage)

## Output: The Help Sheet
A structured document containing:
1. **Brief Analysis & Topic Scope** - Core message, audience, boundaries
2. **Keyword & Intent Research** - Primary/secondary keywords, search intent
3. **Audience Analysis** - Reader persona, knowledge level, problems to solve
4. **Competitive Content Analysis** - Content gaps via web search, what's working elsewhere
5. **Research & Sources** - Stats, quotes, expert sources, credibility boosters
6. **Outline Development** - Section skeleton with key points per section

---

## Wizard Flow (6 Steps)

### Step 1: Input
**User provides:**
- Working title / topic
- Source transcript OR written brief
- Target audience description (optional)
- SEO importance toggle (yes/no)

### Step 2: Brief Analysis
**AI produces:**
- Core message summary (1-2 sentences)
- Content boundaries (in-scope / out-of-scope)
- Desired outcome for reader
- Content format recommendation

**User can:** Edit/refine any field

### Step 3: Keyword & Audience
**AI produces:**
- Primary keyword + 3-5 secondary keywords
- Search intent classification
- Reader persona (who, what they know, problems)
- Knowledge level assumption

**User can:** Adjust keywords, refine persona

### Step 4: Competitive Analysis (Web Search)
**AI performs web search** for the topic/keywords, then produces:
- Top-ranking content summary
- Common angles already covered
- Content gaps (opportunities)
- Structural patterns that work
- Unique angle recommendation

**User can:** Add notes, mark priorities, request additional searches

### Step 5: Sources & Research
**AI produces:**
- Key statistics to find/cite
- Types of expert sources needed
- Suggested credibility boosters
- Research questions to answer

**User can:** Add their own sources, mark items as "found"

### Step 6: Outline & Export
**AI produces:**
- Section headings with purposes
- Key points per section
- Where evidence should sit
- Suggested word count per section

**Export options:**
- Copy as markdown
- Download as .md file

---

## File Structure

### Types
`webapp/src/types/content-planner.ts`

### Prompts
`webapp/src/lib/ai/content-planner-prompts.ts`

### API Routes
```
webapp/src/app/api/admin/content-planner/
  - analyze-brief/route.ts
  - research-keywords/route.ts
  - analyze-audience/route.ts
  - analyze-competitors/route.ts (uses web search)
  - gather-sources/route.ts
  - generate-outline/route.ts
```

### Components
```
webapp/src/components/admin/content-planner/
  - content-planner-wizard.tsx (main orchestration)
  - progress-indicator.tsx
  - wizard-steps/
    - step-input.tsx
    - step-brief.tsx
    - step-keywords-audience.tsx
    - step-competitors.tsx
    - step-sources.tsx
    - step-outline-export.tsx
```

### Page
`webapp/src/app/admin/content-planner/page.tsx`

---

## API Endpoints

| Endpoint | Input | Output |
|----------|-------|--------|
| `/api/admin/content-planner/analyze-brief` | sourceContent, title | BriefAnalysis |
| `/api/admin/content-planner/research-keywords` | brief, seoImportant | KeywordResearch |
| `/api/admin/content-planner/analyze-audience` | brief, targetAudience? | AudienceAnalysis |
| `/api/admin/content-planner/analyze-competitors` | brief, keywords | CompetitiveAnalysis |
| `/api/admin/content-planner/gather-sources` | brief, audience, competitors | SourcesResearch |
| `/api/admin/content-planner/generate-outline` | all above | HelpSheetOutline |

---

## Export Format (Markdown)

```markdown
# Author Help Sheet: [Working Title]

## Brief Analysis
**Core Message:** [...]
**In Scope:** [bullet list]
**Out of Scope:** [bullet list]
**Desired Outcome:** [...]

## Keywords & Search Intent
**Primary:** [keyword]
**Secondary:** [list]
**Search Intent:** [type] - [explanation]

## Target Audience
**Persona:** [description]
**Knowledge Level:** [level]
**Problems to Solve:**
- [...]

## Content Gaps & Opportunities
**Common Angles (avoid rehashing):**
- [...]
**Gaps to Fill:**
- [...]
**Recommended Unique Angle:** [...]

## Research Needed
**Statistics to Find:**
- [ ] [stat description]
**Expert Sources:**
- [ ] [source type]
**Credibility Boosters:**
- [ ] [item]

## Article Outline
### [Section 1 Heading] (~X words)
**Purpose:** [...]
**Key Points:**
- [...]
**Evidence:** [...]

### [Section 2 Heading] (~X words)
...
```

---

## Key Differences from Previous Blog-Writer

| Blog-Writer | Content Planner |
|-------------|-----------------|
| Generates full article text | Generates research document |
| AI writes the content | Human writes using AI research |
| Multiple AI calls per section | One AI call per research step |
| Quality scoring of output | No scoring (human judges quality) |
| Content assignment system | Simple section recommendations |
| Tone preservation from transcript | Tone guidance for author |
