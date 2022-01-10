# Scrape WCAG translation and generate JSON for the WCAG-EM Report Tool

The following JavaScript needs to be executed on the WCAG in your language, which can be found 
among the [WCAG 2 Translations](https://www.w3.org/WAI/standards-guidelines/wcag/translations/).

It will generate the JSON needed for `locales/*/WCAG.json` and attach it at the end of the page for copying.

It is using the English version as a basis, to cover for translations of WCAG 2.0.
So far it has only been used for the German translation.

```javascript
fetch('https://raw.githubusercontent.com/w3c/wai-wcag-em-report-tool/main/src/locales/en/WCAG.json')
  .then(r => r.json())
  .then(wcag => {
    // will be used to build the respective RegExp
    wcag.COMMON.CONFORMANCE_LEVEL = prompt("English version successfully loaded. Please provide the wording for 'Conformance Level' in your language", wcag.COMMON.CONFORMANCE_LEVEL);

    // PRINCIPLES
    const pReg = /\D+\s(\d+):\s([^-]+)\s-\s(.+)/;
    document.querySelectorAll('h2.principle').forEach(p => {
      const pInfo = p.textContent.match(pReg);

      console.log("Found principle " + pInfo[1]);

      wcag.PRINCIPLE[pInfo[1]] = {
        TITLE: pInfo[2].trim(),
        DESCRIPTION: pInfo[3].trim()
      };
    });

    // GUIDELINE
    const gReg = /\D+\s(\d+.\d+)\s([^:]+):\s(.+)/;

    document.querySelectorAll('.guideline h3').forEach(g => {
      const gInfo = g.textContent.match(gReg);

      console.log("Found guideline " + gInfo[1])

      wcag.GUIDELINE[gInfo[1]] = {
        TITLE: gInfo[2].trim(),
        DESCRIPTION: gInfo[3].trim()
      }
    });

    // SUCCESS CRITERIUM
    const scReg = new RegExp('(\\d+.\\d+.\\d+)\\s([^:]+):\\s(.+)\\s\\(' + wcag.COMMON.CONFORMANCE_LEVEL + '\\sA{1,3}\\)');
    const scDreg = /([^:]+):\s(.+)/;

    console.log("Identifying SC with " + scReg.toString());

    document.querySelectorAll('.scinner .sctxt').forEach(sc => {
      const scInfo = sc.textContent.match(scReg);
      const scD = sc.parentNode.querySelectorAll('li');

      if (! scInfo) {
        console.log("Found success criterion but could't parse it!");
        console.log(sc);
      } else {
        console.log("Found success criterion " + scInfo[1] + '(' + scD.length + ' detail items)');
      }

      wcag.SUCCESS_CRITERION[scInfo[1]] = {
        TITLE: scInfo[2].trim(),
        DESCRIPTION: scInfo[3].trim(),
        DETAILS: {}
      };

      // DETAILS
      scD.forEach((d, i) => {
        const dInfo = d.textContent.match(scDreg);

        // Some details are OL lists without definitions
        wcag.SUCCESS_CRITERION[scInfo[1]].DETAILS[i + 1] = {
          TITLE: dInfo ? dInfo[1].trim() : i + 1,
          DESCRIPTION: dInfo ? dInfo[2].trim() : d.textContent.trim()
        }
      });

    });

    // WRITE JSON TO DOCUMENT FOR COPYING

    const pre = document.createElement('pre');
    pre.innerHTML = JSON.stringify(wcag, null, 2);
    document.querySelector('body').appendChild(pre);
  })
  .catch(e => {
    console.log('ERROR! ' + e);
  });
```