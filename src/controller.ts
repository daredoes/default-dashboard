/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomeAssistant } from 'custom-card-helpers';
import { log } from './helpers';
import { Dashboard } from './types';

export const LOCAL_STORAGE_OPTIONS = {
  defaultPanel: '',
  defaultManagedPanel: '',
  isDefaultPanelManaged: '',
};

// Set all values to the key
Object.keys(LOCAL_STORAGE_OPTIONS).forEach((key) => {
  LOCAL_STORAGE_OPTIONS[key] = key;
});

export const fireEvent = (defaultPanel: string) => {
  const detail = { defaultPanel };
  const event = new Event('hass-default-panel', {
    bubbles: true,
    cancelable: false,
    composed: true,
  });
  (event as any).detail = detail;
  // window.dispatchEvent(event);
  return event;
};

class DefaultDashboardController {
  hass!: HomeAssistant;
  constructor(hass: HomeAssistant) {
    this.hass = hass;
  }

  getDashboards = async (): Promise<Dashboard[]> => {
    log('Getting User-Created Dashboards');
    return this.hass.callWS<Dashboard[]>({
      type: 'lovelace/dashboards/list',
    });
  };

  getStorageSettings = async () => {
    const defaultPanel: string | null = localStorage.getItem(LOCAL_STORAGE_OPTIONS.defaultPanel);
    const defaultManagedPanel: string | null = localStorage.getItem(LOCAL_STORAGE_OPTIONS.defaultManagedPanel);
    const isDefaultPanelManaged: string | null = localStorage.getItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged);
    return { defaultPanel, isDefaultPanelManaged, defaultManagedPanel };
  };

  setDefaultPanel = async (defaultPanel: string) => {
    // this.hass['defaultPanel'] = defaultPanel;
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'defaultPanel',
        newValue: defaultPanel,
      }),
    );
    // console.log(this.hass['defaultPanel']);
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.defaultPanel, defaultPanel);
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'true');
  };

  setManagedDefaultPanel = async (defaultManagedPanel: string) => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.defaultManagedPanel, defaultManagedPanel);
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'true');
  };

  disable = async () => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'false');
  };

  enable = async () => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'false');
  };
}

export default DefaultDashboardController;
