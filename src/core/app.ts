import {Toaster} from '@components/ui/toaster.ts'
import type {Contact, Group} from '@/types'
import {Dropdown} from '@components/ui/dropdown.ts'
import {StorageService} from '@core/services/storage.service.ts'
import {GroupService} from '@core/services/group.service.ts'
import {ContactService} from '@core/services/contact.service.ts'

export class App {
  private storageService: StorageService
  private groupService: GroupService
  private contactService: ContactService
  private sidebar: HTMLElement
  private overlay: HTMLElement
  private toaster: Toaster
  private deleteModal: HTMLElement
  private currentGroupToDelete: string | null = null
  private selectedGroupId: string | null = null
  private groupDropdown: Dropdown | null = null

  constructor() {
    this.storageService = new StorageService()
    this.groupService = new GroupService()
    this.contactService = new ContactService()

    this.storageService.initializeStorage()

    this.sidebar = document.getElementById('sidebar')!
    this.overlay = document.querySelector('.overlay')!
    this.toaster = new Toaster()
    this.deleteModal = document.getElementById('delete-group-modal')!

    this.initEvents()
    this.checkEmptyState()
  }

  private initEvents(): void {
    // Открытие сайдбара для добавления контакта
    document.getElementById('add-contact-btn')?.addEventListener('click', () => {
      this.openSidebar('add-contact')
    })

    // Открытие сайдбара для управления группами
    document.getElementById('groups-btn-desktop')?.addEventListener('click', () => {
      this.openSidebar('groups')
    })
    document.getElementById('groups-btn-mobile')?.addEventListener('click', () => {
      this.openSidebar('groups')
    })

    // Закрытие сайдбара
    document.getElementById('close-sidebar')?.addEventListener('click', () => {
      this.closeSidebar()
    })

    // Сохранение контакта
    document.getElementById('save-contact')?.addEventListener('click', (e) => {
      e.preventDefault()
      this.saveContact()
    })

    // Закрытие по клику на overlay
    this.overlay.addEventListener('click', () => {
      this.closeSidebar()
    })

    // Добавление группы
    document.getElementById('add-group')?.addEventListener('click', (e) => {
      e.preventDefault()
      this.showAddGroupInput()
    })

    // Сохранение группы
    document.getElementById('save-group')?.addEventListener('click', async (e) => {
      e.preventDefault()
      await this.saveGroup()
    })

    // Обработчики для модального окна удаления
    document.getElementById('confirm-delete')?.addEventListener('click', () => {
      this.confirmGroupDelete()
    })

    document.getElementById('cancel-delete')?.addEventListener('click', () => {
      this.closeDeleteModal()
    })

    document.getElementById('close-modal')?.addEventListener('click', () => {
      this.closeDeleteModal()
    })
  }

  private async saveGroup(): Promise<void> {
    const input = document.getElementById('new-group-input') as HTMLInputElement
    if (!input) return

    input.classList.remove('input-error')

    const groupName = input.value.trim()
    if (!groupName) {
      this.toaster.show({
        type: 'error',
        message: 'Введите название группы'
      })
      return
    }

    try {
      const groupAdded = await this.addGroup(groupName)
      if (groupAdded) {
        this.toaster.show({
          type: 'success',
          message: `Группа "${groupName}" успешно создана`
        })
        this.renderGroupsList()
        input.value = ''
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toaster.show({
          type: 'error',
          message: error.message
        })
      }
    }
  }

  private showAddGroupInput(): void {
    const groupsList = this.sidebar.querySelector('.sidebar__groups-list')!
    const groups = this.groupService.getAllGroups()

    groupsList.innerHTML = ''

    groups.forEach(group => {
      const groupItem = this.createGroupElement(group)
      groupsList.appendChild(groupItem)
    })

    const newGroupContainer = document.createElement('div')
    newGroupContainer.className = 'sidebar__new-group'
    groupsList.appendChild(newGroupContainer)

    newGroupContainer.innerHTML = `
    <div class="sidebar__group-item">
      <input 
        type="text" 
        class="input sidebar__group-input" 
        placeholder="Введите название группы"
        id="new-group-input"
      >
      <button class="sidebar__cancel-add-group">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path opacity="0.3" d="M6.66676 20.3889C6.66676 21.55 7.61676 22.5 8.77787 22.5H17.2223C18.3834 22.5 19.3334 21.55 19.3334 20.3889V7.72222H6.66676V20.3889ZM9.26343 12.8733L10.7518 11.385L13.0001 13.6228L15.2379 11.385L16.7262 12.8733L14.4884 15.1111L16.7262 17.3489L15.2379 18.8372L13.0001 16.5994L10.7623 18.8372L9.27398 17.3489L11.5118 15.1111L9.26343 12.8733ZM16.6945 4.55556L15.639 3.5H10.3612L9.30565 4.55556H5.61121V6.66667H20.389V4.55556H16.6945Z"/>
          </svg>
      </button>
    </div>
  `

    const input = newGroupContainer.querySelector('#new-group-input') as HTMLInputElement
    input.focus()

    const cancelButton = newGroupContainer.querySelector('.sidebar__cancel-add-group')!
    cancelButton.addEventListener('click', () => {
      this.renderGroupsList()
    })
  }

  private async addGroup(groupName: string): Promise<boolean> {
    const existingGroups = this.groupService.getAllGroups()
    const groupExists = existingGroups.some(g => g.name.toLowerCase() === groupName.toLowerCase())

    if (groupExists) {
      this.toaster.show({
        type: 'error',
        message: `Группа с именем "${groupName}" уже существует`
      })

      const input = document.getElementById('new-group-input')
      if (input) {
        input.classList.add('input-error')
        input.focus()
      }

      return false
    }

    this.groupService.addGroup(groupName)
    return true
  }

  private renderGroupsList(): void {
    const groupsList = this.sidebar.querySelector('.sidebar__groups-list')!
    groupsList.innerHTML = ''

    const groups = this.groupService.getAllGroups()

    if (groups.length === 0) {
      groupsList.innerHTML = '<p class="sidebar__empty-message">Нет созданных групп</p>';
      return
    }

    groups.forEach(group => {
      const groupItem = this.createGroupElement(group)
      groupsList.appendChild(groupItem)
    })
  }

  private createGroupElement(group: Group): HTMLElement {
    const groupItem = document.createElement('div')
    groupItem.className = 'sidebar__group-item'
    groupItem.innerHTML = `
      <input 
        type="text" 
        class="input sidebar__group-input" 
        value="${group.name}" 
        placeholder="Название группы"
        data-id="${group.id}"
      >
      <button class="sidebar__delete-group" data-id="${group.id}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path opacity="0.3" d="M6.66676 20.3889C6.66676 21.55 7.61676 22.5 8.77787 22.5H17.2223C18.3834 22.5 19.3334 21.55 19.3334 20.3889V7.72222H6.66676V20.3889ZM9.26343 12.8733L10.7518 11.385L13.0001 13.6228L15.2379 11.385L16.7262 12.8733L14.4884 15.1111L16.7262 17.3489L15.2379 18.8372L13.0001 16.5994L10.7623 18.8372L9.27398 17.3489L11.5118 15.1111L9.26343 12.8733ZM16.6945 4.55556L15.639 3.5H10.3612L9.30565 4.55556H5.61121V6.66667H20.389V4.55556H16.6945Z"/>
          </svg>
      </button>
    `

    const input = groupItem.querySelector('.sidebar__group-input')!
    input.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement
      await this.updateGroupName(group.id, target.value.trim())
    })

    const deleteBtn = groupItem.querySelector('.sidebar__delete-group')!
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showDeleteConfirmation(group.id)
    })

    return groupItem
  }

  private async updateGroupName(groupId: string, newName: string): Promise<void> {
    if (!newName) return

    try {
      const group = this.groupService.getAllGroups().find(g => g.id === groupId)
      if (group && group.name !== newName) {
        this.groupService.updateGroupName(groupId, newName)
        this.toaster.show({
          type: 'success',
          message: 'Название группы успешно изменено'
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toaster.show({
          type: 'error',
          message: error.message
        })

        const group = this.groupService.getAllGroups().find(g => g.id === groupId)
        if (group) {
          const input = document.querySelector(`.sidebar__group-input[data-id="${groupId}"]`) as HTMLInputElement
          if (input) input.value = group.name
        }
      }
    }
  }

  private showDeleteConfirmation(groupId: string): void {
    const group = this.groupService.getAllGroups().find(g => g.id === groupId)
    if (!group) return

    this.currentGroupToDelete = groupId

    this.closeSidebar()

    const messageEl = this.deleteModal.querySelector('#modal-message')!
    messageEl.textContent =
      `Удаление группы повлечет за собой удаление контактов связанных с этой группой`

    this.deleteModal.classList.add('modal--open')
    this.overlay.classList.add('overlay--visible')
  }

  private confirmGroupDelete(): void {
    if (!this.currentGroupToDelete) return

    const group = this.groupService.getAllGroups().find(g => g.id === this.currentGroupToDelete)
    if (!group) return

    this.groupService.deleteGroup(this.currentGroupToDelete)
    this.renderGroupsList()
    this.closeDeleteModal()
    this.checkEmptyState()

    this.toaster.show({
      type: 'success',
      message: `Группа "${group.name}" и все связанные контакты удалены`
    })
  }

  private closeDeleteModal(): void {
    this.deleteModal.classList.remove('modal--open')
    this.overlay.classList.remove('overlay--visible')
    this.currentGroupToDelete = null
  }

  private openSidebar(mode: 'add-contact' | 'groups'): void {
    const title = this.sidebar.querySelector('.sidebar__title') as HTMLElement
    const form = this.sidebar.querySelector('.sidebar__form') as HTMLElement
    const groupsList = this.sidebar.querySelector('.sidebar__groups-list') as HTMLElement
    const saveContactBtn = document.getElementById('save-contact') as HTMLElement
    const addGroupBtn = document.getElementById('add-group') as HTMLElement
    const saveGroupBtn = document.getElementById('save-group') as HTMLElement

    form.classList.remove('sidebar__form--visible')
    groupsList.classList.remove('sidebar__groups-list--visible')
    saveContactBtn.classList.remove('sidebar__button--visible')
    addGroupBtn.classList.remove('sidebar__button--visible')
    saveGroupBtn.classList.remove('sidebar__button--visible')

    title.textContent = mode === 'add-contact' ? 'Добавление контакта' : 'Группы контактов'

    if (mode === 'add-contact') {
      form.classList.add('sidebar__form--visible')
      saveContactBtn.classList.add('sidebar__button--visible')

      const groups = this.groupService.getAllGroups()
      this.selectedGroupId = groups.length > 0 ? groups[0].id : null

      this.initGroupDropdown()
      this.setupGroupDropdownListener();
    } else {
      groupsList.classList.add('sidebar__groups-list--visible')
      addGroupBtn.classList.add('sidebar__button--visible')
      saveGroupBtn.classList.add('sidebar__button--visible')
      this.renderGroupsList()
    }

    this.sidebar.classList.add('sidebar--open')
    this.overlay.classList.add('overlay--visible')
    document.body.style.overflow = 'hidden'
  }

  private setupGroupDropdownListener(): void {
    if (this.groupDropdown) {
      this.groupDropdown.bind('change', (groupId: string) => {
        this.selectedGroupId = groupId;
      });
    }
  }

  private initGroupDropdown(): void {
    const groups = this.groupService.getAllGroups();
    const dropdownElement = document.querySelector('#contact-group');

    if (groups.length > 0) {
      this.groupDropdown = new Dropdown('#contact-group');
      this.groupDropdown.dataItems(groups);
      this.selectedGroupId = groups[0].id;
      this.setupGroupDropdownListener();
    } else if (dropdownElement) {
      dropdownElement.innerHTML = `
      <div class="dropdown__selected dropdown__selected--empty">
        Нет созданных групп
      </div>
    `;
      dropdownElement.classList.add('dropdown--disabled');
    }
  }

  private closeSidebar(): void {
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'left' && e.propertyName !== 'right') return

      document.body.style.overflow = ''
      this.sidebar.removeEventListener('transitionend', handleTransitionEnd)
    }

    this.sidebar.addEventListener('transitionend', handleTransitionEnd)
    this.sidebar.classList.remove('sidebar--open')
    this.overlay.classList.remove('overlay--visible')
  }

  private saveContact(): void {
    const nameInput = document.getElementById('person-name') as HTMLInputElement
    const phoneInput = document.getElementById('phone-number') as HTMLInputElement
    const nameError = nameInput.nextElementSibling as HTMLElement
    const phoneError = phoneInput.nextElementSibling as HTMLElement
    const saveButton = document.getElementById('save-contact')!
    const isEditing = saveButton.dataset.editingId !== undefined
    const contactId = saveButton.dataset.editingId

    this.resetValidationErrors()

    let isValid = true

    const groups = this.groupService.getAllGroups()
    if (groups.length === 0) {
      this.toaster.show({
        type: 'error',
        message: 'Сначала создайте группу.'
      })
      this.closeSidebar()
      this.openSidebar('groups')
      return
    }

    if (!this.selectedGroupId) {
      this.toaster.show({
        type: 'error',
        message: 'Пожалуйста, выберите группу'
      })
      isValid = false
    }

    if (!nameInput.value.trim()) {
      nameInput.classList.add('input-error')
      nameInput.parentElement?.classList.add('has-error')
      nameError.textContent = 'Поле является обязательным'
      nameError.style.display = 'block'
      isValid = false
    }

    const phoneValue = phoneInput.value
    const phoneDigits = phoneValue.replace(/\D/g, '')

    if (!phoneValue.trim()) {
      phoneInput.classList.add('input-error')
      phoneInput.parentElement?.classList.add('has-error')
      phoneError.textContent = 'Поле является обязательным'
      phoneError.style.display = 'block'
      isValid = false
    } else if (phoneDigits.length > 0 && phoneDigits.length < 11) {
      phoneInput.classList.add('input-error')
      phoneInput.parentElement?.classList.add('has-error')
      phoneError.textContent = 'Введите корректный номер телефона'
      phoneError.style.display = 'block'
      isValid = false
    }

    if (!isValid) {
      return
    }

    try {
      const contactData = {
        name: nameInput.value.trim(),
        phone: phoneDigits,
        groupId: this.selectedGroupId || ''
      }

      if (isEditing && contactId) {
        this.contactService.updateContact(contactId, contactData)
        this.toaster.show({
          type: 'success',
          message: 'Контакт успешно обновлен'
        })
      } else {
        if (this.contactService.hasContactWithPhone(contactData.phone)) {
          phoneInput.classList.add('input-error')
          phoneInput.parentElement?.classList.add('has-error')
          phoneError.textContent = 'Такой номер уже существует'
          phoneError.style.display = 'block'
          phoneInput.focus()
          this.toaster.show({
            type: 'error',
            message: 'Такой номер уже существует'
          })
          return
        }

        this.contactService.addContact(contactData)
        this.toaster.show({
          type: 'success',
          message: 'Контакт успешно добавлен'
        })
      }

      nameInput.value = ''
      phoneInput.value = ''
      this.selectedGroupId = groups.length > 0 ? groups[0].id : null
      delete saveButton.dataset.editingId
      saveButton.textContent = 'Сохранить'

      this.closeSidebar()
      this.checkEmptyState()

    } catch (error) {
      if (error instanceof Error) {
        this.toaster.show({
          type: 'error',
          message: error.message
        })
      }
    }
  }

  private resetValidationErrors(): void {
    document.querySelectorAll('.sidebar__form-group').forEach(group => {
      group.classList.remove('has-error')
      const errorElement = group.querySelector('.sidebar__form-group__error') as HTMLElement | null
      if (errorElement) {
        errorElement.textContent = ''
        errorElement.style.display = 'none'
      }
    })

    document.querySelectorAll('.input').forEach(input => {
      input.classList.remove('input-error')
    })
  }

  private checkEmptyState(): void {
    const contactsList = document.getElementById('contacts-list')!
    const contacts = this.contactService.getContacts()

    if (contacts.length === 0) {
      contactsList.innerHTML = '<p class="empty-message">Список контактов пуст</p>'
    } else {
      this.renderContacts()
    }
  }

  private renderContacts(): void {
    const contactsList = document.getElementById('contacts-list')!
    contactsList.innerHTML = ''

    const groupsWithContacts = this.groupService.getAllGroups()
      .filter(group => this.contactService.getContactsByGroup(group.id).length > 0)

    if (groupsWithContacts.length === 0) {
      contactsList.innerHTML = '<p class="empty-message">Список контактов пуст</p>'
      return
    }

    groupsWithContacts.forEach(group => {
      const groupContacts = this.contactService.getContactsByGroup(group.id)

      const groupElement = document.createElement('div')
      groupElement.className = 'contacts-group'
      groupElement.innerHTML = `
      <div class="contacts-group__header">
        <h3 class="contacts-group__title">${group.name}</h3>
        <svg class="contacts-group__chevron" width='24' height='24'>
          <use href="/sprite.svg#icon-chevron"></use>
        </svg>
      </div>
      <div class="contacts-group__content">
        ${groupContacts.map(contact => this.createContactElement(contact)).join('')}
      </div>
    `

      const header = groupElement.querySelector('.contacts-group__header')!
      header.addEventListener('click', () => {
        groupElement.classList.toggle('contacts-group--open')
      })

      contactsList.appendChild(groupElement)
    })

    document.querySelectorAll('.contact__edit-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const contactId = (e.currentTarget as HTMLElement).closest('.contact')?.getAttribute('data-id')
        if (contactId) this.editContact(contactId)
      })
    })

    document.querySelectorAll('.contact__delete-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const contactId = (e.currentTarget as HTMLElement).closest('.contact')?.getAttribute('data-id')
        if (contactId) this.deleteContact(contactId)
      })
    })
  }

  private editContact(contactId: string): void {
    const contact = this.contactService.getContacts().find(c => c.id === contactId)
    if (!contact) return

    const formattedPhone = this.formatPhoneNumber(contact.phone)

    const nameInput = document.getElementById('person-name') as HTMLInputElement
    const phoneInput = document.getElementById('phone-number') as HTMLInputElement

    nameInput.value = contact.name
    phoneInput.value = formattedPhone

    if (this.groupDropdown) {
      this.groupDropdown.dataItems(this.groupService.getAllGroups());
      this.groupDropdown.selectItem(contact.groupId);
      this.selectedGroupId = contact.groupId;
    }

    this.openSidebar('add-contact')

    const saveButton = document.getElementById('save-contact')!
    saveButton.textContent = 'Обновить'

    saveButton.dataset.editingId = contactId
  }

  private deleteContact(contactId: string): void {
    this.contactService.deleteContact(contactId)
    this.checkEmptyState()
    this.toaster.show({
      type: 'success',
      message: 'Контакт успешно удален'
    })
  }

  private formatPhoneNumber(phone: string): string {
    if (!phone) return ''

    const digits = phone.replace(/\D/g, '')

    return digits.replace(
      /^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/,
      '+7 ($2) $3-$4-$5'
    )
  }

  private createContactElement(contact: Contact): string {
    const formattedPhone = this.formatPhoneNumber(contact.phone)
    return `
    <div class="contact" data-id="${contact.id}">
      <div class="contact__name">${contact.name}</div>
      <div class="contact__controls">
        <div class="contact__phone-value">${formattedPhone}</div>
        <div class="contact__action">
        <button class="contact__edit-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path opacity="0.3" d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
          </svg>
        </button>
        <button class="contact__delete-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path opacity="0.3" d="M6.66676 20.3889C6.66676 21.55 7.61676 22.5 8.77787 22.5H17.2223C18.3834 22.5 19.3334 21.55 19.3334 20.3889V7.72222H6.66676V20.3889ZM9.26343 12.8733L10.7518 11.385L13.0001 13.6228L15.2379 11.385L16.7262 12.8733L14.4884 15.1111L16.7262 17.3489L15.2379 18.8372L13.0001 16.5994L10.7623 18.8372L9.27398 17.3489L11.5118 15.1111L9.26343 12.8733ZM16.6945 4.55556L15.639 3.5H10.3612L9.30565 4.55556H5.61121V6.66667H20.389V4.55556H16.6945Z"/>
          </svg>
        </button>
        </div>
      </div>
    </div>
    `
  }
}
