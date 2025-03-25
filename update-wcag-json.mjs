import axios from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';

const wcagUrl = 'https://www.w3.org/WAI/WCAG$VERSION/wcag.json';

(async () => {
  const [wcag21, wcag22] = await Promise.all([
    axios
      .get(wcagUrl.replace('$VERSION', '21'), { responseType: 'json' })
      .then(({ data }) => data),
    axios
      .get(wcagUrl.replace('$VERSION', '22'), { responseType: 'json' })
      .then(({ data }) => data)
  ]);

  function mapVersion(data, version) {
    const map = {};
    for (const principle of data.principles) {
      for (const guideline of principle.guidelines) {
        for (const criterion of guideline.successcriteria) {
          if (criterion.versions.includes(version)) {
            map[criterion.num] = {
              num: criterion.num,
              id:
                version === '2.0' && criterion.alt_id.length
                  ? criterion.alt_id[0]
                  : criterion.id,
              conformanceLevel: criterion.level
            };
          }
        }
      }
    }
    return map;
  }

  const data = {
    '2.0': mapVersion(wcag21, '2.0'),
    2.1: mapVersion(wcag21, '2.1'),
    2.2: mapVersion(wcag22, '2.2')
  };

  writeFileSync(
    join('src', 'data', 'wcag.json'),
    JSON.stringify(data, null, '    ') + '\n'
  );
})();
