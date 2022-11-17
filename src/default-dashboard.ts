import './types';
import { LIB_VERSION } from './version';
import { localize } from './localize/localize';
import { getHass, log } from './helpers';
import Controller from './controller';
import { HomeAssistant } from 'custom-card-helpers';

log(`${localize('common.version')} ${LIB_VERSION}`);
const ENTITY_ID = 'default_dashboard';
const DEFAULT_DASHBOARD_DROPDOWN = `input_select.${ENTITY_ID}`;
const DEFAULT_DASHBOARD_TOGGLE = `input_boolean.${ENTITY_ID}`;
const REFRESH_OPTION = 'refresh';
const OVERVIEW_OPTION = 'lovelace';

let controller: Controller;

interface HassDefaultEvent extends Event {
  detail: {
    defaultPanel: string;
  };
}

const addDefaultDashboardListener = (): void => {
  window.addEventListener('hass-default-panel', (ev: Event) => {
    // If default panel is overview, enable Default Dashboard, else disable Default Dashboard
    if ((ev as HassDefaultEvent).detail.defaultPanel === 'lovelace') {
      controller.enable();
    } else {
      controller.disable();
    }
  });
};

const getUrlsHash = async (): Promise<Record<string, boolean>> => {
  const dashboards = await controller.getDashboards();
  const urls = {};
  dashboards.forEach((d) => {
    urls[d.url_path] = true;
  });
  return urls;
};

const setDefaultDashboardOptions = async (hass: HomeAssistant, options: string[]) => {
  return hass.callService(
    'input_select',
    'set_options',
    {
      options,
    },
    { entity_id: DEFAULT_DASHBOARD_DROPDOWN },
  );
};

const setDefaultDashboardOption = async (hass: HomeAssistant, option: string) => {
  return hass.callService(
    'input_select',
    'select_option',
    {
      option,
    },
    { entity_id: DEFAULT_DASHBOARD_DROPDOWN },
  );
};

const enableIfNull = async () => {
  const settings = await controller.getStorageSettings();
  if (settings.isDefaultPanelManaged === null) {
    await controller.enable();
    return true;
  }
  return false;
};

const getUrlAndToggle = (hass: HomeAssistant) => {
  const url = hass.states[DEFAULT_DASHBOARD_DROPDOWN]?.state;
  const enabled = hass.states[DEFAULT_DASHBOARD_TOGGLE]?.state === 'on';
  if (url === null || enabled === null) {
    if (url === null) {
      log(`Please create a Dropdown helper with the id \`${DEFAULT_DASHBOARD_DROPDOWN}\``);
    }
    if (enabled === null) {
      log(`Please create a Toggle helper with the id \`${DEFAULT_DASHBOARD_TOGGLE}\``);
    }
  }
  return { url, enabled };
};

const tryEnabledDefaultDashboard = async (enabled: boolean) => {
  if (enabled) {
    if (await enableIfNull()) {
      log('Default Dashboard Enabled');
    }
  }
};

const setDefaultDashboard = async (url: string) => {
  const managedPanel = `"${url}"`;
  const settings = await controller.getStorageSettings();
  const disabled = settings.isDefaultPanelManaged === 'false' || settings.isDefaultPanelManaged === null;
  const urls = await getUrlsHash();
  if (!disabled) {
    if (urls[url]) {
      if (settings.defaultPanel !== managedPanel) {
        log(`Setting default panel to ${managedPanel}`);
        await controller.setDefaultPanel(managedPanel);
        // Reload the homepage after setting the new homepage
        location.replace('/');
      }
    }
  }
};

// Main/entrypoint
(async () => {
  // Wait for scoped customElements registry to be set up
  // otherwise the customElements registry card-mod is defined in
  // may get overwritten by the polyfill if card-mod is loaded as a module
  while (customElements.get('home-assistant') === undefined)
    await new Promise((resolve) => window.setTimeout(resolve, 100));

  const hass = getHass();
  controller = new Controller(hass);
  addDefaultDashboardListener();
  const { url: my_lovelace_url, enabled: default_dashboard_enabled } = getUrlAndToggle(hass);
  if (my_lovelace_url) {
    const urls = await getUrlsHash();
    if (my_lovelace_url === 'refresh') {
      log('Setting dropdown options');
      await setDefaultDashboardOptions(hass, [OVERVIEW_OPTION, ...Object.keys(urls), REFRESH_OPTION]);
      await setDefaultDashboardOption(hass, OVERVIEW_OPTION);
      return;
    }
    await tryEnabledDefaultDashboard(default_dashboard_enabled);
    await setDefaultDashboard(my_lovelace_url);
  }
})();
