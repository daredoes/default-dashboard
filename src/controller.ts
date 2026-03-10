/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomeAssistant } from 'custom-card-helpers';
import LOCAL_STORAGE_OPTIONS from './helpers/storageOptions';
import { Dashboard } from './types';
class DefaultDashboardController {
  hass!: HomeAssistant;
  constructor(hass: HomeAssistant) {
    this.hass = hass;
  }

  getDashboards = async (): Promise<Dashboard[]> => {
    return this.hass.callWS<Dashboard[]>({
      type: 'lovelace/dashboards/list',
    });
  };

  createInputBoolean = async (): Promise<any> => {
    const res = await this.hass.callWS({
      type: 'input_boolean/create',
      name: 'Default Dashboard',
    });
    return res;
  };

  createInputSelect = async (): Promise<any> => {
    const dashboards = await this.getDashboards().then((boards) => {
      return boards
        .filter((d) => !d.require_admin)
        .flatMap((d) => {
          return d.url_path;
        });
    });
    const res = await this.hass.callWS({
      type: 'input_select/create',
      name: 'Default Dashboard',
      options: ['lovelace', ...dashboards, 'refresh'],
    });
    return res;
  };

  getStorageSettings = async (): Promise<{ defaultPanel: string | null; isDefaultPanelManaged: string | null }> => {
    const defaultPanel: string | null = localStorage.getItem(LOCAL_STORAGE_OPTIONS.defaultPanel);
    const isDefaultPanelManaged: string | null = localStorage.getItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged);
    return { defaultPanel, isDefaultPanelManaged };
  };

  setDefaultPanel = async (defaultPanel: string): Promise<void> => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.defaultPanel, defaultPanel);
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'true');
  };

  disable = async (): Promise<void> => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'false');
  };

  enable = async (): Promise<void> => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS.isDefaultPanelManaged, 'true');
  };
}

export default DefaultDashboardController;
