# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales\order-booking-add.noauth.spec.js >> Order Booking - add record >> TC-OB-001 add and submit a metal stock order
- Location: tests\sales\order-booking-add.noauth.spec.js:28:3

# Error details

```
Error: process date read from the header

expect(received).toMatch(expected)

Expected pattern: /^\d{2}\/\d{2}\/\d{4}$/
Received string:  ""
```

# Page snapshot

```yaml
- generic [ref=f1e5]:
  - generic [ref=f1e8]:
    - generic [ref=f1e9]:
      - button "󰍜" [ref=f1e10] [cursor=pointer]
      - generic [ref=f1e14]:
        - combobox "Search" [ref=f1e15]
        - generic [ref=f1e16]: 
        - button "Search" [ref=f1e17] [cursor=pointer]
    - list [ref=f1e18]:
      - listitem [ref=f1e19]:
        - link "" [ref=f1e20] [cursor=pointer]:
          - /url: /dsb/e-commerce
      - listitem [ref=f1e22]:
        - generic [ref=f1e23] [cursor=pointer]
      - listitem [ref=f1e25]:
        - link "" [ref=f1e26] [cursor=pointer]:
          - /url: /adm/app-approval
      - listitem [ref=f1e28]:
        - generic [ref=f1e29] [cursor=pointer]
      - listitem [ref=f1e31]:
        - button "" [ref=f1e32] [cursor=pointer]
      - listitem [ref=f1e34]:
        - button [ref=f1e35] [cursor=pointer]
      - listitem [ref=f1e37]:
        - generic [ref=f1e38] [cursor=pointer]: 
      - listitem [ref=f1e40]:
        - generic [ref=f1e41] [cursor=pointer]: 
      - listitem [ref=f1e43]:
        - button "user-image 01-06-2026 Kakkanad" [ref=f1e44] [cursor=pointer]:
          - img "user-image" [ref=f1e46]
          - generic [ref=f1e47]:
            - heading "01-06-2026" [level=6] [ref=f1e48]
            - generic [ref=f1e49]: Kakkanad
        - text:          
  - generic [ref=f1e50]:
    - link [ref=f1e51] [cursor=pointer]:
      - /url: "#"
      - img "dark logo" [ref=f1e53]
    - text:  
    - list [ref=f1e55]:
      - listitem [ref=f1e56]:
        - link "󰅂 Intellegence Insights" [ref=f1e57] [cursor=pointer]:
          - /url: /app-reports-home
          - generic [ref=f1e59]: 󰅂
          - generic [ref=f1e60]: Intellegence Insights
      - listitem [ref=f1e61]:
        - link " 󰅂 Admin" [ref=f1e62] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e63]: 
          - generic [ref=f1e64]: 󰅂
          - generic [ref=f1e65]: Admin
        - text: 󰅂 󰅂 󰅂 󰅂 󰅂
      - listitem [ref=f1e66]:
        - link "󰅂 Intelligence Engine" [ref=f1e67] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e69]: 󰅂
          - generic [ref=f1e70]: Intelligence Engine
        - text: 󰅂 󰅂 󰅂 󰅂
      - listitem [ref=f1e71]:
        - link "󰅂 Procurement" [ref=f1e72] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e74]: 󰅂
          - generic [ref=f1e75]: Procurement
        - text: 󰅂 󰅂
      - listitem [ref=f1e76]:
        - link "󰅂 Inventory" [ref=f1e77] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e79]: 󰅂
          - generic [ref=f1e80]: Inventory
        - text: 󰅂 󰅂 󰅂
      - listitem [ref=f1e81]:
        - link " 󰅂 Production" [ref=f1e82] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e83]: 
          - generic [ref=f1e84]: 󰅂
          - generic [ref=f1e85]: Production
        - text: 󰅂 󰅂 󰅂
      - listitem [ref=f1e86]:
        - link " 󰅂 Sales & Distribution" [expanded] [ref=f1e87] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e88]: 
          - generic [ref=f1e89]: 󰅂
          - generic [ref=f1e90]: Sales & Distribution
        - list [ref=f1e92]:
          - listitem [ref=f1e93]:
            - link "󰅂 Setup" [ref=f1e94] [cursor=pointer]:
              - /url: "javascript: void(0)"
              - generic [ref=f1e95]: 󰅂
              - generic [ref=f1e96]: Setup
          - listitem [ref=f1e97]:
            - link "󰅂 B2B" [expanded] [ref=f1e98] [cursor=pointer]:
              - /url: "javascript: void(0)"
              - generic [ref=f1e99]: 󰅂
              - generic [ref=f1e100]: B2B
            - list [ref=f1e102]:
              - listitem [ref=f1e103]:
                - link "Repair Registration" [ref=f1e104] [cursor=pointer]:
                  - /url: /sls/view-repair-registration
              - listitem [ref=f1e106]:
                - link "Approval Issue" [ref=f1e107] [cursor=pointer]:
                  - /url: /sls/view-b2b-approval-issue
              - listitem [ref=f1e109]:
                - link "Sample" [ref=f1e110] [cursor=pointer]:
                  - /url: /sls/app-sample-setup
              - listitem [ref=f1e112]:
                - link "Repair Delivery" [ref=f1e113] [cursor=pointer]:
                  - /url: /sls/view-repair-delivery
              - listitem [ref=f1e115]:
                - link "Sales Return" [ref=f1e116] [cursor=pointer]:
                  - /url: /sls/view-b2b-metal-sales-return
              - listitem [ref=f1e118]:
                - link "Approval Receipt" [ref=f1e119] [cursor=pointer]:
                  - /url: /sls/view-approval-receipt
              - listitem [ref=f1e121]:
                - link "Order" [ref=f1e122] [cursor=pointer]:
                  - /url: /sls/order-booking
              - listitem [ref=f1e124]:
                - link "Invoice" [ref=f1e125] [cursor=pointer]:
                  - /url: /sls/app-invoice-setup
          - listitem [ref=f1e127]:
            - link "󰅂 Transfer In & Out" [ref=f1e128] [cursor=pointer]:
              - /url: "javascript: void(0)"
              - generic [ref=f1e129]: 󰅂
              - generic [ref=f1e130]: Transfer In & Out
      - listitem [ref=f1e131]:
        - link "󰅂 Retail Operations" [ref=f1e132] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e134]: 󰅂
          - generic [ref=f1e135]: Retail Operations
        - text: 󰅂 󰅂
      - listitem [ref=f1e136]:
        - link " 󰅂 Finance" [ref=f1e137] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e138]: 
          - generic [ref=f1e139]: 󰅂
          - generic [ref=f1e140]: Finance
        - text: 󰅂
      - listitem [ref=f1e141]:
        - link "󰅂 Layaway / EMA Plans" [ref=f1e142] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e144]: 󰅂
          - generic [ref=f1e145]: Layaway / EMA Plans
        - text: 󰅂 󰅂
      - listitem [ref=f1e146]:
        - link "󰅂 HRMS" [ref=f1e147] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e149]: 󰅂
          - generic [ref=f1e150]: HRMS
        - text: 󰅂
      - listitem [ref=f1e151]:
        - link "󰅂 CRM" [ref=f1e152] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e154]: 󰅂
          - generic [ref=f1e155]: CRM
        - text: 󰅂
      - listitem [ref=f1e156]:
        - link "󰅂 Reports" [ref=f1e157] [cursor=pointer]:
          - /url: "javascript: void(0)"
          - generic [ref=f1e158]: 󰅂
          - generic [ref=f1e159]: Reports
        - text: 󰅂
    - generic [ref=f1e160]:
      - generic [ref=f1e161]: G&
      - generic [ref=f1e162]:
        - generic [ref=f1e163]: Gold & Diamonds
        - generic [ref=f1e164]: 2026 © SIONIQ
  - generic [ref=f1e168]:
    - generic [ref=f1e169]:
      - list [ref=f1e171]:
        - listitem [ref=f1e172]:
          - generic [ref=f1e173] [cursor=pointer]: Setup
        - listitem [ref=f1e176]:
          - generic [ref=f1e177] [cursor=pointer]: B2B
        - listitem [ref=f1e180]:
          - generic [ref=f1e181] [cursor=pointer]: Transfer In & Out
      - generic [ref=f1e185]:
        - list [ref=f1e188]:
          - listitem [ref=f1e189]: Sales & Distribution
          - listitem [ref=f1e190]:
            - text: 󰅂
            - generic [ref=f1e191]: B2B
          - listitem [ref=f1e192]: 󰅂 Order
        - generic: 󰅂
    - generic [ref=f1e194]:
      - generic [ref=f1e195]:
        - button "" [disabled]
        - button "" [disabled]
        - button "" [ref=f1e197] [cursor=pointer]
      - list [ref=f1e199]:
        - listitem [ref=f1e200]:
          - generic [ref=f1e201] [cursor=pointer]: Repair Registration
        - listitem [ref=f1e203]:
          - generic [ref=f1e204] [cursor=pointer]: Approval Issue
        - listitem [ref=f1e206]:
          - generic [ref=f1e207] [cursor=pointer]: Sample
        - listitem [ref=f1e209]:
          - generic [ref=f1e210] [cursor=pointer]: Repair Delivery
        - listitem [ref=f1e212]:
          - generic [ref=f1e213] [cursor=pointer]: Sales Return
        - listitem [ref=f1e215]:
          - generic [ref=f1e216] [cursor=pointer]: Approval Receipt
        - listitem [ref=f1e218]:
          - generic [ref=f1e219] [cursor=pointer]: Order
        - listitem [ref=f1e221]:
          - generic [ref=f1e222] [cursor=pointer]: Invoice
  - generic [ref=f1e226]:
    - tablist [ref=f1e227]:
      - tab "Order Booking" [selected] [ref=f1e228] [cursor=pointer]
      - tab "B2B Order Booking" [ref=f1e229] [cursor=pointer]
    - tabpanel "Order Booking" [ref=f1e231]:
      - generic [ref=f1e236]:
        - generic [ref=f1e237]:
          - generic [ref=f1e238]:
            - generic [ref=f1e240]:
              - textbox "Search" [ref=f1e241] [cursor=pointer]
              - generic: 
            - button "" [ref=f1e243] [cursor=pointer]
            - generic [ref=f1e245]:
              - button "" [ref=f1e246] [cursor=pointer]
              - text:   
            - generic [ref=f1e248]:
              - generic [ref=f1e250] [cursor=pointer]:
                - combobox: 8 items selected
              - generic [ref=f1e252]: "20"
            - generic [ref=f1e255] [cursor=pointer]:
              - combobox: empty
            - button "" [ref=f1e257] [cursor=pointer]
            - button "" [ref=f1e259] [cursor=pointer]
            - button "" [ref=f1e260] [cursor=pointer]
            - generic [ref=f1e262]:
              - generic [ref=f1e263]: "From - To :"
              - generic [ref=f1e265]:
                - combobox "Select start date" [ref=f1e266]: 01-06-2026 - 01-06-2026
                - button "Choose Date" [ref=f1e267] [cursor=pointer]
              - button "" [ref=f1e272] [cursor=pointer]
              - button "Search" [ref=f1e274] [cursor=pointer]
            - text: 
          - generic [ref=f1e276]:
            - generic [ref=f1e277]: "Records : 0"
            - separator [ref=f1e278]
            - generic [ref=f1e279]:
              - generic [ref=f1e280]: "Records Per Page:"
              - combobox [ref=f1e281]:
                - option "All"
                - option "5"
                - option "10"
                - option "15" [selected]
                - option "20"
                - option "25"
                - option "50"
            - separator [ref=f1e282]
            - generic [ref=f1e283]:
              - button "" [disabled]
              - spinbutton [ref=f1e284]: "1"
              - button "" [disabled]
              - generic [ref=f1e285]: / 1 pages
        - table [ref=f1e291]:
          - rowgroup [ref=f1e292]:
            - row [ref=f1e293]:
              - columnheader [ref=f1e294]:
                - generic [ref=f1e296]:
                  - generic:
                    - checkbox "All items unselected" [disabled]
              - columnheader "Sl No" [ref=f1e297]
              - columnheader "Order No  " [ref=f1e298] [cursor=pointer]:
                - generic [ref=f1e299]:
                  - generic [ref=f1e300]:
                    - generic [ref=f1e301]: Order No
                    - generic [ref=f1e302]: 
                  - generic [ref=f1e306]:
                    - generic [ref=f1e307]: 
                    - text:   
              - columnheader "Image  " [ref=f1e310] [cursor=pointer]:
                - generic [ref=f1e311]:
                  - generic [ref=f1e312]:
                    - generic [ref=f1e313]: Image
                    - generic [ref=f1e314]: 
                  - generic [ref=f1e318]:
                    - generic [ref=f1e319]: 
                    - text:   
              - columnheader "No of Pcs  " [ref=f1e322] [cursor=pointer]:
                - generic [ref=f1e323]:
                  - generic [ref=f1e324]:
                    - generic [ref=f1e325]: No of Pcs
                    - generic [ref=f1e326]: 
                  - generic [ref=f1e330]:
                    - generic [ref=f1e331]: 
                    - text:   
              - columnheader "Gross Weight  " [ref=f1e334] [cursor=pointer]:
                - generic [ref=f1e335]:
                  - generic [ref=f1e336]:
                    - generic [ref=f1e337]: Gross Weight
                    - generic [ref=f1e338]: 
                  - generic [ref=f1e342]:
                    - generic [ref=f1e343]: 
                    - text:   
              - columnheader "Component Weight  " [ref=f1e346] [cursor=pointer]:
                - generic [ref=f1e347]:
                  - generic [ref=f1e348]:
                    - generic [ref=f1e349]: Component Weight
                    - generic [ref=f1e350]: 
                  - generic [ref=f1e354]:
                    - generic [ref=f1e355]: 
                    - text:   
              - columnheader "Stone Weight  " [ref=f1e358] [cursor=pointer]:
                - generic [ref=f1e359]:
                  - generic [ref=f1e360]:
                    - generic [ref=f1e361]: Stone Weight
                    - generic [ref=f1e362]: 
                  - generic [ref=f1e366]:
                    - generic [ref=f1e367]: 
                    - text:   
              - columnheader "Net Weight  " [ref=f1e370] [cursor=pointer]:
                - generic [ref=f1e371]:
                  - generic [ref=f1e372]:
                    - generic [ref=f1e373]: Net Weight
                    - generic [ref=f1e374]: 
                  - generic [ref=f1e378]:
                    - generic [ref=f1e379]: 
                    - text:   
              - columnheader "Status  " [ref=f1e382] [cursor=pointer]:
                - generic [ref=f1e383]:
                  - generic [ref=f1e384]:
                    - generic [ref=f1e385]: Status
                    - generic [ref=f1e386]: 
                  - generic [ref=f1e390]:
                    - generic [ref=f1e391]: 
                    - text:   
            - row [ref=f1e394]:
              - cell [ref=f1e395]
              - cell "TOTALS" [ref=f1e396]
              - cell [ref=f1e398]:
                - strong
              - cell [ref=f1e399]:
                - strong
              - cell [ref=f1e400]:
                - strong [ref=f1e401]: "0"
              - cell [ref=f1e402]:
                - strong [ref=f1e403]: "0.000"
              - cell [ref=f1e404]:
                - strong [ref=f1e405]: "0.000"
              - cell [ref=f1e406]:
                - strong [ref=f1e407]: "0.000"
              - cell [ref=f1e408]:
                - strong [ref=f1e409]: "0.000"
              - cell [ref=f1e410]:
                - strong
          - rowgroup [ref=f1e411]:
            - row [ref=f1e412]:
              - cell [ref=f1e413]
              - cell "No Data found" [ref=f1e414]
          - rowgroup [ref=f1e415]:
            - row [ref=f1e416]:
              - cell [ref=f1e417]
              - cell [ref=f1e418]
              - cell [ref=f1e419]:
                - strong
              - cell [ref=f1e420]:
                - strong
              - cell [ref=f1e421]:
                - strong [ref=f1e422]: "0"
              - cell [ref=f1e423]:
                - strong [ref=f1e424]: "0.000"
              - cell [ref=f1e425]:
                - strong [ref=f1e426]: "0.000"
              - cell [ref=f1e427]:
                - strong [ref=f1e428]: "0.000"
              - cell [ref=f1e429]:
                - strong [ref=f1e430]: "0.000"
              - cell [ref=f1e431]:
                - strong
  - contentinfo [ref=f1e432]
```

# Test source

```ts
  1   | const { test, expect } = require('../../fixtures/test-fixtures');
  2   | const { DEMO_FILES } = require('../../utils/demo-files');
  3   | 
  4   | /**
  5   |  * TC-OB-001 — Order Booking: add a stock order through Order Details →
  6   |  * Build Order Items → Add Items → Next → Submit.
  7   |  *
  8   |  * Scenario data (QA lead screenshot, 23-08-2026):
  9   |  *   Item Type: Metal        Supervisor: Abc
  10  |  *   SM Code:   AJ10         Sales Executive: Ajin G (auto from SM code)
  11  |  *   Delivery Note: Regular  Reference Type: Combination
  12  |  *   Article:   Tendulkar (auto-fills Gold / Ring + every sub-category)
  13  |  *   Purity:    91.60        No of Pcs: 1 (preset)   Gross Weight: 50
  14  |  *
  15  |  * MUST run headed - see README (Device Radar gate + Local Network Access).
  16  |  *
  17  |  * KNOWN APP BUG (confirmed by QA lead, 28-08-2026): Submit currently fails -
  18  |  * POST OrderBooking/CreateOrderBooking returns HTTP 400 "One or more
  19  |  * validation errors occurred" listing fields the app should populate itself
  20  |  * (OrderBookingVRL.BaseUOM, ClientCurrencyName, and per-item HSNCode,
  21  |  * GroupCategory/Category + their ShortNames). The UI form is fully valid at
  22  |  * that point; the payload the app builds is just missing those fields.
  23  |  * Reproduced identically with manual hierarchy picks, searched article picks
  24  |  * and list article picks. This spec intentionally asserts the save response,
  25  |  * so it FAILS while the bug exists and turns green when dev fixes it.
  26  |  */
  27  | test.describe('Order Booking - add record', () => {
  28  |   test('TC-OB-001 add and submit a metal stock order', async ({ loginPage, orderBooking, page }) => {
  29  |     test.setTimeout(420_000);
  30  | 
  31  |     // ---- login ----
  32  |     await loginPage.open();
  33  |     await loginPage.login();
  34  |     await loginPage.throwIfGated();
  35  |     await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
  36  | 
  37  |     // ---- Sales & Distribution > B2B > Order, Order Booking tab ----
  38  |     await orderBooking.open();
  39  | 
  40  |     // delivery date = the app's PROCESS date (the header chip date, e.g.
  41  |     // "23/06/2026"), i.e. the login/business date - NOT the real system clock
  42  |     const deliveryDate = await orderBooking.processDate();
> 43  |     expect(deliveryDate, 'process date read from the header').toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      |                                                               ^ Error: process date read from the header
  44  |     console.log(`process (delivery) date: ${deliveryDate}`);
  45  | 
  46  |     await orderBooking.openAddWizard();
  47  | 
  48  |     // ---- General Order Information ----
  49  |     await orderBooking.fillOrderDetails({
  50  |       itemType: 'Metal',
  51  |       supervisor: 'sagar',
  52  |       smCode: 'EEEE1',
  53  |       deliveryNote: 'Regular',
  54  |       deliveryDate, // the process/login date
  55  |     });
  56  | 
  57  |     // Sales Executive auto-fills from the SM Executive Code
  58  |     await expect
  59  |       .poll(async () => orderBooking.selectValue('salesExecutive'), { timeout: 20_000 })
  60  |       .toBe('Ajin G');
  61  | 
  62  |     // ---- Build Order Items ----
  63  |     await orderBooking.fillItem({
  64  |       referenceType: 'Combination',
  65  |       groupCategory: 'Gold',
  66  |       category: 'Gold Ornaments',
  67  |       article: 'Tendulkar',
  68  |       purity: '91.60',
  69  |       grossWeight: 50,
  70  |     });
  71  | 
  72  |     // The article back-fills the whole hierarchy
  73  |     expect(await orderBooking.selectValue('groupCategory')).toBe('Gold');
  74  |     expect(await orderBooking.selectValue('category')).toBe('Ring');
  75  | 
  76  |     // ---- attach one demo image via the Add Files control ----
  77  |     await orderBooking.attachFileViaAddFiles(DEMO_FILES.image1);
  78  | 
  79  |     // ---- Add Items (verified via the Stock Order Summary panel) ----
  80  |     await orderBooking.addItemsAndVerify(1);
  81  |     const summary = await orderBooking.summaryText();
  82  |     expect(summary).toContain('Gross Weight : 50.000');
  83  |     expect(summary).toContain('Net Weight : 50.000');
  84  |     expect(summary).toMatch(/Sales Executive\s*:\s*AJ10 \/ Ajin G/);
  85  | 
  86  |     // ---- Next -> Submit ----
  87  |     if (!(await orderBooking.submitBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
  88  |       await orderBooking.nextBtn.click();
  89  |       await orderBooking.waitForIdle();
  90  |     }
  91  |     await expect(orderBooking.submitBtn).toBeVisible({ timeout: 30_000 });
  92  |     const { responses, diag } = await orderBooking.submitWithDiagnostics();
  93  |     const save = responses.find((r) => r.body);
  94  |     expect(save, `no save response captured; validation state: ${JSON.stringify(diag)}`).toBeTruthy();
  95  |     expect(save.status, `save rejected: ${JSON.stringify(save && save.body)}`).toBeLessThan(400);
  96  |     expect(JSON.stringify(save.body)).toMatch(/success/i);
  97  |     console.log(`Order saved: ${JSON.stringify(save.body.data || save.body).slice(0, 150)}`);
  98  | 
  99  |     await page.screenshot({ path: 'test-results/screens/tc-ob-001-after-save.png', fullPage: true });
  100 |   });
  101 | });
  102 | 
```