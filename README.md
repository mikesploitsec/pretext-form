# pretext-form

A configurable, offline, banking-style transfer form for **screenshot pretexts** in authorized social engineering and counter-fraud research.

**Live:** https://mikesploitsec.github.io/pretext-form/

**Case study:** [Honeypot Buyer: an inside look at the coordinated inauthentic behaviour economy](https://mikesploit.com/papers/honeypot-buyer), DOI [10.5281/zenodo.24120753](https://doi.org/10.5281/zenodo.24120753). The section on the elicitation artifact explains why this exists.

**Cite this tool:** DOI [10.5281/zenodo.24121085](https://doi.org/10.5281/zenodo.24121085) (all versions). See `CITATION.cff`.

## What it does

When a subject has already given you payment details, the one detail a payer can't see is usually the one that matters: the name the account is registered to. Real payment flows ask for it. This page reproduces that moment. It shows a generic transfer form prefilled with what you already hold, and one or more fields **flagged** red as required and blank. You take a screenshot and send it. Whether to fill the blank is the subject's choice.

- **Presets:** UK (sort code), EU (IBAN), US (ABA routing), Canada (transit and institution), Blank.
- **Per field:** Show, Flag (required, blank, red, with an error line), Lock (greyed out as verified), rename, reorder, remove, add.
- **Page text:** masthead, timer, breadcrumb, step line, error headline, footer and masthead colour are all editable.
- **Capture mode** hides the panel and the notice for a clean screenshot. Press **P** to bring them back.
- **Export / import JSON** to keep a configuration with your case file.

## What it does not do

- No back end, no network requests, no cookies or storage. The page's Content Security Policy blocks connections and form submission.
- No real institution's name, logo, colours or domain. Don't add them. Imitating a real bank turns a research prop into impersonation.
- It doesn't collect anything. The subject never visits it; they see a screenshot.

## Rules of use

1. **Authorized work only:** your own investigation under written rules of engagement, or a sanctioned engagement.
2. **Send a screenshot, never a link.** The subject should never be able to interact with or enter data into anything you host.
3. **Ask only for what a real transaction would ask for.** The flag shows a gap the subject already expects to fill; it is not a trick to collect unrelated data.
4. **Log it:** file the configuration export and the screenshot you sent as case artifacts, hashed, before you send.
5. **Never use it on a victim,** or on anyone who hasn't first offered you a paid service and a payment route.

## Run it locally

Open `index.html` in a browser. There is no build step and nothing to install.

## Licence

MIT. See `LICENSE`.
