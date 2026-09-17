# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-qap\stone-ho-branch-tag-return-workflow.noauth.spec.js >> Stone HO-Branch Tag RETURN (Cochin returns the Stone tag to Kakkanad) [qap] — seed: Kakkanad -> Cochin (pending at Cochin) >> TC-SHBRT-SEED-01 stone inward at Kakkanad HO
- Location: tests\e2e-qap\_tag-transfer-suite.js:194:5

# Error details

```
Error: Stone save rejected (HTTP 501 CreateStockInwardStone): {"errorCode":1002,"error":"FTP settings not found for Functionality Type.","header":"Not found"}
```

# Page snapshot

```yaml
- generic [ref=f1e2]:
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
          - link "󰅂 Procurement" [expanded] [ref=f1e72] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e74]: 󰅂
            - generic [ref=f1e75]: Procurement
          - list [ref=f1e77]:
            - listitem [ref=f1e78]:
              - link "󰅂 Setup" [ref=f1e79] [cursor=pointer]:
                - /url: "javascript: void(0)"
                - generic [ref=f1e80]: 󰅂
                - generic [ref=f1e81]: Setup
            - listitem [ref=f1e82]:
              - link "󰅂 Operations" [expanded] [ref=f1e83] [cursor=pointer]:
                - /url: "javascript: void(0)"
                - generic [ref=f1e84]: 󰅂
                - generic [ref=f1e85]: Operations
              - list [ref=f1e87]:
                - listitem [ref=f1e88]:
                  - link "Alloy Inward" [ref=f1e89] [cursor=pointer]:
                    - /url: /prc/view-alloy-inward
                - listitem [ref=f1e91]:
                  - link "Stone Assorting" [ref=f1e92] [cursor=pointer]:
                    - /url: /prc/app-stone-assorting-list
                - listitem [ref=f1e94]:
                  - link "Stone Transaction" [ref=f1e95] [cursor=pointer]:
                    - /url: /prc/app-stone-transaction
                - listitem [ref=f1e97]:
                  - link "Receipt" [ref=f1e98] [cursor=pointer]:
                    - /url: /prc/app-repair-setup
                - listitem [ref=f1e100]:
                  - link "Internal Transfer" [ref=f1e101] [cursor=pointer]:
                    - /url: /prc/internal-stock-list
                - listitem [ref=f1e103]:
                  - link "Issue" [ref=f1e104] [cursor=pointer]:
                    - /url: /prc/view-samplejobwork-issue
                - listitem [ref=f1e106]:
                  - link "Purchase Return" [ref=f1e107] [cursor=pointer]:
                    - /url: /prc/view-purchase-return
                - listitem [ref=f1e109]:
                  - link "Goods Receipt" [ref=f1e110] [cursor=pointer]:
                    - /url: /prc/view-goods-receipt
                - listitem [ref=f1e112]:
                  - link "Logistic In / Out" [ref=f1e113] [cursor=pointer]:
                    - /url: /prc/view-logistics
                - listitem [ref=f1e115]:
                  - link "Bullion Booking" [ref=f1e116] [cursor=pointer]:
                    - /url: /prc/app-bullion-list
                - listitem [ref=f1e118]:
                  - link "Bullion Issue" [ref=f1e119] [cursor=pointer]:
                    - /url: /prc/view-bullion-issue
                - listitem [ref=f1e121]:
                  - link "Stock Inward" [ref=f1e122] [cursor=pointer]:
                    - /url: /prc/stock-inward-setup
        - listitem [ref=f1e124]:
          - link "󰅂 Inventory" [ref=f1e125] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e127]: 󰅂
            - generic [ref=f1e128]: Inventory
          - text: 󰅂 󰅂 󰅂
        - listitem [ref=f1e129]:
          - link " 󰅂 Production" [ref=f1e130] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e131]: 
            - generic [ref=f1e132]: 󰅂
            - generic [ref=f1e133]: Production
          - text: 󰅂 󰅂 󰅂
        - listitem [ref=f1e134]:
          - link " 󰅂 Sales & Distribution" [ref=f1e135] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e136]: 
            - generic [ref=f1e137]: 󰅂
            - generic [ref=f1e138]: Sales & Distribution
          - text: 󰅂 󰅂 󰅂
        - listitem [ref=f1e139]:
          - link "󰅂 Retail Operations" [ref=f1e140] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e142]: 󰅂
            - generic [ref=f1e143]: Retail Operations
          - text: 󰅂 󰅂
        - listitem [ref=f1e144]:
          - link " 󰅂 Finance" [ref=f1e145] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e146]: 
            - generic [ref=f1e147]: 󰅂
            - generic [ref=f1e148]: Finance
          - text: 󰅂
        - listitem [ref=f1e149]:
          - link "󰅂 Layaway / EMA Plans" [ref=f1e150] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e152]: 󰅂
            - generic [ref=f1e153]: Layaway / EMA Plans
          - text: 󰅂 󰅂
        - listitem [ref=f1e154]:
          - link "󰅂 HRMS" [ref=f1e155] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e157]: 󰅂
            - generic [ref=f1e158]: HRMS
          - text: 󰅂
        - listitem [ref=f1e159]:
          - link "󰅂 CRM" [ref=f1e160] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e162]: 󰅂
            - generic [ref=f1e163]: CRM
          - text: 󰅂
        - listitem [ref=f1e164]:
          - link "󰅂 Reports" [ref=f1e165] [cursor=pointer]:
            - /url: "javascript: void(0)"
            - generic [ref=f1e166]: 󰅂
            - generic [ref=f1e167]: Reports
          - text: 󰅂
      - generic [ref=f1e168]:
        - generic [ref=f1e169]: G&
        - generic [ref=f1e170]:
          - generic [ref=f1e171]: Gold & Diamonds
          - generic [ref=f1e172]: 2026 © SIONIQ
    - generic [ref=f1e176]:
      - generic [ref=f1e177]:
        - list [ref=f1e179]:
          - listitem [ref=f1e180]:
            - generic [ref=f1e181] [cursor=pointer]: Setup
          - listitem [ref=f1e184]:
            - generic [ref=f1e185] [cursor=pointer]: Operations
        - generic [ref=f1e189]:
          - list [ref=f1e192]:
            - listitem [ref=f1e193]: Procurement
            - listitem [ref=f1e194]:
              - text: 󰅂
              - generic [ref=f1e195]: Operations
            - listitem [ref=f1e196]: 󰅂 Stock Inward
          - generic: 󰅂
      - generic [ref=f1e198]:
        - generic [ref=f1e199]:
          - button "" [disabled]
          - button "" [disabled]
          - button "" [ref=f1e201] [cursor=pointer]
        - list [ref=f1e203]:
          - listitem [ref=f1e204]:
            - generic [ref=f1e205] [cursor=pointer]: Alloy Inward
          - listitem [ref=f1e207]:
            - generic [ref=f1e208] [cursor=pointer]: Stone Assorting
          - listitem [ref=f1e210]:
            - generic [ref=f1e211] [cursor=pointer]: Stone Transaction
          - listitem [ref=f1e213]:
            - generic [ref=f1e214] [cursor=pointer]: Receipt
          - listitem [ref=f1e216]:
            - generic [ref=f1e217] [cursor=pointer]: Internal Transfer
          - listitem [ref=f1e219]:
            - generic [ref=f1e220] [cursor=pointer]: Issue
          - listitem [ref=f1e222]:
            - generic [ref=f1e223] [cursor=pointer]: Purchase Return
          - listitem [ref=f1e225]:
            - generic [ref=f1e226] [cursor=pointer]: Goods Receipt
          - listitem [ref=f1e228]:
            - generic [ref=f1e229] [cursor=pointer]: Logistic In / Out
          - listitem [ref=f1e231]:
            - generic [ref=f1e232] [cursor=pointer]: Bullion Booking
          - listitem [ref=f1e234]:
            - generic [ref=f1e235] [cursor=pointer]: Bullion Issue
          - listitem [ref=f1e237]:
            - generic [ref=f1e238] [cursor=pointer]: Stock Inward
    - generic [ref=f1e242]:
      - tablist [ref=f1e243]:
        - tab "Metal" [ref=f1e244] [cursor=pointer]
        - tab "Brand" [ref=f1e245] [cursor=pointer]
        - tab "Stone" [selected] [ref=f1e246] [cursor=pointer]
      - tabpanel "Stone" [ref=f1e248]:
        - generic [ref=f1e254]:
          - generic [ref=f1e255]:
            - generic [ref=f1e257]:
              - generic [ref=f1e258]:
                - generic [ref=f1e259] [cursor=pointer]: 
                - generic [ref=f1e261]:
                  - heading "Stone Inward" [level=4] [ref=f1e262]
                  - paragraph [ref=f1e263]: Add new record
              - generic [ref=f1e265]:
                - generic [ref=f1e268]: Basic Details
                - generic [ref=f1e271]: Build Items & Submit
            - generic [ref=f1e275]:
              - generic [ref=f1e276]:
                - generic [ref=f1e277]:
                  - generic [ref=f1e278]: 
                  - heading "Inward Details" [level=5] [ref=f1e280]
                  - separator [ref=f1e281]
                - generic [ref=f1e282]:
                  - generic [ref=f1e283]:
                    - generic [ref=f1e284]: Reference Type
                    - generic [ref=f1e289]:
                      - generic [ref=f1e290]:
                        - generic [ref=f1e291]:
                          - generic [ref=f1e292]: Please Select
                          - combobox [ref=f1e294]
                        - generic [ref=f1e295] [cursor=pointer]
                      - status [ref=f1e296]
                  - generic [ref=f1e297]:
                    - generic [ref=f1e298]: Stone Group
                    - generic [ref=f1e303]:
                      - generic [ref=f1e304]:
                        - generic [ref=f1e305]:
                          - generic [ref=f1e306]: Please Select
                          - combobox [ref=f1e308]
                        - generic [ref=f1e309] [cursor=pointer]
                      - status [ref=f1e310]
                  - generic [ref=f1e311]:
                    - generic [ref=f1e312]: Stone Category
                    - generic [ref=f1e317]:
                      - generic [ref=f1e318]:
                        - generic [ref=f1e319]:
                          - generic [ref=f1e320]: Please Select
                          - combobox [ref=f1e322]
                        - generic [ref=f1e323] [cursor=pointer]
                      - status [ref=f1e324]
                  - generic [ref=f1e325]:
                    - generic [ref=f1e326]: Stone Sub Category
                    - generic [ref=f1e331]:
                      - generic [ref=f1e332]:
                        - generic [ref=f1e333]:
                          - generic [ref=f1e334]: Please Select
                          - combobox [ref=f1e336]
                        - generic [ref=f1e337] [cursor=pointer]
                      - status [ref=f1e338]
                  - generic [ref=f1e339]:
                    - generic [ref=f1e340]: Shape
                    - generic [ref=f1e345]:
                      - generic [ref=f1e346]:
                        - generic [ref=f1e347]:
                          - generic [ref=f1e348]: Please Select
                          - combobox [ref=f1e350]
                        - generic [ref=f1e351] [cursor=pointer]
                      - status [ref=f1e352]
                  - generic [ref=f1e353]:
                    - generic [ref=f1e354]: Stone Article
                    - generic [ref=f1e359]:
                      - generic [ref=f1e360]:
                        - generic [ref=f1e361]:
                          - generic [ref=f1e362]: Please Select
                          - combobox [ref=f1e364]
                        - generic [ref=f1e365] [cursor=pointer]
                      - status [ref=f1e366]
                  - generic [ref=f1e367]:
                    - generic [ref=f1e368]: Weight Entry Mode
                    - generic [ref=f1e373]:
                      - generic [ref=f1e374]:
                        - generic [ref=f1e375]:
                          - generic [ref=f1e376]: Please Select
                          - combobox [ref=f1e378]
                        - generic [ref=f1e379] [cursor=pointer]
                      - status [ref=f1e380]
                  - generic [ref=f1e381]:
                    - generic [ref=f1e382]: UOM
                    - generic [ref=f1e387]:
                      - generic [ref=f1e388]:
                        - generic [ref=f1e389]:
                          - generic [ref=f1e390]: Please Select
                          - combobox [ref=f1e392]
                        - generic [ref=f1e393] [cursor=pointer]
                      - status [ref=f1e394]
              - generic [ref=f1e395]:
                - generic [ref=f1e396]:
                  - generic [ref=f1e397]: 
                  - heading "Weight Details" [level=5] [ref=f1e399]
                  - separator [ref=f1e400]
                - generic [ref=f1e401]:
                  - generic [ref=f1e402]:
                    - generic [ref=f1e403]: Stone No Of Pcs
                    - textbox [ref=f1e404]
                  - generic [ref=f1e405]:
                    - generic [ref=f1e406]: Gross Weight
                    - spinbutton [ref=f1e409]
                  - generic [ref=f1e410]:
                    - generic [ref=f1e411]: Stone Net Weight
                    - spinbutton "0" [disabled] [ref=f1e414]: "0.000"
                  - generic [ref=f1e415]:
                    - generic [ref=f1e416]: Rate UOM
                    - generic [ref=f1e421]:
                      - generic [ref=f1e422]:
                        - generic [ref=f1e423]:
                          - generic [ref=f1e424]: Please Select
                          - combobox [ref=f1e426]
                        - generic [ref=f1e427] [cursor=pointer]
                      - status [ref=f1e428]
                  - generic [ref=f1e429]:
                    - generic [ref=f1e430]: Rate Stone Weight
                    - spinbutton "0" [disabled] [ref=f1e433]: "0.000"
                  - generic [ref=f1e434]:
                    - generic [ref=f1e435]: Rate
                    - spinbutton [disabled] [ref=f1e438]
              - generic [ref=f1e439]:
                - generic [ref=f1e440]:
                  - heading "Pricing" [level=5] [ref=f1e443]
                  - separator [ref=f1e444]
                - generic [ref=f1e445]:
                  - generic [ref=f1e447]:
                    - generic [ref=f1e448]: Stone Amount
                    - spinbutton "0" [disabled] [ref=f1e451]: "0.00"
                  - generic [ref=f1e453]:
                    - generic [ref=f1e454]: Discount Amount
                    - generic [ref=f1e455]:
                      - textbox "%" [ref=f1e456]
                      - spinbutton "0" [ref=f1e459]: "0.00"
                  - generic [ref=f1e461]:
                    - generic [ref=f1e462]:
                      - text: Additional Charges Value
                      - button
                    - spinbutton [disabled] [ref=f1e465]
                  - generic [ref=f1e467]:
                    - text: Taxable Value
                    - spinbutton "0" [disabled] [ref=f1e470]: "0.00"
                  - generic [ref=f1e472]:
                    - generic [ref=f1e473]:
                      - text: Tax Collection
                      - button
                    - spinbutton [disabled] [ref=f1e476]
                  - generic [ref=f1e478]:
                    - text: Payable Value
                    - spinbutton [disabled] [ref=f1e481]
                  - generic [ref=f1e483]:
                    - generic [ref=f1e484]:
                      - text: Tax Deduction
                      - button
                    - spinbutton [disabled] [ref=f1e487]
                  - generic [ref=f1e489]:
                    - text: Net Payable Value
                    - spinbutton [disabled] [ref=f1e492]
                  - generic [ref=f1e494]:
                    - generic [ref=f1e495]: Return Weight
                    - generic [ref=f1e496]:
                      - textbox "%" [ref=f1e497]
                      - textbox [disabled] [ref=f1e498]: "0"
                  - generic [ref=f1e500]:
                    - generic [ref=f1e501]: Return Value
                    - spinbutton "0" [disabled] [ref=f1e504]: "0.00"
              - generic [ref=f1e505]:
                - generic [ref=f1e506]:
                  - generic [ref=f1e507]: Remarks
                  - textbox "Remarks Remarks" [ref=f1e508]
                - generic [ref=f1e509]:
                  - button " Additional Charges" [disabled]:
                    - generic: 
                    - text: Additional Charges
                  - button "Custom Control" [ref=f1e510] [cursor=pointer]
                - button "Add Items" [ref=f1e513] [cursor=pointer]
              - generic [ref=f1e515]:
                - generic [ref=f1e516]:
                  - generic [ref=f1e517]: 
                  - heading "Remarks" [level=5] [ref=f1e519]
                  - separator [ref=f1e520]
                - generic [ref=f1e521]:
                  - generic [ref=f1e522]:
                    - generic [ref=f1e523]: Remarks
                    - textbox [ref=f1e524]
                  - generic [ref=f1e526]:
                    - generic [ref=f1e527] [cursor=pointer]:
                      - generic [ref=f1e528]: Assorted Stock
                      - checkbox "Assorted Stock" [checked] [ref=f1e529]
                    - button " Additional Charges" [disabled]:
                      - generic: 
                      - text: Additional Charges
                    - button " Add Files" [ref=f1e530] [cursor=pointer]:
                      - generic [ref=f1e531]: 
                      - text: Add Files
                    - button "Custom Control" [ref=f1e532] [cursor=pointer]
              - table [ref=f1e539]:
                - rowgroup [ref=f1e540]:
                  - row [ref=f1e541]:
                    - columnheader "Action" [ref=f1e542]
                    - columnheader [ref=f1e543]:
                      - columnheader [ref=f1e544] [cursor=pointer]
                    - columnheader "Stone Article" [ref=f1e553]
                    - columnheader "UOM" [ref=f1e554]
                    - columnheader [ref=f1e555]:
                      - columnheader [ref=f1e556] [cursor=pointer]
                    - columnheader [ref=f1e565]:
                      - columnheader [ref=f1e566] [cursor=pointer]
                    - columnheader [ref=f1e575]:
                      - columnheader [ref=f1e576] [cursor=pointer]
                    - columnheader [ref=f1e585]:
                      - columnheader [ref=f1e586] [cursor=pointer]
                    - columnheader [ref=f1e595]:
                      - columnheader [ref=f1e596] [cursor=pointer]
                    - columnheader [ref=f1e605]:
                      - columnheader [ref=f1e606] [cursor=pointer]
                    - columnheader [ref=f1e615]:
                      - columnheader [ref=f1e616] [cursor=pointer]
                    - columnheader [ref=f1e625]:
                      - columnheader [ref=f1e626] [cursor=pointer]
                    - columnheader [ref=f1e635]:
                      - columnheader [ref=f1e636] [cursor=pointer]
                    - columnheader [ref=f1e645]:
                      - columnheader [ref=f1e646] [cursor=pointer]
                    - columnheader [ref=f1e655]:
                      - columnheader [ref=f1e656] [cursor=pointer]
                    - columnheader [ref=f1e665]:
                      - columnheader [ref=f1e666] [cursor=pointer]
                    - columnheader [ref=f1e675]:
                      - columnheader [ref=f1e676] [cursor=pointer]
                    - columnheader [ref=f1e685]:
                      - columnheader [ref=f1e686] [cursor=pointer]
                    - columnheader [ref=f1e695]:
                      - columnheader [ref=f1e696] [cursor=pointer]
                    - columnheader [ref=f1e705]:
                      - columnheader [ref=f1e706] [cursor=pointer]
                    - columnheader "Stone Group" [ref=f1e715]
                    - columnheader "Stone Category" [ref=f1e716]
                    - columnheader "Stone Sub Category" [ref=f1e717]
                    - columnheader "Goods Receipt" [ref=f1e718]
                    - columnheader "Job Work" [ref=f1e719]
                    - columnheader "Design No" [ref=f1e720]
                    - columnheader "Remarks" [ref=f1e721]
                - rowgroup [ref=f1e722]:
                  - row [ref=f1e723]:
                    - cell [ref=f1e724]:
                      - generic [ref=f1e725]:
                        - button [ref=f1e726] [cursor=pointer]
                        - button [ref=f1e728] [cursor=pointer]
                    - cell "1" [ref=f1e730]
                    - cell "DND-Drop" [ref=f1e731]
                    - cell "Gram" [ref=f1e732]
                    - cell "1" [ref=f1e733]
                    - cell "25.000" [ref=f1e734]
                    - cell "0.000" [ref=f1e735]
                    - cell "25.000" [ref=f1e736]
                    - cell "1500.000" [ref=f1e737]
                    - cell "37500.000" [ref=f1e738]
                    - cell "0.000" [ref=f1e739]
                    - cell "0.000" [ref=f1e740]
                    - cell "0.00" [ref=f1e741]
                    - cell "37500.00" [ref=f1e742]
                    - cell "1125.00" [ref=f1e743]
                    - cell "38625.00" [ref=f1e744]
                    - cell "0.00" [ref=f1e745]
                    - cell "38625.00" [ref=f1e746]
                    - cell "0.000" [ref=f1e747]
                    - cell "0.00" [ref=f1e748]
                    - cell "Diamond" [ref=f1e749]
                    - cell "Natural" [ref=f1e750]
                    - cell "Diamond" [ref=f1e751]
                    - cell [ref=f1e752]
                    - cell [ref=f1e753]
                    - cell [ref=f1e754]
                    - cell [ref=f1e755]
          - generic [ref=f1e757]:
            - generic [ref=f1e758]:
              - heading "Stone Inward Summary" [level=4] [ref=f1e759]
              - generic [ref=f1e760]: Stone
            - generic [ref=f1e765]:
              - generic [ref=f1e766]: Vendor Name :Celestia Jewels P
              - generic [ref=f1e768]: Grams
              - generic [ref=f1e769]:
                - heading "Stone Gross Weight :" [level=6] [ref=f1e770]
                - heading "25.000" [level=3] [ref=f1e771]
              - generic [ref=f1e772]:
                - heading "Stone Tare Weight :" [level=6] [ref=f1e773]
                - heading "0.000" [level=3] [ref=f1e774]
              - generic [ref=f1e775]:
                - heading [level=6] [ref=f1e776]:
                  - text: "Stone Net Weight :"
                  - button [ref=f1e777] [cursor=pointer]
                - heading "25.000" [level=3] [ref=f1e779]
              - generic [ref=f1e780]:
                - generic [ref=f1e781]:
                  - heading "Amount" [level=5] [ref=f1e782]
                  - generic [ref=f1e783]: Indian Rupee
                - generic [ref=f1e784]:
                  - generic [ref=f1e785]:
                    - generic [ref=f1e786]: •
                    - text: Stone Amount
                  - heading "₹ 37500.00" [level=3] [ref=f1e787]
                - generic [ref=f1e788]:
                  - generic [ref=f1e789]:
                    - generic [ref=f1e790]: •
                    - text: Additional Charges Value
                    - button [ref=f1e791] [cursor=pointer]
                  - heading "₹ 0.00" [level=3] [ref=f1e793]
                - generic [ref=f1e794]:
                  - generic [ref=f1e795]:
                    - generic [ref=f1e796]: •
                    - text: Taxable Value
                  - heading "₹ 37500.00" [level=3] [ref=f1e797]
                - generic [ref=f1e798]:
                  - generic [ref=f1e799]:
                    - generic [ref=f1e800]: •
                    - text: Tax Collection
                    - generic [ref=f1e801]: TCS
                    - button [ref=f1e802] [cursor=pointer]
                  - heading "+ ₹ 1125.00" [level=3] [ref=f1e804]
                - generic [ref=f1e805]:
                  - generic [ref=f1e806]:
                    - generic [ref=f1e807]: •
                    - text: Payable Value
                  - heading "₹ 38625.00" [level=3] [ref=f1e808]
                - generic [ref=f1e809]:
                  - generic [ref=f1e810]:
                    - generic [ref=f1e811]: •
                    - text: Tax Deduction
                    - generic [ref=f1e812]: TDS
                    - button [ref=f1e813] [cursor=pointer]
                  - heading "- ₹ 0.00" [level=3] [ref=f1e815]
                - generic [ref=f1e816]:
                  - generic [ref=f1e817]:
                    - generic [ref=f1e818]: 
                    - text: Net Payable Value
                  - heading "₹ 38625.00" [level=1] [ref=f1e819]
            - generic [ref=f1e820]:
              - button " Clear" [ref=f1e821] [cursor=pointer]:
                - generic [ref=f1e822]: 
                - text: Clear
              - button " Previous" [ref=f1e823] [cursor=pointer]:
                - generic [ref=f1e824]: 
                - text: Previous
              - button " Submit" [active] [ref=f1e825] [cursor=pointer]:
                - generic [ref=f1e826]: 
                - text: Submit
    - contentinfo [ref=f1e827]
  - alert [ref=f1e829]:
    - generic [ref=f1e830]:
      - generic [ref=f1e836]:
        - generic [ref=f1e837]: Not found
        - generic [ref=f1e838]: FTP settings not found for Functionality Type.
      - button "Close" [ref=f1e840] [cursor=pointer]
```

# Test source

```ts
  187 |         await this.page.waitForTimeout(2_000);
  188 |       }
  189 |       // same stale-panel trap as pick(): scope to this select's own panel
  190 |       const inline = wrapper.locator('.ng-dropdown-panel');
  191 |       await inline.waitFor({ state: 'attached', timeout: 1_500 }).catch(() => {});
  192 |       const options = (await inline.count())
  193 |         ? inline.locator('.ng-option')
  194 |         : this.page.locator('.ng-dropdown-panel .ng-option');
  195 |       const wanted = options.filter({ hasText: pattern });
  196 |       const found = await wanted.first().waitFor({ state: 'visible', timeout: attempt * 5_000 })
  197 |         .then(() => true).catch(() => false);
  198 |       if (found && (await wanted.first().click({ timeout: 10_000 }).then(() => true).catch(() => false))) {
  199 |         if (closePanel) await this.page.keyboard.press('Escape');
  200 |         return;
  201 |       }
  202 |       await this.page.keyboard.press('Escape');
  203 |     }
  204 |     throw new Error(`Option "${optionText}" never appeared in dropdown labeled "${labelText}"`);
  205 |   }
  206 | 
  207 |   /**
  208 |    * Multi-select helper: click the panel's own "Select all" row. Option
  209 |    * lists load from slow MasterData calls and a panel opened too early stays
  210 |    * empty until reopened - so close and reopen with growing patience.
  211 |    */
  212 |   async selectAllOptions(controlname) {
  213 |     const selectAll = this.page.locator('.ng-dropdown-panel').getByText(/Select all/i).first();
  214 |     for (let attempt = 1; attempt <= 4; attempt++) {
  215 |       await this.select(controlname).locator('.ng-select-container').click();
  216 |       const found = await selectAll
  217 |         .waitFor({ state: 'visible', timeout: attempt * 10_000 })
  218 |         .then(() => true)
  219 |         .catch(() => false);
  220 |       if (found) {
  221 |         await selectAll.click();
  222 |         await this.page.keyboard.press('Escape');
  223 |         return;
  224 |       }
  225 |       await this.page.keyboard.press('Escape');
  226 |     }
  227 |     throw new Error(`"${controlname}" panel never showed its "Select all" row`);
  228 |   }
  229 | 
  230 |   /**
  231 |    * Input reached through its <label> text. Exact match by default so 'Rate'
  232 |    * never grabs the 'Rate Fix' container; pass exact: false for labels that
  233 |    * embed extra markup, like "MRP (Reduce Tax)" reached via 'MRP'.
  234 |    */
  235 |   inputByLabel(labelText, { exact = true } = {}) {
  236 |     const label = exact
  237 |       ? this.page.locator(`label:text-is("${labelText}")`)
  238 |       : this.page.locator('label', { hasText: labelText });
  239 |     return this.page
  240 |       .locator('div.grid, div.form-group')
  241 |       .filter({ has: label })
  242 |       .last()
  243 |       .locator('input:not([type=checkbox])')
  244 |       .first();
  245 |   }
  246 | 
  247 |   /** Numeric value of a labeled field (calculated fields included). */
  248 |   async numberOf(labelText, opts) {
  249 |     const raw = await this.inputByLabel(labelText, opts).inputValue();
  250 |     return Number(String(raw).replace(/,/g, '') || 0);
  251 |   }
  252 | 
  253 |   async fillByLabel(labelText, value, opts) {
  254 |     const input = this.inputByLabel(labelText, opts);
  255 |     await input.fill(String(value));
  256 |     await input.blur();
  257 |   }
  258 | 
  259 |   /** Checkboxes hide behind label.invisible-click; the input never gets the click. */
  260 |   async setCheckbox(id, checked = true) {
  261 |     const box = this.page.locator(`#${id}`);
  262 |     if ((await box.isChecked()) !== checked) {
  263 |       await this.page.locator(`label.invisible-click[for="${id}"]`).click();
  264 |     }
  265 |   }
  266 | 
  267 |   /**
  268 |    * Submit the wizard and return the API response for assertion.
  269 |    * The save endpoints differ per screen (StockInwardMetal, AlloyInward, ...)
  270 |    * but all contain "Inward"; override submitApiPattern to narrow it.
  271 |    */
  272 |   async submit() {
  273 |     const pattern = this.submitApiPattern || /Inward/i;
  274 |     // Grid refreshes and keep-alives are POSTs too - never count them as the
  275 |     // save. And the QA server can take >60s on master-data saves.
  276 |     const noise = /GetAll|Pagination|KeepAlive|GetMasterData|GetLocation/i;
  277 |     // accept ANY status so a rejected save surfaces as a clear error instead
  278 |     // of a 120s timeout (seen 16-09-2026 on qap with an attached image)
  279 |     const resp = this.page.waitForResponse(
  280 |       (r) => pattern.test(r.url()) && !noise.test(r.url()) && r.request().method() === 'POST',
  281 |       { timeout: 120_000 },
  282 |     );
  283 |     await this.submitBtn.click();
  284 |     const r = await resp;
  285 |     const body = await r.json().catch(() => null);
  286 |     if (r.status() >= 400 || (body && body.errorCode)) {
> 287 |       throw new Error(`${this.tabName} save rejected (HTTP ${r.status()} ${r.url().split('/').slice(-1)[0]}): ${JSON.stringify(body).slice(0, 400)}`);
      |             ^ Error: Stone save rejected (HTTP 501 CreateStockInwardStone): {"errorCode":1002,"error":"FTP settings not found for Functionality Type.","header":"Not found"}
  288 |     }
  289 |     return body;
  290 |   }
  291 | 
  292 |   /** The RC / voucher number shown on the post-submit Print dialog (e.g. M137). */
  293 |   async voucherNumber() {
  294 |     const p = this.printDialog.locator('p');
  295 |     await p.first().waitFor({ state: 'visible', timeout: 30_000 });
  296 |     for (const t of await p.allTextContents()) {
  297 |       const m = t.trim().match(/^[A-Z]+\d+$/);
  298 |       if (m) return m[0];
  299 |     }
  300 |     const txt = ((await this.printDialog.innerText()) || '').replace(/\s+/g, ' ');
  301 |     const m = txt.match(/Voucher Number\s*:\s*([A-Z0-9-]+)/i);
  302 |     return m ? m[1] : '';
  303 |   }
  304 | 
  305 |   async summaryText() {
  306 |     return ((await this.summaryPanel.innerText()) || '').replace(/\s+/g, ' ').trim();
  307 |   }
  308 | 
  309 |   /**
  310 |    * Attach a file through an "Add Files" control: opens the Upload Files
  311 |    * dialog, injects the file straight into its input[type=file], commits
  312 |    * with "Add Image", then closes the dialog. Pages can render several Add
  313 |    * Files controls at once (order form + a sample/item panel) - last:true
  314 |    * targets the newest visible one.
  315 |    */
  316 |   async attachFileViaAddFiles(filePath, { last = false } = {}) {
  317 |     const btns = this.page.getByRole('button', { name: 'Add Files' }).locator('visible=true');
  318 |     const btn = last ? btns.last() : btns.first();
  319 |     await btn.scrollIntoViewIfNeeded();
  320 |     await btn.click();
  321 |     // dialog title differs per screen: "Upload Files" / "Upload Documents" / "Upload Images"
  322 |     const dlg = this.page
  323 |       .locator('[role="dialog"], .modal, ngb-modal-window, .offcanvas')
  324 |       .filter({ hasText: /Upload (Files?|Documents?|Images?)/i })
  325 |       .last();
  326 |     await dlg.waitFor({ state: 'visible', timeout: 15_000 });
  327 | 
  328 |     await dlg.locator('input[type="file"]').first().setInputFiles(filePath);
  329 |     await this.page.waitForTimeout(1_500);
  330 | 
  331 |     // commit button caption differs per client: "Add Image" (QA) / "Add File" (qap)
  332 |     const addImage = dlg.getByRole('button', { name: /^\s*(Add Image|Add Files?|Add Documents?|Upload)\s*$/i }).last();
  333 |     await addImage.waitFor({ state: 'visible', timeout: 15_000 });
  334 |     await addImage.click();
  335 |     await this.page.waitForTimeout(1_500);
  336 |     const uploaded = await dlg.locator('img, .uploaded, li, tr').filter({ hasNotText: /No images available/i }).count().catch(() => 0);
  337 | 
  338 |     await dlg.getByRole('button', { name: 'Close' }).last().click();
  339 |     await dlg.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  340 |     console.log(`Add Files: image attached (${filePath.split(/[\\/]/).pop()}) and dialog closed${uploaded ? '' : ' - NOTE: dialog listed no uploaded file'}`);
  341 |   }
  342 | 
  343 |   /**
  344 |    * Best-effort variant: attach only when the screen offers an "Add Files"
  345 |    * control (QA lead, 16-09-2026: every page that has Add Files gets a demo
  346 |    * image from the Demo files folder). Returns true when attached, false
  347 |    * when the control is absent on this screen/step.
  348 |    */
  349 |   async attachDemoImageIfOffered(filePath, { last = false } = {}) {
  350 |     // DEMO_ATTACH=off skips every demo attachment (e.g. while the FTP /
  351 |     // storage settings for a functionality type are not configured yet)
  352 |     if ((process.env.DEMO_ATTACH || 'on').toLowerCase() === 'off') {
  353 |       console.log('Add Files: skipped (DEMO_ATTACH=off)');
  354 |       return false;
  355 |     }
  356 |     const btn = this.page.getByRole('button', { name: 'Add Files' }).locator('visible=true');
  357 |     if (!(await btn.first().isVisible({ timeout: 2_000 }).catch(() => false))) {
  358 |       console.log('Add Files: not offered on this screen - nothing attached');
  359 |       return false;
  360 |     }
  361 |     await this.attachFileViaAddFiles(filePath, { last });
  362 |     return true;
  363 |   }
  364 | 
  365 |   /**
  366 |    * Post-save print template check: when the Print dialog offers a Preview
  367 |    * button, open it and verify the template actually rendered - a PDF
  368 |    * viewer, iframe or report markup, inline or in a popup (both happen).
  369 |    * Closes the preview again so the caller can continue with the dialog.
  370 |    * Returns 'ok' | 'no-preview'; THROWS when Preview opens no report
  371 |    * surface (that is the broken-template signal this check exists for).
  372 |    */
  373 |   async verifyPrintPreview({ screenshot } = {}) {
  374 |     const previewBtn = this.page.getByRole('button', { name: /Preview/ }).last();
  375 |     if (!(await previewBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
  376 |       console.log('print preview: no Preview button offered - skipping');
  377 |       return 'no-preview';
  378 |     }
  379 |     const maybePopup = this.page.waitForEvent('popup', { timeout: 15_000 }).catch(() => null);
  380 |     await previewBtn.click();
  381 |     const popup = await maybePopup;
  382 |     const previewPage = popup || this.page;
  383 |     await previewPage.waitForLoadState('domcontentloaded').catch(() => {});
  384 |     await previewPage.waitForTimeout(3_000); // let the report start rendering
  385 | 
  386 |     // A rendered template shows as a PDF viewer / iframe / canvas / blob
  387 |     // image, OR as report HTML inside an offcanvas (the Issue page does the
```