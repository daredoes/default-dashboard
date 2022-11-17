export interface Dashboard {
  id: string;
  mode: string;
  require_admin: boolean;
  show_in_sidebar: boolean;
  title: string;
  url_path: string;
}

export interface HassDefaultEvent extends Event {
  detail: {
    defaultPanel: string;
  };
}
