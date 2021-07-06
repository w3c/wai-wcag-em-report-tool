import { derived, writable } from 'svelte/store';
import { t as translate } from 'svelte-i18n';

export const routes = derived([translate], ([$translate]) => {
  return {
    OVERVIEW: {
      title: $translate('UI.NAV.STEP_START'),
      path: '/'
    },
    SCOPE: {
      title: $translate('UI.NAV.STEP_SCOPE'),
      path: '/evaluation/define-scope'
    },
    EXPLORE: {
      title: $translate('UI.NAV.STEP_EXPLORE'),
      path: '/evaluation/explore-website'
    },
    SAMPLE: {
      title: $translate('UI.NAV.STEP_SAMPLE'),
      path: '/evaluation/select-sample'
    },
    AUDIT: {
      title: $translate('UI.NAV.STEP_AUDIT'),
      path: '/evaluation/audit-sample'
    },
    SUMMARY: {
      title: $translate('UI.NAV.STEP_REPORT'),
      path: '/evaluation/report-findings'
    },
    VIEW_REPORT: {
      title: $translate('UI.NAV.STEP_VIEWREPORT'),
      path: '/evaluation/view-report'
    },
    ACKNOWLEDGEMENTS: {
      title: "Acknowledgements",
      path: "/acknowledgements"
    }
  };
});

export const yourReportPanelOpen = writable(true);