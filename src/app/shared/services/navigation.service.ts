import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
    id?: string;
    title?: string;
    description?: string;
    type: string;       // Possible values: link/dropDown/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    constructor() {
    }

    defaultMenu: IMenuItem[] = [
        {
            name: 'Ana Sayfa',
            description: '',
            type: 'link',
            icon: 'i-Bar-Chart',
            state: '/dashboard'
        },
        {
            name: 'Stok Kartları',
            description: '',
            type: 'link',
            icon: 'i-Posterous',
            state: '/storeditems'
        },
        {
            name: 'Stok Hareketleri',
            description: '',
            type: 'link',
            icon: 'i-Sync',
            state: '/stockhistory'
        },
        {
            name: 'Kategoriler',
            description: 'Bu bölümden stoklar ile ilgili raporlar alabilirsiniz.',
            type: 'link',
            icon: 'i-File-Horizontal-Text',
            state: '/categories'
        },
        {
            name: 'Ayarlar',
            description: '',
            type: 'dropDown',
            icon: 'i-Data-Settings',
            sub: [
                { icon: 'i-Building', name: 'Firmalar', state: '/companies', type: 'link' },
                { icon: 'i-Map2', name: 'Depolar', state: '/locations', type: 'link' },
                { icon: 'i-Sync', name: 'Stok Transfer Tipleri', state: '/stockTransTypes', type: 'link' },
                { icon: 'i-Over-Time-2', name: 'Zaman Aşımı Tanımları', state: '/timeouts', type: 'link' },
                { icon: 'i-Tag-3', name: 'Markalar', state: '/brands', type: 'link' },
                { icon: 'i-Tag-4', name: 'Ürün Tipleri', state: '/itemtypes', type: 'link' },
                { icon: 'i-Tag-2', name: 'Ürün Türleri', state: '/itemkinds', type: 'link' },
                { icon: 'i-Map2', name: 'Lokasyon Tipleri', state: '/locationTypes', type: 'link' },
                { icon: 'i-Add-User', name: 'Kullanıcı Hesapları', state: '/sub-users', type: 'link' },
            ]
        },
        /* {
            name: 'UI kits',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
            type: 'dropDown',
            icon: 'i-Library',
            sub: [
                { icon: 'i-Bell', name: 'Alerts', state: '/uikits/alerts', type: 'link' },
                { icon: 'i-Split-Horizontal-2-Window', name: 'Accordions', state: '/uikits/accordions', type: 'link' },
                { icon: 'i-Medal-2', name: 'Badges', state: '/uikits/badges', type: 'link' },
                {
                    icon: 'i-Arrow-Right-in-Circle',
                    name: 'Buttons',
                    type: 'dropDown',
                    sub: [
                        { name: 'Bootstrap Buttons', state: '/uikits/buttons', type: 'link' },
                        { name: 'Loding Buttons', state: '/uikits/buttons-loading', type: 'link' }
                    ]
                },
                { icon: 'i-ID-Card', name: 'Cards', state: '/uikits/cards', type: 'link' },
                { icon: 'i-Line-Chart-2', name: 'Cards metrics', state: '/uikits/cards-metrics', type: 'link' },
                { icon: 'i-Credit-Card', name: 'Cards widget', state: '/uikits/cards-widget', type: 'link' },
                { icon: 'i-Full-Cart', name: 'Cards ecommerce', state: '/uikits/cards-ecommerce', type: 'link' },
                { icon: 'i-Duplicate-Window', name: 'Modals', state: '/uikits/modals', type: 'link' },
                { icon: 'i-Speach-Bubble-3', name: 'Popover', state: '/uikits/popover', type: 'link' },
                { icon: 'i-Like', name: 'Rating', state: '/uikits/rating', type: 'link' },
                { icon: 'i-Loading-3', name: 'Loaders', state: '/uikits/loaders', type: 'link' },
            ]
        },
        {
            name: 'Apps',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'dropDown',
            icon: 'i-Computer-Secure',
            sub: [
                { icon: 'i-Add-File', name: 'Invoice Builder', state: '/invoice', type: 'link' },
                { icon: 'i-Email', name: 'Inbox', state: '/inbox', type: 'link' },
                { icon: 'i-Speach-Bubble-3', name: 'Chat', state: '/chat', type: 'link' },
                { icon: 'i-Calendar', name: 'Calendar', state: '/calendar', type: 'link' },
            ]
        },
        {
            name: 'Forms',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'dropDown',
            icon: 'i-File-Clipboard-File--Text',
            sub: [
                { icon: 'i-File-Clipboard-Text--Image', name: 'Basic components', state: '/forms/basic', type: 'link' },
                { icon: 'i-Split-Vertical', name: 'Form layouts', state: '/forms/layouts', type: 'link' },
                { icon: 'i-Receipt-4', name: 'Input Group', state: '/forms/input-group', type: 'link' },
                { icon: 'i-File-Edit', name: 'Input Mask', state: '/forms/input-mask', type: 'link' },
                { icon: 'i-Tag-2', name: 'Tag Input', state: '/forms/tag-input', type: 'link' },
                { icon: 'i-Width-Window', name: 'Wizard', state: '/forms/wizard', type: 'link' },
                { icon: 'i-Crop-2', name: 'Image Cropper', state: '/forms/img-cropper', type: 'link' },
            ]
        },
        {
            name: 'Data Tables',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'dropDown',
            icon: 'i-File-Horizontal-Text',
            sub: [
                { icon: 'i-File-Horizontal-Text', name: 'List', state: '/tables/list', type: 'link' },
                { icon: 'i-Full-View-Window', name: 'Fullscreen', state: '/tables/full', type: 'link' },
                { icon: 'i-Code-Window', name: 'Paging', state: '/tables/paging', type: 'link' },
                { icon: 'i-Filter-2', name: 'Filter', state: '/tables/filter', type: 'link' },
            ]
        },
        {
            name: 'Sessions',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'dropDown',
            icon: 'i-Administrator',
            sub: [
                { icon: 'i-Add-User', name: 'Sign up', state: '/sessions/signup', type: 'link' },
                { icon: 'i-Checked-User', name: 'Sign in', state: '/sessions/signin', type: 'link' },
                { icon: 'i-Find-User', name: 'Forgot', state: '/sessions/forgot', type: 'link' }
            ]
        },
        {
            name: 'Profil',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'link',
            icon: 'i-Administrator',
            state: '/profile'
        },
        {
            name: 'Icons',
            description: '600+ premium icons',
            type: 'link',
            icon: 'i-Cloud-Sun',
            state: '/icons/iconsmind'
        },
        {
            name: 'Others',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'dropDown',
            icon: 'i-Double-Tap',
            sub: [
                { icon: 'i-Error-404-Window', name: 'Not found', state: '/others/404', type: 'link' }
            ]
        },
        {
            name: 'Doc',
            type: 'extLink',
            tooltip: 'Documentation',
            icon: 'i-Safe-Box1',
            state: 'http://demos.ui-lib.com/gull-doc'
        }*/
    ];
    
    userMenu: IMenuItem[] = [
        {
            name: 'Ana Sayfa',
            description: '',
            type: 'link',
            icon: 'i-Bar-Chart',
            state: '/dashboard'
        },
        {
            name: 'Stok Kartları',
            description: '',
            type: 'link',
            icon: 'i-Posterous',
            state: '/storeditems'
        },
        {
            name: 'Stok Hareketleri',
            description: '',
            type: 'link',
            icon: 'i-Sync',
            state: '/stockhistory'
        },
        {
            name: 'Kategoriler',
            description: 'Bu bölümden stoklar ile ilgili raporlar alabilirsiniz.',
            type: 'link',
            icon: 'i-File-Horizontal-Text',
            state: '/categories'
        },
    ];


    // sets iconMenu as default;
    // admin Menu
    menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
    // navigation component has subscribed to this Observable
    menuItems$ = this.menuItems.asObservable();
    // user Menu
    userMenuItems = new BehaviorSubject<IMenuItem[]>(this.userMenu);
    // navigation component has subscribed to this Observable
    userMenuItems$ = this.userMenuItems.asObservable();

    // You can customize this method to supply different menu for
    // different user type.
    // publishNavigationChange(menuType: string) {
    //   switch (userType) {
    //     case 'admin':
    //       this.menuItems.next(this.adminMenu);
    //       break;
    //     case 'user':
    //       this.menuItems.next(this.userMenu);
    //       break;
    //     default:
    //       this.menuItems.next(this.defaultMenu);
    //   }
    // }
}
