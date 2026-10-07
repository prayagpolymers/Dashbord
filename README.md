# Prayag CEO Dashboard V10

## What's new
- Opening Balance as on **01-04-2026**
- Opening Balance + FY 2026-27 Sales + DN - Payment - CN - Sales Return = Outstanding
- Party-wise opening balance and outstanding
- API health check before loading
- Better JSON/error handling so the dashboard does not remain stuck on Loading
- Summary response includes filter lists, so an extra `lists` API call is avoided
- Short server-side cache for repeated dashboard requests
- Apps Script Web App URL is already configured in `dashboard.js`

## One-time Google Sheet setup
In accounting workbook:
`1oHFpXqVDPRF3Vi3WV9MdNcxkHNjgytLPxXUQgM6o1ok`

Create a tab named:
**OPENING BALANCE**

Paste the opening-balance data with columns like:
- G/L Acct/BP Code
- Name
- Local Currency - Balance

The screenshot data supplied by the user is treated as the **Opening Balance as on 01-04-2026**.

## Apps Script
Replace `Code.gs` with the V10 Code.gs in this ZIP and create a new Web App deployment:
- Execute as: Me
- Who has access: Anyone

Then GitHub:
- replace `index.html`
- replace `style.css`
- replace `dashboard.js`

No login is required.
