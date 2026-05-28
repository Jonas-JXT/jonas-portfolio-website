import type { AppId } from './searchIndex'

export interface MenuItem {
  label: string
  shortcut?: string
  disabled?: boolean
  separator?: boolean
}

export interface AppMenu {
  label: string
  items: MenuItem[]
}

export interface AppMenuConfig {
  appId: AppId
  appName: string
  menus: AppMenu[]
}

const commonWindowMenu: AppMenu = {
  label: 'Window',
  items: [
    { label: 'Minimize', shortcut: '⌘M', disabled: true },
    { label: 'Zoom', disabled: true },
    { separator: true, label: '' },
    { label: 'Bring All to Front', disabled: true },
  ],
}

const commonHelpMenu: AppMenu = {
  label: 'Help',
  items: [{ label: 'Search', disabled: true }, { separator: true, label: '' }, { label: 'Help Center', disabled: true }],
}

export const menuConfigs: Record<AppId, AppMenuConfig> = {
  finder: {
    appId: 'finder',
    appName: 'Finder',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Finder Window', shortcut: '⌘N', disabled: true },
          { label: 'New Folder', shortcut: '⇧⌘N', disabled: true },
          { separator: true, label: '' },
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Select All', shortcut: '⌘A', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'as Icons', shortcut: '⌘1', disabled: true },
          { label: 'as List', shortcut: '⌘2', disabled: true },
          { label: 'as Columns', shortcut: '⌘3', disabled: true },
        ],
      },
      { label: 'Go', items: [{ label: 'Home', shortcut: '⇧⌘H', disabled: true }, { label: 'Desktop', shortcut: '⇧⌘D', disabled: true }] },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  safari: {
    appId: 'safari',
    appName: 'Safari',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Window', shortcut: '⌘N', disabled: true },
          { label: 'New Tab', shortcut: '⌘T', disabled: true },
          { separator: true, label: '' },
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Copy', shortcut: '⌘C', disabled: true }, { label: 'Select All', shortcut: '⌘A', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'Show Toolbar', disabled: true },
          { label: 'Show Status Bar', disabled: true },
          { separator: true, label: '' },
          { label: 'Reload Page', shortcut: '⌘R', disabled: true },
        ],
      },
      {
        label: 'History',
        items: [
          { label: 'Back', shortcut: '⌘[', disabled: true },
          { label: 'Forward', shortcut: '⌘]', disabled: true },
          { separator: true, label: '' },
          { label: 'Clear History…', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  mail: {
    appId: 'mail',
    appName: 'Mail',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Message', shortcut: '⌘N', disabled: true },
          { separator: true, label: '' },
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Copy', shortcut: '⌘C', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'Show Mailboxes', disabled: true },
          { label: 'Show Toolbar', disabled: true },
        ],
      },
      {
        label: 'Mailbox',
        items: [
          { label: 'Get All New Mail', shortcut: '⇧⌘N', disabled: true },
          { separator: true, label: '' },
          { label: 'Mark All Messages as Read', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  ical: {
    appId: 'ical',
    appName: 'Calculator',
    menus: [
      {
        label: 'File',
        items: [{ label: 'Close', shortcut: '⌘W', disabled: true }],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Copy', shortcut: '⌘C', disabled: true },
          { label: 'Paste', shortcut: '⌘V', disabled: true },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Basic', disabled: true },
          { label: 'Scientific', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  addressbook: {
    appId: 'addressbook',
    appName: 'Address Book',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Card', shortcut: '⌘N', disabled: true },
          { separator: true, label: '' },
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Copy', shortcut: '⌘C', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'Card and Columns', disabled: true },
          { label: 'Card Only', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  ichat: {
    appId: 'ichat',
    appName: 'iChat',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Chat', shortcut: '⌘N', disabled: true },
          { separator: true, label: '' },
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Copy', shortcut: '⌘C', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'Show Buddy List', disabled: true },
          { label: 'Show Transcript', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  itunes: { appId: 'itunes', appName: 'iTunes', menus: [{ label: 'File', items: [{ label: 'Close', shortcut: '⌘W', disabled: true }] }, commonWindowMenu] },
  iphoto: {
    appId: 'iphoto',
    appName: 'iPhoto',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'Export…', disabled: true },
          { separator: true, label: '' },
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Select All', shortcut: '⌘A', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'Thumbnails', disabled: true },
          { label: 'Show Title', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  photobooth: { appId: 'photobooth', appName: 'Photo Booth', menus: [{ label: 'File', items: [{ label: 'Close', shortcut: '⌘W', disabled: true }] }, commonWindowMenu] },
  imovie: { appId: 'imovie', appName: 'iMovie', menus: [{ label: 'File', items: [{ label: 'Close', shortcut: '⌘W', disabled: true }] }, commonWindowMenu] },
  garageband: { appId: 'garageband', appName: 'GarageBand', menus: [{ label: 'File', items: [{ label: 'Close', shortcut: '⌘W', disabled: true }] }, commonWindowMenu] },
  sysprefs: {
    appId: 'sysprefs',
    appName: 'System Preferences',
    menus: [
      {
        label: 'File',
        items: [
          { label: 'Close Window', shortcut: '⌘W', disabled: true },
        ],
      },
      { label: 'Edit', items: [{ label: 'Select All', shortcut: '⌘A', disabled: true }] },
      {
        label: 'View',
        items: [
          { label: 'Show All', disabled: true },
          { separator: true, label: '' },
          { label: 'Appearance', disabled: true },
          { label: 'Displays', disabled: true },
        ],
      },
      commonWindowMenu,
      commonHelpMenu,
    ],
  },
  trash: { appId: 'trash', appName: 'Trash', menus: [] },
}

export const finderMenuConfig = menuConfigs.finder
