# Prayag Sales & Accounting Portal V5 — Fast Query Mode

V5 is designed specifically to solve the slow loading problem.

It DOES NOT download the full 215k-row Sales sheet at startup.
- Login: only small lookup queries (State Head, Party, State, Group, FY, Month).
- Dashboard: server-side aggregated queries.
- Party details: loaded only when a Party is clicked.
- Invoice/item details: loaded only when an Invoice is clicked.

Sources:
Sales workbook: 1QIpcfgOVCFjcCmgU_DXKn8h7Bfa8rm2q2wB2HneTvKs / Sheet1
Accounting workbook: 1oHFpXqVDPRF3Vi3WV9MdNcxkHNjgytLPxXUQgM6o1ok
Tabs: SALE RETURN, CN SAP, DN SAP, DEBTOR

Important:
Both Google workbooks must be shared as Anyone with the link → Viewer.

Sales amount is treated as taxable and dashboard totals add 18% GST.
CN, DN and Sales Return are treated as GST-inclusive.
