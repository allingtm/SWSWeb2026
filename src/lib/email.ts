// Outbound email, sent through SendGrid's v3 API.
//
// Called directly over fetch rather than through @sendgrid/mail: the payload is
// small enough that the SDK earns nothing, and this keeps the dependency count
// where it is.
//
// Every caller treats email as a secondary notification channel - the record is
// already in the database by the time we get here - so failures are reported by
// return value rather than thrown. They are always logged, though: the previous
// provider went unconfigured for months precisely because a missing key skipped
// the send without saying anything.

const SENDGRID_ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

// Must be a verified sender (or on an authenticated domain) in SendGrid, or
// every send returns 403.
const FROM_ADDRESS = "website@solvewithsoftware.com";
const FROM_NAME = "Solve With Software";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  /** Set so a reply reaches the person who submitted the form, not the site. */
  replyTo?: string;
}

/** Returns true if SendGrid accepted the message. Never throws. */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.error(
      `Email not sent ("${subject}"): SENDGRID_API_KEY is not set in this environment.`
    );
    return false;
  }

  try {
    const response = await fetch(SENDGRID_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_ADDRESS, name: FROM_NAME },
        ...(replyTo ? { reply_to: { email: replyTo } } : {}),
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!response.ok) {
      // The body names the actual cause - usually an unverified sender or a key
      // without Mail Send permission. Worth logging in full; it is the
      // difference between a five-minute fix and a guess.
      const detail = await response.text();
      console.error(
        `SendGrid rejected "${subject}" (${response.status}): ${detail}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`SendGrid request failed for "${subject}":`, error);
    return false;
  }
}
