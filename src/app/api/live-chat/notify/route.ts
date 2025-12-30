import { NextResponse } from "next/server";

interface NotifyRequestBody {
  conversationId: string;
  visitorId: string;
  postTitle?: string;
  sourceUrl?: string;
  isReopen?: boolean;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmailViaSendGrid(
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY not configured");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "marc@solvewithsoftware.com", name: "Solve with Software" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
  }
}

export async function POST(request: Request) {
  try {
    const body: NotifyRequestBody = await request.json();
    const { conversationId, visitorId, postTitle, sourceUrl, isReopen } = body;

    console.log("Live chat notify called:", { conversationId, visitorId, postTitle, sourceUrl, isReopen });

    if (!conversationId || !visitorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email notification via SendGrid
    if (process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key found, attempting to send email...");
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solvewithsoftware.com";
        const adminUrl = `${siteUrl}/admin/live-chat?conversation=${conversationId}`;

        const safeVisitorId = escapeHtml(visitorId.substring(0, 8));
        const safePostTitle = postTitle ? escapeHtml(postTitle) : null;
        const safeSourceUrl = sourceUrl ? escapeHtml(sourceUrl) : null;

        const subjectPrefix = isReopen ? "Chat Reopened" : "New Live Chat";
        const headingText = isReopen ? "Live Chat Reopened" : "New Live Chat Started";
        const bodyText = isReopen
          ? "A visitor has reopened a previously closed chat conversation."
          : "A visitor has started a new chat conversation.";

        const subject = `${subjectPrefix}: ${safePostTitle || "Direct conversation"}`;
        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px;">${headingText}</h2>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">${bodyText}</p>

            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #4a4a4a;">
                <strong>Visitor ID:</strong> ${safeVisitorId}...
              </p>
              ${safePostTitle ? `
              <p style="margin: 0 0 8px 0; color: #4a4a4a;">
                <strong>From article:</strong> ${safePostTitle}
              </p>
              ` : ""}
              ${safeSourceUrl ? `
              <p style="margin: 0; color: #4a4a4a;">
                <strong>Source URL:</strong> <a href="${safeSourceUrl}" style="color: #0070f3;">${safeSourceUrl}</a>
              </p>
              ` : ""}
            </div>

            <p style="margin-top: 24px;">
              <a href="${adminUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                Open Conversation
              </a>
            </p>

            <p style="color: #888; font-size: 12px; margin-top: 32px;">
              This notification was sent from your website's live chat system.
            </p>
          </div>
        `;

        const toEmail = process.env.LIVECHAT_NOTIFICATION_EMAIL;
        if (!toEmail) {
          console.warn("LIVECHAT_NOTIFICATION_EMAIL not configured, skipping email notification");
        } else {
          console.log("Sending email to:", toEmail);
          await sendEmailViaSendGrid(toEmail, subject, htmlContent);
          console.log("Email sent successfully!");
        }
      } catch (emailError) {
        console.error("Live chat email notification error:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log("No SENDGRID_API_KEY found, skipping email notification");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Live chat notify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
