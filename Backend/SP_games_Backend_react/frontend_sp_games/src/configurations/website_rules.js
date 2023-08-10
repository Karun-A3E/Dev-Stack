import React from 'react';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiGlobe } from 'react-icons/fi';
import { BsKanban, BsBarChart } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { GiLouvrePyramid } from 'react-icons/gi';


export const gridOrderImage = (props) => (
  <div>
    <img
      className="rounded-xl h-20 md:ml-3"
      src={props.ProductImage}
      alt="order-item"
    />
  </div>
);

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);




export const AdminNavLinks = [
  {
    title: 'Admin Pages',
    links: [
      {
        name: 'UISettings',
        icon: <RiContactsLine />,
      },
      {
        name: 'Data',
        icon: <FiGlobe />,
      },
    ],
  },
  {
    title: 'Charts',
    links: [
      {
        name: 'line',
        icon: <AiOutlineStock />,
      },
      {
        name: 'area',
        icon: <AiOutlineAreaChart />,
      },    
      {
        name: 'pie',
        icon: <FiPieChart />,
      }
    ],
  },
];
export const links = [
  {
    title: 'Overview',
    links: [
      {
        name: 'Overview',
        icon: <FiShoppingBag />,
        Access: "All",

      },
    ],
  },
  {
    title: 'Pages',
    links: [
      {
        name: 'Search',
        icon: <AiOutlineShoppingCart />,
        Access: "All",

      }
    ],
  }
];

export const MemberNavlinks = [
  {
    title: 'Overview',
    links: [
      {
        name: 'Overview',
        icon: <FiShoppingBag />,
        Access: "All",

      },
    ],
  },
  {
    title: 'Pages',
    links: [
      {
        name: 'Search',
        icon: <AiOutlineShoppingCart />,
        Access: "All",

      },
      {
        name: 'Settings',
        icon: <RiContactsLine />,
        Access: "Member",
      }
    ],
  }
];
export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];


export const contextMenuItems = [
  'AutoFit',
  'AutoFitAll',
  'SortAscending',
  'SortDescending',
  'Copy',
  'Edit',
  'Delete',
  'Save',
  'Cancel',
  'PdfExport',
  'ExcelExport',
  'CsvExport',
  'FirstPage',
  'PrevPage',
  'LastPage',
  'NextPage',
];


export const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
  },
  {
    img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
  },
  {
    img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    title: 'Books',
  },
  {
    img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
  },
  {
    img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
  },
  {
    img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
  },
  {
    img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
  },
];

export const generateRandomColor = () => {
  // Generate random light shades of R, G, and B values
  const r = Math.floor(Math.random() * 150) + 100; // R: 100-249
  const g = Math.floor(Math.random() * 150) + 100; // G: 100-249
  const b = Math.floor(Math.random() * 150) + 100; // B: 100-249

  // Convert RGB values to a hex color code
  const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  return color;
};