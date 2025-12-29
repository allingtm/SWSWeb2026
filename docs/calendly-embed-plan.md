# Calendly Inline Embed Integration Plan

## Goal
Replace the current hybrid approach (custom calendar UI → redirect to Calendly) with Calendly's inline embed widget so the entire booking flow happens within our modal, providing a seamless user experience.

## Current State
- Custom calendar UI for selecting dates
- Custom time slot selection
- Custom booking form (name, email, company, phone, message)
- Redirect to Calendly to complete booking
- User has to re-enter info on Calendly's page

## Target State
- Calendly's inline embed widget renders inside our modal
- User completes entire booking without leaving the site
- Prefill user data (name, email) if available
- Capture booking confirmation via Calendly's JavaScript events
- Store booking record in our database when confirmed

---

## Implementation Steps

### Step 1: Install Calendly Embed Package
```bash
npm install react-calendly
```

The `react-calendly` package provides React components for embedding Calendly widgets.

### Step 2: Update CalendlyBookingModal Component

**File:** `src/components/blog/calendly-booking-modal.tsx`

Replace the multi-step custom UI with:
1. A simpler modal structure
2. Calendly's `InlineWidget` component
3. Event listeners for booking completion

```tsx
import { InlineWidget, useCalendlyEventListener } from "react-calendly";

// Inside component:
useCalendlyEventListener({
  onEventScheduled: (e) => {
    // e.data.payload contains booking details
    // - invitee.uri
    // - event.uri
    // - invitee.name, email, etc.
    saveBookingToDatabase(e.data.payload);
  },
});

<InlineWidget
  url={`https://calendly.com/${username}/${eventSlug}`}
  prefill={{
    name: prefillName,
    email: prefillEmail,
    customAnswers: {
      a1: companyName,
      a2: phoneNumber,
    },
  }}
  styles={{
    height: "600px",
    minWidth: "320px",
  }}
/>
```

### Step 3: Get Calendly Scheduling URL

Currently we store `calendly_event_type_uri` (API URI like `https://api.calendly.com/event_types/xxx`).

We need to also store or derive the **scheduling URL** (like `https://calendly.com/username/meeting`).

**Options:**
1. Store scheduling URL directly in database (add new column)
2. Fetch it from the API when needed (event type has `scheduling_url` field)

**Recommendation:** Fetch from API and cache, since the event type API response includes `scheduling_url`.

### Step 4: Update Database Schema (Optional)

If we want to cache the scheduling URL:

```sql
ALTER TABLE sws2026_blog_posts
ADD COLUMN calendly_scheduling_url text NULL;
```

Or update the admin form to show/require the scheduling URL instead of the API URI.

### Step 5: Update Admin CalendlySettings Component

**File:** `src/components/admin/calendly-settings.tsx`

When an event type is selected from the dropdown:
- Store both the `event_type_uri` (for API calls)
- Store the `scheduling_url` (for embedding)

The event types API returns both values.

### Step 6: Handle Prefill Data

Calendly's embed supports prefilling:
- `name` - Invitee name
- `email` - Invitee email
- `customAnswers` - Answers to custom questions (a1, a2, etc.)

We can optionally collect name/email before showing the embed, or let users enter it directly in Calendly.

### Step 7: Capture Booking Events

Use `useCalendlyEventListener` to capture:
- `onEventScheduled` - Booking completed
- `onProfilePageViewed` - Widget loaded
- `onDateAndTimeSelected` - User picked a slot

On `onEventScheduled`:
1. Extract booking details from payload
2. Save to `sws2026_calendly_bookings` table
3. Optionally send confirmation email
4. Show success message / close modal

### Step 8: Remove Unused Code

After migration, remove:
- Custom calendar grid code
- Custom time slot fetching
- Custom booking form
- `/api/calendly/available-times` endpoint (no longer needed for calendar display)
- Keep `/api/calendly/book` but repurpose for saving confirmed bookings

### Step 9: Styling the Embed

Calendly's embed can be styled with:
- `styles` prop for container dimensions
- CSS targeting `.calendly-inline-widget` class
- `pageSettings` prop for Calendly's internal styling:
  ```tsx
  pageSettings={{
    backgroundColor: 'ffffff',
    hideEventTypeDetails: false,
    hideLandingPageDetails: false,
    primaryColor: '00a2ff',
    textColor: '4d5055',
    hideGdprBanner: true,
  }}
  ```

### Step 10: Mobile Responsiveness

Ensure the modal and embed work well on mobile:
- Modal should be full-screen on mobile
- Calendly widget is responsive by default
- Test on various screen sizes

---

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `react-calendly` dependency |
| `src/components/blog/calendly-booking-modal.tsx` | Replace custom UI with InlineWidget |
| `src/components/admin/calendly-settings.tsx` | Store scheduling_url |
| `src/lib/calendly/client.ts` | Ensure we fetch/return scheduling_url |
| `src/types/calendly.ts` | Add scheduling_url to types |

## Files to Delete (Optional)
- Can remove custom availability-fetching code
- Keep API routes if needed for other purposes

---

## Testing Checklist

- [ ] Modal opens with Calendly widget embedded
- [ ] Widget loads correct event type
- [ ] Prefill data works (name, email)
- [ ] Booking completes without leaving modal
- [ ] Booking is saved to database
- [ ] Modal closes after successful booking
- [ ] Works on mobile devices
- [ ] Works in dark mode
- [ ] Error handling for failed loads

---

## Considerations

### Pros of Embed Approach
- No redirect - seamless UX
- User stays on your site
- Less custom code to maintain
- Calendly handles all edge cases

### Cons of Embed Approach
- Less control over UI/styling
- Depends on Calendly's JavaScript loading
- Slightly slower initial load (external script)
- Limited customization of form fields

### Alternative: PopupWidget
Instead of inline embed, could use popup:
```tsx
import { PopupWidget } from "react-calendly";

<PopupWidget
  url="https://calendly.com/username/meeting"
  rootElement={document.getElementById("root")}
  text="Schedule a Meeting"
/>
```

This opens Calendly in a popup overlay instead of inline.

---

## Timeline Estimate

1. Install package & basic embed: 1 hour
2. Update admin to store scheduling URL: 1 hour
3. Handle booking events & database: 2 hours
4. Styling & responsive testing: 1 hour
5. Cleanup old code: 30 minutes

**Total: ~5-6 hours**
