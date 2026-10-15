import type { NavItem } from "@/types";

export const primaryNav: NavItem[] = [
  { label: "Roofing", to: "/roofing" },
  { label: "Gutters", to: "/gutters" },
  { label: "Siding", to: "/siding" },
  { label: "Windows", to: "/windows" },
  { label: "Masonry", to: "/masonry" },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "Special Offers", to: "/special-offers" },
      { label: "Pay My Bill", to: "/billpay", external: true },
      { label: "Financing", to: "/financing" },
      { label: "Warranties", to: "/warranties" },
      { label: "Visualizer", to: "/visualizer", external: true },
      { label: "Refer a Friend", to: "/refer-a-friend" },
      { label: "Customer Reviews", to: "/reviews" },
      { label: "Sales Careers", to: "/careers/sales" },
      { label: "Blog", to: "/blog" },
      { label: "Contact Us", to: "/free-estimate" },
      { label: "Commercial Projects", to: "/commercial-projects" },
    ],
  },
];
