import './types';
import { LIB_VERSION } from './version';
import { localize } from './localize/localize';
import { getHass, log } from './helpers';
import Controller from './controller';
import { HomeAssistant } from 'custom-card-helpers';
import { HassDefaultEvent } from './types';

log(`${localize('common.version')} ${LIB_VERSION}`);
const ENTITY_ID = 'default_dashboard';
const DEFAULT_DASHBOARD_DROPDOWN = `input_select.${ENTITY_ID}`;
const DEFAULT_DASHBOARD_TOGGLE = `input_boolean.${ENTITY_ID}`;
const REFRESH_OPTION = 'refresh';
const OVERVIEW_OPTION = 'lovelace';

let controller: Controller;

// Only gets loaded when dashboard is loaded, unfortunately.
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

// Gets the dashboards, and then puts the url_path attributes in a hash
const getUrlsHash = async (): Promise<Record<string, boolean>> => {
  const dashboards = await controller.getDashboards();
  const urls = {};
  dashboards.forEach((d) => {
    urls[d.url_path] = true;
  });
  return urls;
};

// Calls the HASS service to set the options for an input select
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

// Calls the HASS service to select the option for an input select
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

// Checks if the managing local setting is null, and if it is sets it to true
const enableIfNull = async () => {
  const settings = await controller.getStorageSettings();
  if (settings.isDefaultPanelManaged === null) {
    await controller.enable();
    return true;
  }
  return false;
};

// Gets the helper entities needed for Default Dashboard, and throws log messages if they are missing
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

// Try to enable Default Dashboard, if that is current setting
const tryEnabledDefaultDashboard = async (enabled: boolean) => {
  if (enabled) {
    if (await enableIfNull()) {
      log('Default Dashboard Enabled');
      return true;
    }
  }
  return false;
};

// Sets the default panel to whatever the given url is, if valid and not disabled
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

  // First, we get our hass object from the page.
  const hass = getHass();
  // Second, we pass it into our controller instance
  controller = new Controller(hass);
  // Third, we set up our listener for when the "set default dashboard on this device" button is used
  addDefaultDashboardListener();
  // Fourth, we get the url and toggle status of our helpers
  const { url: my_lovelace_url, enabled: default_dashboard_enabled } = getUrlAndToggle(hass);
  // Fifth, we confirm we have a url
  if (my_lovelace_url) {
    // Sixth, we see if that URL is refresh, and if it is we refresh our input select's options.
    if (my_lovelace_url === 'refresh') {
      log('Setting dropdown options');
      const urls = await getUrlsHash();
      await setDefaultDashboardOptions(hass, [OVERVIEW_OPTION, ...Object.keys(urls), REFRESH_OPTION]);
      await setDefaultDashboardOption(hass, OVERVIEW_OPTION);
      return;
    } else {
      // Sixth-else, we try to enable default dashboard for this user, and then try to set the default dashboard for this user
      await tryEnabledDefaultDashboard(default_dashboard_enabled);
      await setDefaultDashboard(my_lovelace_url);
    }
  }
})();
