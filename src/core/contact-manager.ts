export {}
/*
// contact-manager.ts

import type {Contact, Group, StorageData} from '@/types'

export class ContactManager {
  private readonly STORAGE_KEY = 'contact-book-data';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData: StorageData = {
        contacts: [],
        groups: []
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  private getData(): StorageData {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { contacts: [], groups: [] };
  }

  private saveData(data: StorageData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Методы для контактов
  addContact(contact: Omit<Contact, 'id'>): void {
    const data = this.getData();

    if (this.hasContactWithPhone(contact.phone)) {
      throw new Error('Контакт с таким номером телефона уже существует');
    }

    const newContact: Contact = {
      ...contact,
      id: Date.now().toString()
    };

    data.contacts.push(newContact);
    this.saveData(data);
  }

  getContacts(): Contact[] {
    return this.getData().contacts;
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  hasContactWithPhone(phone: string, excludeId?: string): boolean {
    const normalizedPhone = this.normalizePhone(phone);
    const data = this.getData();
    return data.contacts.some(contact =>
      this.normalizePhone(contact.phone) === normalizedPhone &&
      contact.id !== excludeId
    );
  }

  updateContact(contactId: string, newData: Omit<Contact, 'id'>): void {
    const data = this.getData();
    const contactIndex = data.contacts.findIndex(c => c.id === contactId);

    if (contactIndex === -1) {
      throw new Error('Контакт не найден');
    }

    if (this.hasContactWithPhone(newData.phone, contactId)) {
      throw new Error('Контакт с таким номером телефона уже существует');
    }

    data.contacts[contactIndex] = {
      ...data.contacts[contactIndex],
      ...newData
    };

    this.saveData(data);
  }

  deleteContact(contactId: string): void {
    const data = this.getData();
    data.contacts = data.contacts.filter(contact => contact.id !== contactId);
    this.saveData(data);
  }

  // Методы для групп
  addGroup(groupName: string): void {
    const data = this.getData();
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName
    };
    data.groups.push(newGroup);
    this.saveData(data);
  }

  getAllGroups(): Group[] {
    return this.getData().groups;
  }

  updateGroupName(groupId: string, newName: string): void {
    const data = this.getData();

    if (data.groups.some(g =>
      g.id !== groupId && g.name.toLowerCase() === newName.toLowerCase())
    ) {
      throw new Error(`Группа с именем "${newName}" уже существует`);
    }

    const group = data.groups.find(g => g.id === groupId);
    if (group) {
      group.name = newName;
      this.saveData(data);
    }
  }

  deleteGroup(groupId: string): void {
    const data = this.getData();
    data.groups = data.groups.filter(group => group.id !== groupId);
    data.contacts = data.contacts.filter(contact => contact.groupId !== groupId);
    this.saveData(data);
  }

  getContactsByGroup(groupId: string): Contact[] {
    return this.getContacts().filter(contact => contact.groupId === groupId);
  }
}*/
