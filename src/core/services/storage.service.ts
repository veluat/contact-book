import type { StorageData } from '@/types';

export class StorageService {
  private readonly STORAGE_KEY = 'contact-book-data';

  protected getData(): StorageData {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { contacts: [], groups: [] };
  }

  protected saveData(data: StorageData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  initializeStorage(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveData({ contacts: [], groups: [] });
    }
  }
}