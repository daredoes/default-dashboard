import { HomeAssistant } from 'custom-card-helpers';

export const getHass = (): HomeAssistant => {
  const hass = document.getElementsByTagName('home-assistant')[0];
  return (hass as any).hass as HomeAssistant;
};
