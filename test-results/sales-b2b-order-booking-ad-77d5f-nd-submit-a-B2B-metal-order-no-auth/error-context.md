# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales\b2b-order-booking-add.noauth.spec.js >> B2B Order Booking - add record >> TC-B2B-001 add and submit a B2B metal order
- Location: tests\sales\b2b-order-booking-add.noauth.spec.js:28:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Ajin G"
Received: "Sioniquser1"

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
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
      - tab "Order Booking" [ref=f1e228] [cursor=pointer]
      - tab "B2B Order Booking" [selected] [ref=f1e229] [cursor=pointer]
    - tabpanel "B2B Order Booking" [ref=f1e231]:
      - generic [ref=f1e237]:
        - generic [ref=f1e238]:
          - generic [ref=f1e240]:
            - generic [ref=f1e241]:
              - generic [ref=f1e242] [cursor=pointer]: 
              - generic [ref=f1e244]:
                - heading "B2B Order Booking" [level=4] [ref=f1e245]
                - paragraph [ref=f1e246]: Please complete the form below to add a new one
            - generic [ref=f1e248]:
              - generic [ref=f1e249]:
                - generic [ref=f1e250]: 
                - generic [ref=f1e252]:
                  - generic [ref=f1e253]: Step 1
                  - generic [ref=f1e254]: Order Details
              - generic [ref=f1e256]:
                - generic [ref=f1e257]: "2"
                - generic [ref=f1e259]:
                  - generic [ref=f1e260]: Step 2
                  - generic [ref=f1e261]: Build Order Items
          - generic [ref=f1e262]:
            - generic [ref=f1e264]:
              - generic [ref=f1e265]:
                - heading "General Order Information" [level=5] [ref=f1e267]
                - separator [ref=f1e268]
                - generic [ref=f1e269]:
                  - generic [ref=f1e270]: 
                  - text: Completed
                - generic [ref=f1e272] [cursor=pointer]
              - generic [ref=f1e273]:
                - generic [ref=f1e274]:
                  - generic [ref=f1e275]:
                    - generic [ref=f1e276]: Purpose Type
                    - generic [ref=f1e281]:
                      - generic [ref=f1e282]:
                        - generic [ref=f1e283]:
                          - generic [ref=f1e284]: Order
                          - combobox [ref=f1e288]
                        - button "Clear" [ref=f1e289] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e290] [cursor=pointer]
                      - status [ref=f1e291]
                  - generic [ref=f1e292]:
                    - generic [ref=f1e293]: Customer
                    - generic [ref=f1e298]:
                      - generic [ref=f1e299]:
                        - generic [ref=f1e300]:
                          - generic [ref=f1e301]: Celestia Jewels P
                          - combobox [ref=f1e305]
                        - button "Clear" [ref=f1e306] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e307] [cursor=pointer]
                      - status [ref=f1e308]
                  - generic [ref=f1e309]:
                    - generic [ref=f1e310]: Customer Branch
                    - generic [ref=f1e315]:
                      - generic [ref=f1e316]:
                        - generic [ref=f1e317]:
                          - generic [ref=f1e318]: Please Select
                          - combobox [ref=f1e320]
                        - generic [ref=f1e321] [cursor=pointer]
                      - status [ref=f1e322]
                  - generic [ref=f1e323]:
                    - generic [ref=f1e324]: Item Type
                    - generic [ref=f1e329]:
                      - generic [ref=f1e330]:
                        - generic [ref=f1e331]:
                          - generic [ref=f1e332]: Metal
                          - combobox [ref=f1e336]
                        - button "Clear" [ref=f1e337] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e338] [cursor=pointer]
                      - status [ref=f1e339]
                  - generic [ref=f1e340]:
                    - generic [ref=f1e341]: Making Type
                    - generic [ref=f1e346]:
                      - generic [ref=f1e347]:
                        - generic [ref=f1e348]:
                          - generic [ref=f1e349]: Job Work
                          - combobox [ref=f1e353]
                        - button "Clear" [ref=f1e354] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e355] [cursor=pointer]
                      - status [ref=f1e356]
                  - generic [ref=f1e357]:
                    - generic [ref=f1e358]: Supervisor
                    - generic [ref=f1e363]:
                      - generic [ref=f1e364]:
                        - generic [ref=f1e365]:
                          - generic [ref=f1e366]: Sagar
                          - combobox [ref=f1e370]
                        - button "Clear" [ref=f1e371] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e372] [cursor=pointer]
                      - status [ref=f1e373]
                  - generic [ref=f1e374]:
                    - generic [ref=f1e375]: SM Executive Code
                    - generic [ref=f1e380]:
                      - generic [ref=f1e381]:
                        - generic [ref=f1e382]:
                          - generic [ref=f1e383]: EEEE1
                          - combobox [ref=f1e387]
                        - button "Clear" [ref=f1e388] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e389] [cursor=pointer]
                      - status [ref=f1e390]
                  - generic [ref=f1e391]:
                    - generic [ref=f1e392]: Sales Executive
                    - generic [ref=f1e397]:
                      - generic [ref=f1e398]:
                        - generic [ref=f1e399]:
                          - generic [ref=f1e400]: Sioniquser1
                          - combobox [ref=f1e404]
                        - button "Clear" [ref=f1e405] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e406] [cursor=pointer]
                      - status [ref=f1e407]
                  - generic [ref=f1e408]:
                    - generic [ref=f1e409]: Order Given By
                    - textbox [ref=f1e410]: JJ
                  - generic [ref=f1e411]:
                    - generic [ref=f1e412]: Contact Number
                    - textbox [ref=f1e413]: "9898989899"
                  - generic [ref=f1e414]:
                    - generic [ref=f1e415]: Delivery Note
                    - generic [ref=f1e420]:
                      - generic [ref=f1e421]:
                        - generic [ref=f1e422]:
                          - generic [ref=f1e423]: Urgent
                          - combobox [ref=f1e427]
                        - button "Clear" [ref=f1e428] [cursor=pointer]:
                          - generic: ×
                        - generic [ref=f1e429] [cursor=pointer]
                      - status [ref=f1e430]
                  - generic [ref=f1e431]:
                    - generic [ref=f1e432]: Delivery Date
                    - generic [ref=f1e435]:
                      - textbox "Delivery Date" [active] [ref=f1e436]:
                        - /placeholder: DD-MM-YYYY
                        - text: 15-10-2026
                      - generic [ref=f1e437]: 
                - generic [ref=f1e439]:
                  - generic [ref=f1e440]: 
                  - generic [ref=f1e442]: Address Information
                - generic [ref=f1e443]:
                  - generic [ref=f1e444]:
                    - heading "Billing Address" [level=5] [ref=f1e448]
                    - generic [ref=f1e449]:
                      - heading "Celestia Jewels P" [level=5] [ref=f1e450]
                      - paragraph [ref=f1e451]: 23, Fort Road, Sultanpet, Palakkad, Kerala 678001, India
                      - generic [ref=f1e452]:
                        - paragraph [ref=f1e453]:
                          - text: "Ph No:"
                          - link "7485962458" [ref=f1e454] [cursor=pointer]:
                            - /url: tel:7485962458
                        - paragraph [ref=f1e455]:
                          - text: "Email :"
                          - link "celestia@gmail.com" [ref=f1e456] [cursor=pointer]:
                            - /url: mailto:celestia@gmail.com
                  - generic [ref=f1e457]:
                    - heading "Shipping Address" [level=5] [ref=f1e461]
                    - generic [ref=f1e462]:
                      - heading "Celestia Jewels P" [level=5] [ref=f1e463]
                      - paragraph [ref=f1e464]: 23, Fort Road, Sultanpet, Palakkad, Kerala 678001, India
                      - generic [ref=f1e465]:
                        - paragraph [ref=f1e466]:
                          - text: "Ph No:"
                          - link "7485962458" [ref=f1e467] [cursor=pointer]:
                            - /url: tel:7485962458
                        - paragraph [ref=f1e468]:
                          - text: "Email :"
                          - link "celestia@gmail.com" [ref=f1e469] [cursor=pointer]:
                            - /url: mailto:celestia@gmail.com
                  - generic [ref=f1e470]:
                    - text: "Industry Type :"
                    - heading [level=5]
                  - generic [ref=f1e471]:
                    - text: "Branch :"
                    - heading [level=5]
            - generic [ref=f1e473]:
              - generic [ref=f1e474]:
                - generic [ref=f1e475]: 
                - heading "Build B2B Order Items" [level=5] [ref=f1e476]
                - separator [ref=f1e477]
                - generic [ref=f1e478]:
                  - generic [ref=f1e479]: 
                  - text: In Progress
              - generic [ref=f1e480]:
                - generic [ref=f1e481]:
                  - generic [ref=f1e482]:
                    - generic [ref=f1e483]: Reference type
                    - generic [ref=f1e488]:
                      - generic [ref=f1e489]:
                        - generic [ref=f1e490]:
                          - generic [ref=f1e491]: Please Select
                          - combobox [ref=f1e493]
                        - generic [ref=f1e494] [cursor=pointer]
                      - status [ref=f1e495]
                  - generic [ref=f1e496]:
                    - generic [ref=f1e497]: Group Category
                    - generic [ref=f1e502]:
                      - generic [ref=f1e503]:
                        - generic [ref=f1e504]:
                          - generic [ref=f1e505]: Please Select
                          - combobox [ref=f1e507]
                        - generic [ref=f1e508] [cursor=pointer]
                      - status [ref=f1e509]
                  - generic [ref=f1e510]:
                    - generic [ref=f1e511]: Category
                    - generic [ref=f1e516]:
                      - generic [ref=f1e517]:
                        - generic [ref=f1e518]:
                          - generic [ref=f1e519]: Please Select
                          - combobox [ref=f1e521]
                        - generic [ref=f1e522] [cursor=pointer]
                      - status [ref=f1e523]
                  - generic [ref=f1e524]:
                    - generic [ref=f1e525]: Style
                    - generic [ref=f1e530]:
                      - generic [ref=f1e531]:
                        - generic [ref=f1e532]:
                          - generic [ref=f1e533]: Please Select
                          - combobox [ref=f1e535]
                        - generic [ref=f1e536] [cursor=pointer]
                      - status [ref=f1e537]
                  - generic [ref=f1e538]:
                    - generic [ref=f1e539]: Subgroup
                    - generic [ref=f1e544]:
                      - generic [ref=f1e545]:
                        - generic [ref=f1e546]:
                          - generic [ref=f1e547]: Please Select
                          - combobox [ref=f1e549]
                        - generic [ref=f1e550] [cursor=pointer]
                      - status [ref=f1e551]
                  - generic [ref=f1e552]:
                    - generic [ref=f1e553]: Model
                    - generic [ref=f1e558]:
                      - generic [ref=f1e559]:
                        - generic [ref=f1e560]:
                          - generic [ref=f1e561]: Please Select
                          - combobox [ref=f1e563]
                        - generic [ref=f1e564] [cursor=pointer]
                      - status [ref=f1e565]
                  - generic [ref=f1e566]:
                    - generic [ref=f1e567]: Article
                    - generic [ref=f1e572]:
                      - generic [ref=f1e573]:
                        - generic [ref=f1e574]:
                          - generic [ref=f1e575]: Please Select
                          - combobox [ref=f1e577]
                        - generic [ref=f1e578] [cursor=pointer]
                      - status [ref=f1e579]
                  - generic [ref=f1e580]:
                    - generic [ref=f1e581]: Purity
                    - generic [ref=f1e586]:
                      - generic [ref=f1e587]:
                        - generic [ref=f1e588]:
                          - generic [ref=f1e589]: Please Select
                          - combobox [ref=f1e591]
                        - generic [ref=f1e592] [cursor=pointer]
                      - status [ref=f1e593]
                - generic [ref=f1e594]:
                  - generic [ref=f1e595]:
                    - generic [ref=f1e596]: 
                    - heading "Add Weight Details" [level=5] [ref=f1e598]
                    - separator [ref=f1e599]
                  - generic [ref=f1e600]:
                    - generic [ref=f1e601]:
                      - generic [ref=f1e602]:
                        - generic [ref=f1e603]: No of Pcs
                        - spinbutton [disabled] [ref=f1e604]: "1"
                      - generic [ref=f1e605]:
                        - generic [ref=f1e606]:
                          - generic [ref=f1e607]: Gross Weight
                          - button [ref=f1e608] [cursor=pointer]
                        - spinbutton [ref=f1e610]: "0.000"
                        - text: Min Weight Should At Least
                    - generic [ref=f1e612]:
                      - generic [ref=f1e616]:
                        - generic [ref=f1e617]: Component Weight
                        - heading "0.000" [level=4] [ref=f1e618]
                      - button "+" [ref=f1e619] [cursor=pointer]
                    - generic [ref=f1e624]:
                      - generic [ref=f1e625]: Diamond Weight
                      - heading "0.000" [level=4] [ref=f1e627]
                    - generic [ref=f1e629]:
                      - generic [ref=f1e633]:
                        - generic [ref=f1e634]: Stone Weight
                        - heading "0.000" [level=4] [ref=f1e635]
                      - button "+" [ref=f1e636] [cursor=pointer]
                    - generic [ref=f1e641]:
                      - generic [ref=f1e642]: Net weight
                      - heading "0.000" [level=4] [ref=f1e644]
                    - generic [ref=f1e645]:
                      - generic [ref=f1e646]: Rate
                      - textbox [ref=f1e647]
                - generic [ref=f1e648]:
                  - generic [ref=f1e649]:
                    - strong [ref=f1e651]:
                      - text: Tunch (%)
                      - generic [ref=f1e652]: (on )
                    - generic [ref=f1e653]: "0"
                  - generic [ref=f1e654]:
                    - strong [ref=f1e656]: Wastage (%)
                    - generic [ref=f1e657]: "0"
                  - generic [ref=f1e658]:
                    - strong [ref=f1e660]: Wastage
                    - generic [ref=f1e661]: "0.000"
                  - generic [ref=f1e662]:
                    - strong [ref=f1e664]: Pure Weight
                    - generic [ref=f1e665]: 0.000 gm
                  - generic [ref=f1e666]:
                    - strong [ref=f1e668]:
                      - text: Making
                      - generic [ref=f1e669]: (on )
                    - generic [ref=f1e670]: 0.00 ₹
                  - generic [ref=f1e671]:
                    - strong [ref=f1e673]: Making Amount
                    - generic [ref=f1e674]: 0.00 ₹
                  - generic [ref=f1e675]:
                    - strong [ref=f1e677]: Diamond Amount
                    - generic [ref=f1e678]: 0.00 ₹
                  - generic [ref=f1e679]:
                    - strong [ref=f1e681]: Stone Amount
                    - generic [ref=f1e682]: 0.00 ₹
                - generic [ref=f1e683]:
                  - generic [ref=f1e684]:
                    - generic [ref=f1e685]: Remarks
                    - textbox [ref=f1e686]
                  - generic [ref=f1e687]:
                    - strong [ref=f1e689]: Quantity
                    - generic [ref=f1e690]:
                      - button "-" [ref=f1e691] [cursor=pointer]
                      - textbox [ref=f1e692]: "1"
                      - button "+" [ref=f1e693] [cursor=pointer]
                  - generic [ref=f1e694]:
                    - button "Add Sample" [ref=f1e695] [cursor=pointer]
                    - button "Add Certification" [ref=f1e698] [cursor=pointer]
                    - button "Add Files " [ref=f1e701] [cursor=pointer]:
                      - generic [ref=f1e702]: Add Files
                      - generic [ref=f1e703]: 
                    - button "Custom Control" [ref=f1e704] [cursor=pointer]
                    - button "Add Items" [ref=f1e707] [cursor=pointer]
                - generic [ref=f1e709]:
                  - generic [ref=f1e710]:
                    - generic [ref=f1e711]: Weight Total
                    - generic [ref=f1e712]:
                      - generic [ref=f1e713]:
                        - generic [ref=f1e714]: "Pieces :"
                        - generic [ref=f1e715]: "0"
                      - generic [ref=f1e716]:
                        - generic [ref=f1e717]: "Gross Weight :"
                        - generic [ref=f1e718]:
                          - text: "0.000"
                          - generic [ref=f1e719]: Gram
                      - generic [ref=f1e720]:
                        - generic [ref=f1e721]: "Component Weight :"
                        - generic [ref=f1e722]:
                          - text: "0.000"
                          - generic [ref=f1e723]: Gram
                      - generic [ref=f1e724]:
                        - generic [ref=f1e725]: "Diamond Weight :"
                        - generic [ref=f1e726]:
                          - text: "0.000"
                          - generic [ref=f1e727]: Gram
                      - generic [ref=f1e728]:
                        - generic [ref=f1e729]: Stone Weight
                        - generic [ref=f1e730]:
                          - text: "0.000"
                          - generic [ref=f1e731]: Gram
                      - generic [ref=f1e732]:
                        - generic [ref=f1e733]: Net Weight
                        - generic [ref=f1e734]:
                          - text: "0.000"
                          - generic [ref=f1e735]: Gram
                      - generic [ref=f1e736]:
                        - generic [ref=f1e737]: Pure Weight
                        - generic [ref=f1e738]:
                          - text: "0.000"
                          - generic [ref=f1e739]: Gram
                  - generic [ref=f1e740]:
                    - generic [ref=f1e741]: Amount Total
                    - generic [ref=f1e742]:
                      - generic [ref=f1e743]:
                        - generic [ref=f1e744]: "Making Amount :"
                        - generic [ref=f1e745]:
                          - text: "0.00"
                          - generic [ref=f1e746]: ₹
                      - generic [ref=f1e747]:
                        - generic [ref=f1e748]: "Diamond Amount :"
                        - generic [ref=f1e749]:
                          - text: "0.00"
                          - generic [ref=f1e750]: ₹
                      - generic [ref=f1e751]:
                        - generic [ref=f1e752]: Stone Amount
                        - generic [ref=f1e753]:
                          - text: "0.00"
                          - generic [ref=f1e754]: ₹
                      - generic [ref=f1e755]:
                        - generic [ref=f1e756]: Total Amount
                        - generic [ref=f1e757]:
                          - text: "0.00"
                          - generic [ref=f1e758]: ₹
                - generic [ref=f1e759]:
                  - generic [ref=f1e760]:
                    - generic [ref=f1e761]: Remarks
                    - textbox [ref=f1e762]
                  - button "Custom Control" [ref=f1e763] [cursor=pointer]
        - generic [ref=f1e767]:
          - generic [ref=f1e768]:
            - heading "B2B Order Summary" [level=4] [ref=f1e769]
            - generic [ref=f1e770]: Metal
          - generic [ref=f1e775]:
            - generic [ref=f1e776]:
              - generic [ref=f1e778]:
                - generic [ref=f1e779]:
                  - generic [ref=f1e780]: "Customer Name :"
                  - generic [ref=f1e781]: Celestia Jewels P
                - button [ref=f1e783] [cursor=pointer]
              - generic [ref=f1e785]: Sales Executive :EEEE1 / Sioniquser1
            - generic [ref=f1e786]:
              - generic [ref=f1e787]:
                - heading "No. of Items :" [level=6] [ref=f1e788]
                - heading "0" [level=3] [ref=f1e789]
              - generic [ref=f1e790]:
                - heading "No. of Pieces :" [level=6] [ref=f1e791]
                - heading "0" [level=3] [ref=f1e792]
            - generic [ref=f1e793]: Gram
            - generic [ref=f1e794]:
              - heading "Gross Weight :" [level=6] [ref=f1e795]
              - heading "0.000" [level=3] [ref=f1e796]
            - separator [ref=f1e797]
            - generic [ref=f1e798]:
              - heading [level=6] [ref=f1e799]:
                - text: "Component Weight :"
                - button [ref=f1e800] [cursor=pointer]
              - heading "0.000" [level=3] [ref=f1e802]
            - separator [ref=f1e803]
            - generic [ref=f1e804]:
              - heading "Diamond Weight :" [level=6] [ref=f1e805]
              - heading "0.000" [level=3] [ref=f1e806]
            - generic [ref=f1e807]:
              - heading "Stone Weight :" [level=6] [ref=f1e808]
              - heading "0.000" [level=3] [ref=f1e809]
            - generic [ref=f1e810]:
              - heading "Net Weight :" [level=6] [ref=f1e811]
              - heading "0.000" [level=3] [ref=f1e812]
            - generic [ref=f1e813]:
              - heading "Pure Weight :" [level=6] [ref=f1e814]
              - heading "0.000" [level=3] [ref=f1e815]
            - generic [ref=f1e816]:
              - generic [ref=f1e817]:
                - heading "Making Amount :" [level=6] [ref=f1e818]
                - heading "0.00" [level=3] [ref=f1e819]
              - generic [ref=f1e820]:
                - heading "Diamond Amount :" [level=6] [ref=f1e821]
                - heading "0.00" [level=3] [ref=f1e822]
              - generic [ref=f1e823]:
                - heading "Stone Amount :" [level=6] [ref=f1e824]
                - heading "0.00" [level=3] [ref=f1e825]
            - generic [ref=f1e826]:
              - heading "Total Amount :" [level=6] [ref=f1e827]
              - heading "₹0.00" [level=1] [ref=f1e828]
          - generic [ref=f1e829]:
            - button "" [ref=f1e830] [cursor=pointer]
            - button " Previous" [disabled]:
              - generic: 
              - text: Previous
            - button "Next " [ref=f1e832] [cursor=pointer]:
              - text: Next
              - generic [ref=f1e833]: 
  - contentinfo [ref=f1e834]
```

# Test source

```ts
  1  | const { test, expect } = require('../../fixtures/test-fixtures');
  2  | const { businessDate } = require('../../utils/unique');
  3  | 
  4  | /**
  5  |  * TC-B2B-001 — B2B Order Booking: add an order through Order Details →
  6  |  * Build B2B Order Items → Add Items → Next → Submit.
  7  |  *
  8  |  * Scenario data (QA lead screenshot, 28-08-2026):
  9  |  *   Purpose Type: Order      Customer: Luxurio (address panel auto-fills)
  10 |  *   Customer Branch: (empty) Item Type: Metal      Making Type: Job Work
  11 |  *   Supervisor: Abc          SM Code: AJ10 -> Sales Executive: Ajin G
  12 |  *   Order Given By: JJ       Contact Number: 9898989899
  13 |  *   Delivery Note: Urgent    Delivery Date: any date
  14 |  *   Items: Combination / Gold / Ring / Tendulkar / 91.60 / gross 50
  15 |  *
  16 |  * MUST run headed - see README (Device Radar gate + Local Network Access).
  17 |  *
  18 |  * KNOWN APP BUG (confirmed 28-08-2026): B2B shares the Order Booking save
  19 |  * endpoint and its defect - POST OrderBooking/CreateOrderBooking returns
  20 |  * HTTP 400 listing app-derived fields as missing (VRL.BaseUOM,
  21 |  * ClientCurrencyName; per-item HSNCode, GroupCategory/Category + ShortNames)
  22 |  * while the UI form is fully valid. Same failure as TC-OB-001 (bug report
  23 |  * filed); sample B2B traceId 00-c91972f93d6e0db00bd477af252d6745. This spec
  24 |  * asserts the save response, so it FAILS while the bug exists and turns
  25 |  * green when dev fixes it.
  26 |  */
  27 | test.describe('B2B Order Booking - add record', () => {
  28 |   test('TC-B2B-001 add and submit a B2B metal order', async ({ loginPage, b2bOrderBooking, page }) => {
  29 |     test.setTimeout(420_000);
  30 | 
  31 |     // ---- login ----
  32 |     await loginPage.open();
  33 |     await loginPage.login();
  34 |     await loginPage.throwIfGated();
  35 |     await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
  36 | 
  37 |     // ---- Sales & Distribution > B2B > Order, B2B Order Booking tab ----
  38 |     await b2bOrderBooking.open();
  39 |     await b2bOrderBooking.openAddWizard();
  40 | 
  41 |     // ---- General Order Information ----
  42 |     await b2bOrderBooking.fillOrderDetails({
  43 |       purposeType: 'Order',
  44 |       customer: 'Celestia Jewels P',
  45 |       itemType: 'Metal',
  46 |       makingType: 'Job Work',
  47 |       supervisor: 'sagar',
  48 |       smCode: 'EEEE1',
  49 |       orderGivenBy: 'JJ',
  50 |       contactNumber: '9898989899',
  51 |       deliveryNote: 'Urgent',
  52 |       deliveryDate: businessDate(30).replace(/-/g, '/'), // DD/MM/YYYY
  53 |     });
  54 | 
  55 |     // Sales Executive auto-fills from the SM code; the summary panel carries
  56 |     // the customer picked above.
  57 |     await expect
  58 |       .poll(async () => b2bOrderBooking.selectValue('salesExecutive'), { timeout: 20_000 })
> 59 |       .toBe('Ajin G');
     |        ^ Error: expect(received).toBe(expected) // Object.is equality
  60 |     await expect
  61 |       .poll(async () => b2bOrderBooking.summaryText(), { timeout: 20_000 })
  62 |       .toMatch(/Customer Name\s*:\s*Luxurio/);
  63 | 
  64 |     // ---- Build B2B Order Items ----
  65 |     await b2bOrderBooking.fillItem({
  66 |       referenceType: 'Combination',
  67 |       groupCategory: 'Gold',
  68 |       category: 'Gold Ornaments',
  69 |       article: 'Tendulkar',
  70 |       purity: '91.60',
  71 |       grossWeight: 50,
  72 |     });
  73 | 
  74 |     // ---- Add Items (verified via the B2B Order Summary panel) ----
  75 |     await b2bOrderBooking.addItemsAndVerify(1);
  76 |     const summary = await b2bOrderBooking.summaryText();
  77 |     expect(summary).toContain('Gross Weight : 50.000');
  78 |     expect(summary).toContain('Net Weight : 50.000');
  79 | 
  80 |     // ---- Next -> Submit ----
  81 |     if (!(await b2bOrderBooking.submitBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
  82 |       await b2bOrderBooking.nextBtn.click();
  83 |       await b2bOrderBooking.waitForIdle();
  84 |     }
  85 |     await expect(b2bOrderBooking.submitBtn).toBeVisible({ timeout: 30_000 });
  86 |     const { responses, diag } = await b2bOrderBooking.submitWithDiagnostics();
  87 |     const save = responses.find((r) => r.body);
  88 |     expect(save, `no save response captured; validation state: ${JSON.stringify(diag)}`).toBeTruthy();
  89 |     expect(save.status, `save rejected: ${JSON.stringify(save && save.body)}`).toBeLessThan(400);
  90 |     expect(JSON.stringify(save.body)).toMatch(/success/i);
  91 |     console.log(`B2B order saved: ${JSON.stringify(save.body.data || save.body).slice(0, 150)}`);
  92 | 
  93 |     await page.screenshot({ path: 'test-results/screens/tc-b2b-001-after-save.png', fullPage: true });
  94 |   });
  95 | });
  96 | 
```