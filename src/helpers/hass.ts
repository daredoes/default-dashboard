import { HomeAssistant } from 'custom-card-helpers';
import { LitElement } from 'lit';

export const getHass = (): HomeAssistant => {
  const hass = document.getElementsByTagName('home-assistant')[0] as LitElement;
  return (hass as any).hass as HomeAssistant;
};
