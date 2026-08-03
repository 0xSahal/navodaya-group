# Form submissions (Resend)

Two forms send email through Resend:

| Form | Route | Sends |
| --- | --- | --- |
| Contact / enquiry | `POST /api/contact` | Studio notification + acknowledgement to the enquirer |
| Vendor registration | `POST /api/vendor-register` | Studio notification + acknowledgement to the vendor |

Delivered submissions are also stored in MongoDB (`navodaya.leads`). Email remains
the primary notification; a DB write failure is logged and does not fail the request.

## The domain question

**Verifying a domain in Resend has nothing to do with where the site is hosted.**
It is purely DNS records on `navodayagroup.com`. You can do it today, while the
site still sits on a `vercel.app` URL, and it will keep working after the domain
is pointed at Vercel.

Until a domain is verified, Resend only lets you send from
`onboarding@resend.dev`, and **that sender can only deliver to the email address
that owns the Resend account.** So:

| | Studio notification | Acknowledgement to sender |
| --- | --- | --- |
| No verified domain | Works, but only if `CONTACT_EMAIL` is the Resend account owner's address | **Skipped** |
| Verified domain + `RESEND_FROM` | Works, to any address | Works |

The code checks for `RESEND_FROM` rather than attempting the acknowledgement and
letting it bounce. A skipped acknowledgement is logged as a warning, so it is
visible rather than silent.

## Environment variables

```bash
RESEND_API_KEY=re_...                                    # resend.com/api-keys
CONTACT_EMAIL=admin@navodayagroup.in                     # where enquiries land
RESEND_FROM=Navodaya <studio@navodayagroup.com>          # verified sender; blank until DNS is done
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ # Atlas; persists delivered leads
```

These go in `.env.local` locally and in **Vercel → Settings → Environment
Variables** for the deployment. `RESEND_FROM` can be added later without a code
change.

## Setting up the domain in Resend

1. Resend → **Domains** → Add domain → `navodayagroup.com`
2. Resend shows DKIM, SPF and (optionally) DMARC records
3. Add them at whoever hosts the DNS for the domain
4. Wait for Resend to show **Verified** (usually minutes, sometimes hours)
5. Set `RESEND_FROM` to an address on that domain and redeploy

## Behaviour

| Situation | Response | What the visitor sees |
| --- | --- | --- |
| Valid submission, email sent | `200` | Thank-you screen |
| Field fails validation | `422` with per-field errors | Errors inline, focus moves to the first one |
| Looks like a bot | `200`, no email | Thank-you screen |
| Too many submissions | `429` | Message with the phone number |
| Resend rejected the send | `502` | "We could not send your enquiry" plus the phone number |
| `RESEND_API_KEY` missing | `503` | Same failure message |

**Failures are never disguised as success.** If the studio notification does not
go out, the enquiry reached nobody, and showing a thank-you screen over that
would lose the lead silently. The visitor gets the phone number instead.

## Spam handling

Three checks, no third-party service and no CAPTCHA:

- **Honeypot** - an `nd_ref` field labelled "Reference", positioned off-screen
  with autofill opt-outs. Humans never fill it; bots fill everything. Never
  rename it to a website/company-style field (Chrome will autofill those).
- **Time to submit** - anything submitted under 3 seconds after the form mounted.
- **Link stuffing** - three or more URLs in the message body.

A submission that trips any of these gets a normal-looking `200` with no email
sent. Returning an error would tell the bot which check caught it.

## Rate limiting

Five *delivered* submissions per IP per 10 minutes.

Only successful sends count. An earlier version counted every request, which
meant someone making four validation mistakes got locked out - the opposite of
the intent. Rejected requests are cheap; the inbox is the thing worth
protecting.

This is per serverless instance, so it is a speed bump rather than a guarantee.
Phase 2 should move it to shared storage (Upstash or similar) alongside lead
persistence.

## Validation

`lib/lead-validation.ts` runs the **same validators** the browser uses
(`lib/form-validation.ts`), so the two cannot drift. Client-side checks are a
courtesy; the server ones are what actually protect the inbox, because anything
can POST to the route.

## Testing without sending real email

Set a dummy key to exercise validation, spam traps and the failure path:

```bash
RESEND_API_KEY=re_dummy npx next dev --port 3400
```

Valid submissions then reach the send and fail with `502`, which is the correct
visible behaviour for a broken key.

## Persistence (MongoDB)

After a successful Resend delivery, the validated payload is written to the
`leads` collection in the `navodaya` database:

| Field | Meaning |
| --- | --- |
| `form` | `"contact"` or `"vendor"` |
| `fields` | Validated form payload |
| `acknowledged` | Whether the sender acknowledgement email went out |
| `createdAt` | Server timestamp |

Spam discards and validation failures are not stored. If `MONGODB_URI` is
missing, the email still sends and the server logs a warning.

## Still open

- Shared rate limiting (still per serverless instance)
- Optional: forward enquiries to WhatsApp Business
