import {
  SortDirection
} from '../enums';
import {
  AccordionDataInterface,
  JewelleryCareInterface
} from '../interfaces';

export const COMPANY_NAME = {
  part1: 'Style It by',
  part2: 'Rose'
} as const;

export const JEWELLERY_CARE: readonly JewelleryCareInterface[] = [
  {
    icon: 'fa-solid fa-dumbbell',
    description: 'Take off when working out'
  },
  {
    icon: 'fa-solid fa-bed',
    description: 'Remove while sleeping'
  },
  {
    icon: 'fa-solid fa-gem',
    description: 'Clean and Polish with soft cloth'
  },
  {
    icon: 'fa-solid fa-shower',
    description: 'Avoid contact with water'
  },
  {
    icon: 'fa-solid fa-spray-can-sparkles',
    description: 'Avoid direct contact with perfume'
  },
  {
    icon: 'fa-solid fa-box',
    description: 'Store jewellery in bag or box'
  }
] as const;

export const FAQS: readonly AccordionDataInterface[] = [
  {
    header: `How to track my order?`,
    body: `Once your order has been shipped, you will be provided with a tracking number & tracking link, you can check out the order page on our website and click directly on the tracking link to see the status of your order.`,
  },
  {
    header: `When are orders shipped?`,
    body: `Dispatch time of our products are 2 to 4 working business days after placing an order and dispatch time of our customised jewellery are 6 to 7 working business days.`,
  },
  {
    header: `What is the self pick up option on our website? Where can I find this option?`,
    body: `You can opt for the self-pick up option if you are nearby us and don’t wanna pay for shipping but want to pick up your order by yourself. Don’t worry there are no charges for the self-pick up option. When you check out your cart there will be a button called ‘self pick up’, you can avail self pick-up by choosing that option.`,
  },
  {
    header: `What is the location for self pick up?`,
    body: `Once you have selected the self pick up option we will be reaching out to you personally to inform you about the location.`,
  },
  {
    header: `Do we offer customization or personalization options?`,
    body: `For custom jewellery pieces you have to personally reach out to us via Instagram dm or contact us through WhatsApp and share your vision for the custom jewellery piece, also do check out our ‘customization’ page on our website showcasing some custom jewellery made by us.`,
  },
  {
    header: `Need more help?`,
    body: `Have questions beyond our FAQs? Reach out to us. Simply drop us a message clearly indicating your issue or questions, and we’ll get back to you promptly with the answers you need. Please make sure to share as much information as you can with us so that it will be useful for us to better assist you because your satisfaction is our priority`
  }
] as const;

export const DEFAULT_PAGE_INDEX: number = 0;

export const DEFAULT_PAGE_SIZE: number = 12;

export const BASE_SORTABLE_COLUMN = {
  whenCreated: 'whenCreated',
  whenLastUpdated: 'whenLastUpdated',
} as const;

export const DEFAULT_SORT_COLUMN: keyof typeof BASE_SORTABLE_COLUMN = BASE_SORTABLE_COLUMN.whenCreated;

export const DEFAULT_SORT_DIRECTION: SortDirection  = SortDirection.desc;
