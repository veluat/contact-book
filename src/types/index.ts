export interface Contact {
  id: string;
  name: string;
  phone: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface StorageData {
  contacts: Contact[];
  groups: Group[];
}

export type ToastType = 'success' | 'error';

export type ToastConfig = {
  message: string;
  type: ToastType;
  duration?: number;
};