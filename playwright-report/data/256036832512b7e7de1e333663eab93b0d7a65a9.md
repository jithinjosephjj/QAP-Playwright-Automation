# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crm\customer-registration-add.noauth.spec.js >> Customer Registration - add record >> TC-CRM-CUST-01 add an Individual customer
- Location: tests\crm\customer-registration-add.noauth.spec.js:35:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.ng-dropdown-panel .ng-option').filter({ hasText: 'Aadhar Card' }).first()

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
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
          - button "user-image 01-01-2026 Cochin" [ref=f1e44] [cursor=pointer]:
            - img "user-image" [ref=f1e46]
            - generic [ref=f1e47]:
              - heading "01-01-2026" [level=6] [ref=f1e48]
              - generic [ref=f1e49]: Cochin
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
          - link " 󰅂 Sales & Distribution" [ref=f1e87] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e88]: 
            - generic [ref=f1e89]: 󰅂
            - generic [ref=f1e90]: Sales & Distribution
          - text: 󰅂 󰅂 󰅂
        - listitem [ref=f1e91]:
          - link "󰅂 Retail Operations" [ref=f1e92] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e94]: 󰅂
            - generic [ref=f1e95]: Retail Operations
          - text: 󰅂 󰅂
        - listitem [ref=f1e96]:
          - link " 󰅂 Finance" [ref=f1e97] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e98]: 
            - generic [ref=f1e99]: 󰅂
            - generic [ref=f1e100]: Finance
          - text: 󰅂
        - listitem [ref=f1e101]:
          - link "󰅂 Layaway / EMA Plans" [ref=f1e102] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e104]: 󰅂
            - generic [ref=f1e105]: Layaway / EMA Plans
          - text: 󰅂 󰅂
        - listitem [ref=f1e106]:
          - link "󰅂 HRMS" [ref=f1e107] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e109]: 󰅂
            - generic [ref=f1e110]: HRMS
          - text: 󰅂
        - listitem [ref=f1e111]:
          - link "󰅂 CRM" [expanded] [ref=f1e112] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e114]: 󰅂
            - generic [ref=f1e115]: CRM
          - list [ref=f1e117]:
            - listitem [ref=f1e118]:
              - link "󰅂 Operations" [expanded] [ref=f1e119] [cursor=pointer]:
                - /url: "javascript: void(0)"
                - generic [ref=f1e120]: 󰅂
                - generic [ref=f1e121]: Operations
              - list [ref=f1e123]:
                - listitem [ref=f1e124]:
                  - link "Customer Registration" [ref=f1e125] [cursor=pointer]:
                    - /url: /crm/customer-list
        - listitem [ref=f1e127]:
          - link "󰅂 Reports" [ref=f1e128] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e129]: 󰅂
            - generic [ref=f1e130]: Reports
          - text: 󰅂
      - generic [ref=f1e131]:
        - generic [ref=f1e132]: G&
        - generic [ref=f1e133]:
          - generic [ref=f1e134]: Gold & Diamonds
          - generic [ref=f1e135]: 2026 © SIONIQ
    - generic [ref=f1e139]:
      - generic [ref=f1e140]:
        - list [ref=f1e142]:
          - listitem [ref=f1e143]:
            - generic [ref=f1e144] [cursor=pointer]: Operations
        - generic [ref=f1e148]:
          - list [ref=f1e151]:
            - listitem [ref=f1e152]: CRM
            - listitem [ref=f1e153]:
              - text: 󰅂
              - generic [ref=f1e154]: Operations
            - listitem [ref=f1e155]: 󰅂 Customer Registration
          - generic: 󰅂
      - generic [ref=f1e157]:
        - generic [ref=f1e158]:
          - button "" [disabled]
          - button "" [disabled]
          - button "" [ref=f1e160] [cursor=pointer]
        - list [ref=f1e162]:
          - listitem [ref=f1e163]:
            - generic [ref=f1e164] [cursor=pointer]: Customer Registration
    - generic [ref=f1e171]:
      - generic [ref=f1e173]:
        - generic [ref=f1e174] [cursor=pointer]: 
        - generic [ref=f1e176]:
          - heading "Customer Registration" [level=4] [ref=f1e177]
          - paragraph [ref=f1e178]: Add New Record
      - generic [ref=f1e180]:
        - generic [ref=f1e182] [cursor=pointer]: Identity
        - generic [ref=f1e185] [cursor=pointer]: Contact
        - generic [ref=f1e188] [cursor=pointer]: Financial
        - generic [ref=f1e191] [cursor=pointer]: Review
      - generic [ref=f1e195]:
        - generic [ref=f1e196]:
          - generic [ref=f1e197]:
            - generic [ref=f1e198]:
              - generic [ref=f1e199]: 
              - heading "Group Info" [level=5] [ref=f1e201]
              - separator [ref=f1e202]
            - group [ref=f1e204]:
              - button " Individual" [ref=f1e205] [cursor=pointer]:
                - generic [ref=f1e206]: 
                - text: Individual
              - button " New Group (Primary)" [ref=f1e207] [cursor=pointer]:
                - generic [ref=f1e208]: 
                - text: New Group (Primary)
              - button " Link to Existing" [ref=f1e209] [cursor=pointer]:
                - generic [ref=f1e210]: 
                - text: Link to Existing
          - generic [ref=f1e211]:
            - generic [ref=f1e212]:
              - generic [ref=f1e213]: 
              - heading "Personal Information" [level=5] [ref=f1e215]
              - separator [ref=f1e216]
              - checkbox [checked] [ref=f1e218]
            - generic [ref=f1e220]:
              - generic [ref=f1e228] [cursor=pointer]
              - generic [ref=f1e231]:
                - generic [ref=f1e233]:
                  - generic [ref=f1e234]: Customer Type
                  - generic [ref=f1e239]:
                    - generic [ref=f1e240]:
                      - generic [ref=f1e241]:
                        - generic [ref=f1e242]: Individual
                        - combobox [ref=f1e246]
                      - generic [ref=f1e247] [cursor=pointer]
                    - status [ref=f1e248]
                - generic [ref=f1e250]:
                  - generic [ref=f1e251]: Mobile Number
                  - generic [ref=f1e252]:
                    - generic [ref=f1e258]:
                      - generic [ref=f1e259]:
                        - generic [ref=f1e260]:
                          - generic [ref=f1e261]: "+91"
                          - combobox [ref=f1e266]
                        - generic [ref=f1e267] [cursor=pointer]
                      - status [ref=f1e268]
                    - textbox [ref=f1e270]: "9361379454"
                - generic [ref=f1e272]:
                  - generic [ref=f1e273]: Name (Existing match)
                  - generic [ref=f1e278]:
                    - generic [ref=f1e279]:
                      - generic [ref=f1e280]:
                        - generic [ref=f1e281]: New Customer
                        - combobox [ref=f1e285]
                      - generic [ref=f1e286] [cursor=pointer]
                    - status [ref=f1e287]
                - generic [ref=f1e289]:
                  - generic [ref=f1e290]: Title
                  - generic [ref=f1e295]:
                    - generic [ref=f1e296]:
                      - generic [ref=f1e297]:
                        - generic [ref=f1e298]: Mr.
                        - combobox [ref=f1e302]
                      - button "Clear" [ref=f1e303] [cursor=pointer]:
                        - generic: ×
                      - generic [ref=f1e304] [cursor=pointer]
                    - status [ref=f1e305]
                - generic [ref=f1e307]:
                  - generic [ref=f1e308]: Full Name
                  - textbox [ref=f1e309]: SioniqCustomertwo
                - generic [ref=f1e311]:
                  - generic [ref=f1e312]: Gender
                  - generic [ref=f1e317]:
                    - generic [ref=f1e318]:
                      - generic [ref=f1e319]:
                        - generic [ref=f1e320]: Male
                        - combobox [ref=f1e324]
                      - button "Clear" [ref=f1e325] [cursor=pointer]:
                        - generic: ×
                      - generic [ref=f1e326] [cursor=pointer]
                    - status [ref=f1e327]
                - generic [ref=f1e329]:
                  - generic [ref=f1e330]: Date of Birth
                  - generic [ref=f1e333]:
                    - textbox "DD-MM-YYYY" [ref=f1e334]: 01-12-1996
                    - generic [ref=f1e335]: 
                - generic [ref=f1e338]:
                  - generic [ref=f1e339]: Anniversary
                  - generic [ref=f1e342]:
                    - textbox "DD-MM-YYYY" [ref=f1e343]: 14-09-2026
                    - generic [ref=f1e344]: 
                - generic [ref=f1e347]:
                  - generic [ref=f1e348]: Marital Status
                  - generic [ref=f1e353]:
                    - generic [ref=f1e354]:
                      - generic [ref=f1e355]:
                        - generic [ref=f1e356]: Please Select
                        - combobox [ref=f1e358]
                      - generic [ref=f1e359] [cursor=pointer]
                    - status [ref=f1e360]
                - generic [ref=f1e362]:
                  - generic [ref=f1e363]: Occupation
                  - generic [ref=f1e368]:
                    - generic [ref=f1e369]:
                      - generic [ref=f1e370]:
                        - generic [ref=f1e371]: Please Select
                        - combobox [ref=f1e373]
                      - generic [ref=f1e374] [cursor=pointer]
                    - status [ref=f1e375]
                - generic [ref=f1e377]:
                  - generic [ref=f1e378]: Classification
                  - generic [ref=f1e383]:
                    - generic [ref=f1e384]:
                      - generic [ref=f1e385]:
                        - generic [ref=f1e386]: Please Select
                        - combobox [ref=f1e388]
                      - generic [ref=f1e389] [cursor=pointer]
                    - status [ref=f1e390]
                - generic [ref=f1e392]:
                  - generic [ref=f1e393]: Alternate Mobile
                  - generic [ref=f1e394]:
                    - generic [ref=f1e400]:
                      - generic [ref=f1e401]:
                        - generic [ref=f1e402]:
                          - generic [ref=f1e403]: "+91"
                          - combobox [ref=f1e408]
                        - generic [ref=f1e409] [cursor=pointer]
                      - status [ref=f1e410]
                    - textbox [ref=f1e412]
                - generic [ref=f1e414]:
                  - generic [ref=f1e415]: Email
                  - textbox [ref=f1e416]: qa1789361379455@example.com
          - generic [ref=f1e417]:
            - generic [ref=f1e418]:
              - generic [ref=f1e419]: 
              - heading "Acquisition" [level=5] [ref=f1e421]
              - separator [ref=f1e422]
            - generic [ref=f1e426]:
              - generic [ref=f1e427]: Source
              - generic [ref=f1e432]:
                - generic [ref=f1e433]:
                  - generic [ref=f1e434]:
                    - generic [ref=f1e435]: Walk In
                    - combobox [ref=f1e439]
                  - generic [ref=f1e440] [cursor=pointer]
                - status [ref=f1e441]
          - generic [ref=f1e442]:
            - generic [ref=f1e443]:
              - generic [ref=f1e444]: 
              - heading "KYC Documents" [level=5] [ref=f1e446]
              - separator [ref=f1e447]
            - generic [ref=f1e450]:
              - generic [ref=f1e452]:
                - generic [ref=f1e453]:
                  - generic [ref=f1e454]: "Document Type:"
                  - generic [ref=f1e459]:
                    - generic [ref=f1e460]:
                      - generic [ref=f1e461]:
                        - generic [ref=f1e462]: Please Select
                        - combobox [expanded] [active] [ref=f1e464]
                      - generic [ref=f1e465] [cursor=pointer]
                    - status [ref=f1e466]
                - generic [ref=f1e467]:
                  - generic [ref=f1e468]: "Document No:"
                  - textbox [ref=f1e469]
                - generic [ref=f1e471]:
                  - generic [ref=f1e472]: "Upload File:"
                  - generic [ref=f1e474]:
                    - button "Choose File"
                    - heading "Drag and Drop files here to Upload" [level=5] [ref=f1e476]
                    - button "Browse" [ref=f1e478] [cursor=pointer]
                - button "Add Document" [ref=f1e480] [cursor=pointer]
              - table [ref=f1e483]:
                - rowgroup [ref=f1e484]:
                  - row [ref=f1e485]:
                    - columnheader "Sl No" [ref=f1e486]
                    - columnheader "Document Type" [ref=f1e487]
                    - columnheader "Document No" [ref=f1e488]
                    - columnheader "File Name" [ref=f1e489]
                    - columnheader "Actions" [ref=f1e490]
                - rowgroup [ref=f1e491]:
                  - row [ref=f1e492]:
                    - cell "No documents added" [ref=f1e493]
        - generic [ref=f1e494]:
          - generic [ref=f1e495]:
            - generic [ref=f1e496]:
              - generic [ref=f1e497]: 
              - heading "Address Information" [level=5] [ref=f1e499]
              - separator [ref=f1e500]
            - generic [ref=f1e502]:
              - heading "Communication Address" [level=5] [ref=f1e503]
              - generic [ref=f1e504]:
                - generic [ref=f1e506]:
                  - generic [ref=f1e507]: Address
                  - textbox [ref=f1e508]
                - generic [ref=f1e510]:
                  - generic [ref=f1e511]: Zip Code
                  - generic [ref=f1e516]:
                    - generic [ref=f1e517]:
                      - generic [ref=f1e518]:
                        - generic [ref=f1e519]: Please Select
                        - combobox [ref=f1e521]
                      - generic [ref=f1e522] [cursor=pointer]
                    - status [ref=f1e523]
                - generic [ref=f1e525]:
                  - generic [ref=f1e526]: Area
                  - generic [ref=f1e531]:
                    - generic [ref=f1e532]:
                      - generic [ref=f1e533]:
                        - generic [ref=f1e534]: Please Select
                        - combobox [ref=f1e536]
                      - generic [ref=f1e537] [cursor=pointer]
                    - status [ref=f1e538]
                - generic [ref=f1e540]:
                  - generic [ref=f1e541]: City
                  - generic [ref=f1e546]:
                    - generic [ref=f1e547]:
                      - generic [ref=f1e548]:
                        - generic [ref=f1e549]: Please Select
                        - combobox [ref=f1e551]
                      - generic [ref=f1e552] [cursor=pointer]
                    - status [ref=f1e553]
                - generic [ref=f1e555]:
                  - generic [ref=f1e556]: District
                  - generic [ref=f1e561]:
                    - generic [ref=f1e562]:
                      - generic [ref=f1e563]:
                        - generic [ref=f1e564]: Please Select
                        - combobox [ref=f1e566]
                      - generic [ref=f1e567] [cursor=pointer]
                    - status [ref=f1e568]
                - generic [ref=f1e570]:
                  - generic [ref=f1e571]: State
                  - generic [ref=f1e576]:
                    - generic [ref=f1e577]:
                      - generic [ref=f1e578]:
                        - generic [ref=f1e579]: Please Select
                        - combobox [ref=f1e581]
                      - generic [ref=f1e582] [cursor=pointer]
                    - status [ref=f1e583]
                - generic [ref=f1e585]:
                  - generic [ref=f1e586]: Country
                  - generic [ref=f1e591]:
                    - generic [ref=f1e592]:
                      - generic [ref=f1e593]:
                        - generic [ref=f1e594]: Please Select
                        - combobox [ref=f1e596]
                      - generic [ref=f1e597] [cursor=pointer]
                    - status [ref=f1e598]
              - generic [ref=f1e600]:
                - checkbox "Permanent Address same as Communication Address" [checked] [ref=f1e601]
                - generic [ref=f1e602]: Permanent Address same as Communication Address
          - generic [ref=f1e603]:
            - generic [ref=f1e604]:
              - generic [ref=f1e605]: 
              - heading "Communication Preferences" [level=5] [ref=f1e607]
              - separator [ref=f1e608]
            - generic [ref=f1e610]:
              - generic [ref=f1e612]:
                - generic [ref=f1e613]: WhatsApp Number
                - generic [ref=f1e614]:
                  - generic [ref=f1e620]:
                    - generic [ref=f1e621]:
                      - generic [ref=f1e622]:
                        - generic [ref=f1e623]: "+91"
                        - combobox [ref=f1e628]
                      - generic [ref=f1e629] [cursor=pointer]
                    - status [ref=f1e630]
                  - textbox [ref=f1e632]: "9361379454"
              - generic [ref=f1e634]:
                - generic [ref=f1e635]: Preferred Language
                - generic [ref=f1e640]:
                  - generic [ref=f1e641]:
                    - generic [ref=f1e642]:
                      - generic [ref=f1e643]: Please Select
                      - combobox [ref=f1e645]
                    - generic [ref=f1e646] [cursor=pointer]
                  - status [ref=f1e647]
              - generic [ref=f1e649]:
                - generic [ref=f1e650]: Annual Income
                - generic [ref=f1e655]:
                  - generic [ref=f1e656]:
                    - generic [ref=f1e657]:
                      - generic [ref=f1e658]: Please Select
                      - combobox [ref=f1e660]
                    - generic [ref=f1e661] [cursor=pointer]
                  - status [ref=f1e662]
              - generic [ref=f1e665]:
                - generic [ref=f1e666]:
                  - checkbox "SMS" [checked] [ref=f1e667]
                  - generic [ref=f1e668]: SMS
                - generic [ref=f1e669]:
                  - checkbox "WhatsApp" [checked] [ref=f1e670]
                  - generic [ref=f1e671]: WhatsApp
                - generic [ref=f1e672]:
                  - checkbox "Email" [ref=f1e673]
                  - generic [ref=f1e674]: Email
                - generic [ref=f1e675]:
                  - checkbox "Promo" [ref=f1e676]
                  - generic [ref=f1e677]: Promo
        - generic [ref=f1e678]:
          - generic [ref=f1e679]:
            - generic [ref=f1e680]:
              - generic [ref=f1e681]: 
              - heading "Nominee Details" [level=5] [ref=f1e683]
              - separator [ref=f1e684]
            - generic [ref=f1e686]:
              - generic [ref=f1e688]:
                - generic [ref=f1e689]: Nominee Full Name
                - textbox [ref=f1e690]
              - generic [ref=f1e692]:
                - generic [ref=f1e693]: Nominee DOB
                - generic [ref=f1e696]:
                  - textbox "DD-MM-YYYY" [ref=f1e697]
                  - generic [ref=f1e698]: 
              - generic [ref=f1e701]:
                - generic [ref=f1e702]: Relationship
                - generic [ref=f1e707]:
                  - generic [ref=f1e708]:
                    - generic [ref=f1e709]:
                      - generic [ref=f1e710]: Please Select
                      - combobox [ref=f1e712]
                    - generic [ref=f1e713] [cursor=pointer]
                  - status [ref=f1e714]
              - generic [ref=f1e716]:
                - generic [ref=f1e717]: Nominee Mobile
                - generic [ref=f1e718]:
                  - generic [ref=f1e724]:
                    - generic [ref=f1e725]:
                      - generic [ref=f1e726]:
                        - generic [ref=f1e727]: "+91"
                        - combobox [ref=f1e732]
                      - generic [ref=f1e733] [cursor=pointer]
                    - status [ref=f1e734]
                  - textbox [ref=f1e736]
              - generic [ref=f1e738]:
                - generic [ref=f1e739]: Share of Benefit (%)
                - spinbutton [ref=f1e740]: "100"
              - generic [ref=f1e742]:
                - generic [ref=f1e743]: Aadhaar
                - textbox [ref=f1e744]
          - generic [ref=f1e745]:
            - generic [ref=f1e746]:
              - generic [ref=f1e747]: 
              - heading "Bank Account" [level=5] [ref=f1e749]
              - separator [ref=f1e750]
            - generic [ref=f1e752]:
              - generic [ref=f1e754]:
                - generic [ref=f1e755]: Account Holder
                - textbox [ref=f1e756]
              - generic [ref=f1e758]:
                - generic [ref=f1e759]: Bank
                - generic [ref=f1e764]:
                  - generic [ref=f1e765]:
                    - generic [ref=f1e766]:
                      - generic [ref=f1e767]: Please Select
                      - combobox [ref=f1e769]
                    - generic [ref=f1e770] [cursor=pointer]
                  - status [ref=f1e771]
              - generic [ref=f1e773]:
                - generic [ref=f1e774]: Account Number
                - textbox [ref=f1e775]
              - generic [ref=f1e777]:
                - generic [ref=f1e778]: IFSC Code
                - textbox [ref=f1e779]
              - generic [ref=f1e781]:
                - generic [ref=f1e782]: Account Type
                - generic [ref=f1e787]:
                  - generic [ref=f1e788]:
                    - generic [ref=f1e789]:
                      - generic [ref=f1e790]: Please Select
                      - combobox [ref=f1e792]
                    - generic [ref=f1e793] [cursor=pointer]
                  - status [ref=f1e794]
          - generic [ref=f1e795]:
            - generic [ref=f1e796]:
              - generic [ref=f1e797]: 
              - heading "UPI Details" [level=5] [ref=f1e799]
              - separator [ref=f1e800]
            - button " Add Another UPI" [ref=f1e804] [cursor=pointer]:
              - generic [ref=f1e805]: 
              - text: Add Another UPI
        - generic [ref=f1e808]:
          - generic [ref=f1e809]: 
          - heading "Review & Confirm" [level=5] [ref=f1e811]
          - separator [ref=f1e812]
      - generic [ref=f1e814]:
        - button " Clear" [ref=f1e815] [cursor=pointer]:
          - generic [ref=f1e816]: 
          - text: Clear
        - button "Next " [ref=f1e817] [cursor=pointer]:
          - text: Next
          - generic [ref=f1e818]: 
    - contentinfo [ref=f1e819]
  - listbox "Options List" [ref=f1e822]:
    - generic [ref=f1e823]:
      - option "Adhaar Card" [ref=f1e824] [cursor=pointer]
      - option "Driving License" [ref=f1e828] [cursor=pointer]
      - option "PAN Card" [ref=f1e832] [cursor=pointer]
      - option "Passport" [ref=f1e836] [cursor=pointer]
      - option "Voter ID" [ref=f1e840] [cursor=pointer]
```

# Test source

```ts
  34  |   input(controlname) {
  35  |     return this.page.locator(`[formcontrolname="${controlname}"]`).first();
  36  |   }
  37  | 
  38  |   async fillDate(id, value) {
  39  |     const el = this.page.locator(`#${id}`);
  40  |     await el.fill(value);
  41  |     await el.blur();
  42  |     await this.page.keyboard.press('Escape'); // close the date-picker popup
  43  |   }
  44  | 
  45  |   async fillCustomer(d) {
  46  |     // kind selector (Individual is the default; click to be sure). Customer
  47  |     // Type is NOT touched in the recording - it defaults, so leave it unless
  48  |     // a value is explicitly provided.
  49  |     if (d.kind) {
  50  |       await this.page.getByRole('button', { name: d.kind, exact: true }).click().catch(() => {});
  51  |       await this.page.waitForTimeout(1_000);
  52  |     }
  53  |     if (d.customerType) await this.pick('masterDataValueID_CustomerType', d.customerType, { exact: true }).catch(() => {});
  54  | 
  55  |     // Title carries the dot ("Mr."); pick then identity fields by controlname
  56  |     if (d.title) await this.pick('masterDataValueID_NameTitle', d.title).catch(() => {});
  57  |     if (d.contactNumber) await this.input('contactNumber').fill(String(d.contactNumber));
  58  |     await this.input('name').fill(d.name);
  59  |     if (d.gender) await this.pick('masterDataValueID_Gender', d.gender, { exact: true }).catch(() => {});
  60  |     if (d.maritalStatus) await this.pick('masterDataValueID_MaritalStatus', d.maritalStatus).catch(() => {});
  61  |     if (d.occupation) await this.pick('masterDataValueID_Profession', d.occupation).catch(() => {});
  62  |     if (d.classification) await this.pick('customerClassificationID', d.classification).catch(() => {});
  63  |     if (d.source) await this.pick('masterDataValueID_CustomerSource', d.source).catch(() => {});
  64  |     if (d.email) await this.input('email').fill(d.email).catch(() => {});
  65  |     if (d.dob) await this.fillDate('dob', d.dob);
  66  |     if (d.anniversary) await this.fillDate('anniversary', d.anniversary);
  67  | 
  68  |     // Document: Type (Aadhar Card) + one demo image via Browse -> file input
  69  |     // -> Add Document (adds the row to the document grid). The type select
  70  |     // clears when the doc is staged, so RE-SELECT it (documentTypeID is a
  71  |     // mandatory field on the Identity step).
  72  |     if (d.document) {
  73  |       await this.pickDocType(d.document.type);
  74  |       // no Browse click - the native picker would hang; set the hidden file
  75  |       // input directly, then Add Document
  76  |       await this.page.locator('input[type="file"]').last().setInputFiles(d.document.file);
  77  |       await this.page.waitForTimeout(1_000);
  78  |       await this.page.getByRole('button', { name: 'Add Document' }).click();
  79  |       await this.page.waitForTimeout(1_500);
  80  |       console.log(`customer: document ${d.document.type} attached`);
  81  |       // re-select the type if Add Document cleared it (mandatory validation)
  82  |       const dtVal = await this.selectValue('documentTypeID').catch(() => '');
  83  |       if (!dtVal) await this.pickDocType(d.document.type).catch(() => {});
  84  |     }
  85  | 
  86  |     // Address block (Communication Address) - ZIP CODE FIRST (QA lead): the
  87  |     // zipCode select CASCADES, auto-filling area/city/district/state/country.
  88  |     // Fill any field the cascade leaves empty as a fallback.
  89  |     const addr = d.address || {};
  90  |     // "Door No / Street / Full Address" - a plain text input/textarea with
  91  |     // no controlname (the required "?" input in the diagnostics)
  92  |     const line = addr.line || 'Door 12, MG Road';
  93  |     const addrLine = this.page
  94  |       .locator('textarea, input[type="text"]')
  95  |       .filter({ hasNot: this.page.locator('[formcontrolname]') })
  96  |       .locator('visible=true');
  97  |     await this.fillByLabelLoose(['Door No', 'Full Address', 'Address', 'Street'], line)
  98  |       .catch(async () => { await addrLine.first().fill(line).catch(() => {}); });
  99  |     await this.pickAddress('zipCode', addr.zipCode, { firstIfMissing: true });
  100 |     await this.waitForIdle();
  101 |     await this.page.waitForTimeout(2_000); // let the cascade populate
  102 |     for (const [cn, val] of [
  103 |       ['country', addr.country], ['state', addr.state], ['district', addr.district],
  104 |       ['city', addr.city], ['area', addr.area],
  105 |     ]) {
  106 |       if (!(await this.selectValue(cn).catch(() => ''))) {
  107 |         await this.pickAddress(cn, val, { firstIfMissing: true });
  108 |       }
  109 |     }
  110 |     await this.waitForIdle();
  111 |   }
  112 | 
  113 |   /** Fill an input/textarea by any of several label substrings. */
  114 |   async fillByLabelLoose(labels, value) {
  115 |     for (const lbl of labels) {
  116 |       const field = this.page
  117 |         .locator('div.grid, div.form-group, .mb-3, .form-group')
  118 |         .filter({ has: this.page.locator('label', { hasText: lbl }) })
  119 |         .last()
  120 |         .locator('input:not([type=checkbox]):not([disabled]), textarea')
  121 |         .first();
  122 |       if (await field.isVisible({ timeout: 1_500 }).catch(() => false)) {
  123 |         await field.fill(String(value));
  124 |         await field.blur();
  125 |         return;
  126 |       }
  127 |     }
  128 |     throw new Error(`no address-line field matched ${JSON.stringify(labels)}`);
  129 |   }
  130 | 
  131 |   async pickDocType(type) {
  132 |     await this.pick('documentTypeID', type)
  133 |       .catch(() => this.page.locator('#kyc-doctype-select .ng-select-container').click()
> 134 |         .then(() => this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasText: type }).first().click()));
      |                                                                                                          ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  135 |   }
  136 | 
  137 |   /** Pick an address select by value; fall back to its first real option. */
  138 |   async pickAddress(controlname, value, { firstIfMissing = false } = {}) {
  139 |     if (value) {
  140 |       const ok = await this.pick(controlname, value, { exact: true, search: true })
  141 |         .then(() => true).catch(() => false);
  142 |       if (ok) return;
  143 |     }
  144 |     if (value || firstIfMissing) await this.pickFirstOption(controlname).catch(() => {});
  145 |   }
  146 | 
  147 |   async pickFirstOption(controlname) {
  148 |     for (let attempt = 1; attempt <= 4; attempt++) {
  149 |       if (await this.page.locator('.ng-dropdown-panel').first().isVisible().catch(() => false)) {
  150 |         await this.page.keyboard.press('Escape');
  151 |         await this.page.waitForTimeout(300);
  152 |       }
  153 |       await this.select(controlname).locator('.ng-select-container').click();
  154 |       const opt = this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasNotText: /No items found/i }).first();
  155 |       const ok = await opt.waitFor({ state: 'visible', timeout: attempt * 4_000 }).then(() => true).catch(() => false);
  156 |       if (ok) { await opt.click(); await this.page.waitForTimeout(800); return; }
  157 |       await this.page.keyboard.press('Escape');
  158 |     }
  159 |     throw new Error(`address select "${controlname}" offered no option`);
  160 |   }
  161 | 
  162 |   /**
  163 |    * Walk Next -> ... -> Submit, capturing the save response. Throws with the
  164 |    * ng-invalid diagnostics if a step is silently blocked (checklist rule 6).
  165 |    */
  166 |   async submitCustomer() {
  167 |     // 4-step wizard (Identity -> Contact -> Financial -> Review); the final
  168 |     // action on the Review step is "Register" (not Submit). Walk Next until
  169 |     // the Register button appears.
  170 |     // the Review-step button is "Register" (green ✓ icon glyph in its
  171 |     // accessible name breaks an anchored regex) - match by text, not role name
  172 |     const commitBtn = () => this.page.locator('button')
  173 |       .filter({ hasText: /Register|Submit/ })
  174 |       .filter({ hasNotText: /Add|Document|UPI/ })
  175 |       .locator('visible=true').last();
  176 |     for (let step = 0; step < 6; step++) {
  177 |       if (await commitBtn().isVisible({ timeout: 2_000 }).catch(() => false)) break;
  178 |       const next = this.page.getByRole('button', { name: 'Next' }).locator('visible=true').last();
  179 |       if (!(await next.isVisible({ timeout: 2_000 }).catch(() => false))) break;
  180 |       await next.click();
  181 |       await this.waitForIdle();
  182 |       await this.page.waitForTimeout(2_000);
  183 |     }
  184 |     if (!(await commitBtn().isVisible({ timeout: 3_000 }).catch(() => false))) {
  185 |       throw new Error(`Customer wizard never reached Register; ${JSON.stringify(await this.invalidDiag())}`);
  186 |     }
  187 | 
  188 |     const resp = this.page.waitForResponse(
  189 |       (r) => ['POST', 'PUT'].includes(r.request().method()) && /customer|create|save|register/i.test(r.url()) &&
  190 |         !/GetAll|Pagination|KeepAlive|GetMasterData|GetLocation|Translation|Search/i.test(r.url()),
  191 |       { timeout: 30_000 },
  192 |     ).catch(() => null);
  193 |     await commitBtn().click();
  194 |     const r = await resp;
  195 |     if (!r) {
  196 |       throw new Error(`Customer Register fired no save request - form silently blocked; ${JSON.stringify(await this.invalidDiag())}`);
  197 |     }
  198 |     const body = await r.json().catch(() => null);
  199 |     console.log('customer save:', r.status(), r.url().split('/').pop(), JSON.stringify(body).slice(0, 200));
  200 |     if (r.status() >= 400 || (body && body.errorCode)) {
  201 |       throw new Error(`Customer save rejected (HTTP ${r.status()}): ${body ? body.error || '' : ''}`);
  202 |     }
  203 |     await this.previewAndClose().catch(() => {});
  204 |     return body;
  205 |   }
  206 | 
  207 |   /** Active wizard step label (Identity / Contact / Financial / Review). */
  208 |   async currentStep() {
  209 |     return this.page.evaluate(() => {
  210 |       const vis = (el) => !!(el && el.offsetParent);
  211 |       const active = [...document.querySelectorAll('.active, [class*=active]')]
  212 |         .filter((e) => vis(e) && /^(Identity|Contact|Financial|Review)$/i.test(e.textContent.trim()));
  213 |       if (active.length) return active[0].textContent.trim();
  214 |       // fallback: the section heading currently shown
  215 |       const h = [...document.querySelectorAll('h4,h5')].filter(vis)[0];
  216 |       return h ? h.textContent.trim() : '';
  217 |     }).catch(() => '');
  218 |   }
  219 | 
  220 |   async invalidDiag() {
  221 |     return this.page.evaluate(() => {
  222 |       const vis = (el) => !!(el && el.offsetParent);
  223 |       const invalidNg = [...document.querySelectorAll('sioniq-ng-select')]
  224 |         .filter((n) => n.querySelector('ng-select')?.classList.contains('ng-invalid') && vis(n))
  225 |         .map((n) => n.getAttribute('controlname'));
  226 |       const invalidInputs = [...document.querySelectorAll('input.ng-invalid, textarea.ng-invalid')]
  227 |         .filter(vis).map((n) => n.getAttribute('formcontrolname') || n.id || '?');
  228 |       const toast = (document.querySelector('.toast-message, .toast, [role=alert]') || {}).textContent || '';
  229 |       return { invalidNg, invalidInputs, toast: toast.trim() };
  230 |     });
  231 |   }
  232 | 
  233 |   async previewAndClose() {
  234 |     this.printPreviewError = null;
```