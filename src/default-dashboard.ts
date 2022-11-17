import './types';
import { LIB_VERSION } from './version';
import { localize } from './localize/localize';
import { getHass, log } from './helpers';
import Controller from './controller';

log(`${localize('common.version')} ${LIB_VERSION}`);
let controller: Controller;

(async () => {
  // Wait for scoped customElements registry to be set up
  // otherwise the customElements registry card-mod is defined in
  // may get overwritten by the polyfill if card-mod is loaded as a module
  while (customElements.get('home-assistant') === undefined)
    await new Promise((resolve) => window.setTimeout(resolve, 100));

  const hass = getHass();
  controller = new Controller(hass);
  const my_lovelace_url = hass.states['input_select.default_dashboard']?.state;
  if (my_lovelace_url) {
    const dashboards = await controller.getDashboards();
    const urls = {};
    dashboards.forEach((d) => {
      urls[d.url_path] = true;
    });
    if (my_lovelace_url === 'refresh') {
      log('Setting dropdown options');
      hass.callService(
        'input_select',
        'set_options',
        {
          options: ['lovelace', ...Object.keys(urls), 'enabled', 'disabled', 'refresh'],
        },
        { entity_id: 'input_select.default_dashboard' },
      );
      hass.callService(
        'input_select',
        'select_option',
        {
          option: 'enabled',
        },
        { entity_id: 'input_select.default_dashboard' },
      );
      log('Reloading the page for new options');
      location.replace('/');
      return;
    } else if (my_lovelace_url === 'disabled') {
      await controller.disable();
      return;
    } else if (my_lovelace_url === 'enabled') {
      await controller.enable();
    }
    const managedPanel = `"${my_lovelace_url as string}"`;
    const settings = await controller.getStorageSettings();
    const disabled = settings.isDefaultPanelManaged === 'false';
    if (!disabled) {
      if (settings.defaultManagedPanel !== managedPanel) {
        // if requested url is in dashboard urls
        if (urls[my_lovelace_url as string]) {
          log('Setting managed panel to ', managedPanel);
          await controller.setManagedDefaultPanel(managedPanel);
          // Reload settings for the new changes to localStorage
        }
      }
      if (settings.defaultPanel !== managedPanel) {
        log('Setting default panel to ', managedPanel);
        await controller.setDefaultPanel(managedPanel);
        // Reload the homepage after setting the new homepage
        location.replace('/');
      }
    }
  }
})();
