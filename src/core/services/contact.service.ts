import { StorageService } from './storage.service';
import type {Contact} from '@/types'

export class ContactService extends StorageService {
  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  addContact(contact: Omit<Contact, 'id'>): void {
    const data = this.getData();

    if (this.hasContactWithPhone(contact.phone)) {
      throw new Error('Контакт с таким номером уже существует');
    }

    data.contacts.push({
      ...contact,
      id: Date.now().toString(),
    });
    this.saveData(data);
  }

  getContacts(): Contact[] {
    return this.getData().contacts;
  }

  hasContactWithPhone(phone: string, excludeId?: string): boolean {
    const normalizedPhone = this.normalizePhone(phone);
    return this.getData().contacts.some(
      (contact) =>
        this.normalizePhone(contact.phone) === normalizedPhone &&
        contact.id !== excludeId
    );
  }

  updateContact(contactId: string, newData: Omit<Contact, 'id'>): void {
    const data = this.getData();
    const index = data.contacts.findIndex((c) => c.id === contactId);

    if (index === -1) throw new Error('Контакт не найден');
    if (this.hasContactWithPhone(newData.phone, contactId)) {
      throw new Error('Номер телефона уже занят');
    }

    data.contacts[index] = { ...data.contacts[index], ...newData };
    this.saveData(data);
  }

  deleteContact(contactId: string): void {
    const data = this.getData();
    data.contacts = data.contacts.filter((c) => c.id !== contactId);
    this.saveData(data);
  }

  getContactsByGroup(groupId: string): Contact[] {
    return this.getContacts().filter((c) => c.groupId === groupId);
  }
}