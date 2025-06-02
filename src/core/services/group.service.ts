import { StorageService } from './storage.service';
import type {Group} from '@/types'

export class GroupService extends StorageService {
  addGroup(name: string): void {
    const data = this.getData();

    if (data.groups.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Группа с таким именем уже существует');
    }

    data.groups.push({
      id: Date.now().toString(),
      name,
    });
    this.saveData(data);
  }

  getAllGroups(): Group[] {
    return this.getData().groups;
  }

  updateGroupName(groupId: string, newName: string): void {
    const data = this.getData();
    const group = data.groups.find((g) => g.id === groupId);

    if (!group) throw new Error('Группа не найдена');
    if (data.groups.some((g) => g.id !== groupId && g.name.toLowerCase() === newName.toLowerCase())) {
      throw new Error('Имя группы занято');
    }

    group.name = newName;
    this.saveData(data);
  }

  deleteGroup(groupId: string): void {
    const data = this.getData();
    data.groups = data.groups.filter((g) => g.id !== groupId);
    data.contacts = data.contacts.filter((c) => c.groupId !== groupId);
    this.saveData(data);
  }
}