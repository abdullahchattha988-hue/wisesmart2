// Shared full menu used by all three Wise Mart locations.
// Tone (intro copy) varies per location.

export type PriceRow =
  | { name: string; price: string; desc?: string }
  | { name: string; small: string; large: string; desc?: string }
  | { name: string; half: string; whole: string; desc?: string };

export type MenuSection = {
  id: string;
  title: string;
  intro?: string;
  columns: ("name" | "small" | "large" | "half" | "whole" | "price" | "desc")[];
  rows: PriceRow[];
  footnote?: string;
};

export const PIZZA_TOPPINGS = [
  "Pepperoni", "Green Pepper", "Hot Peppers", "Onions", "Sausage",
  "Meatballs", "Ham", "Jalapeno Peppers", "Mushrooms", "Sweet Peppers",
  "Black Olive", "Pineapple", "Tomato", "Ground Beef", "Bacon", "Extra Cheese",
];

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "pizza",
    title: "Pizza",
    intro: "Hand-stretched dough, rich tomato sauce, real mozzarella.",
    columns: ["name", "small", "large", "desc"],
    footnote: `Additional toppings — Small (12"): $1.50 each · Large (16"): $2.00 each. Available: ${PIZZA_TOPPINGS.join(" · ")}`,
    rows: [
      { name: "Cheese Pizza", small: "$12.99", large: "$15.99", desc: "Hand-stretched crust with rich tomato sauce and melted mozzarella" },
      { name: "One Topping", small: "$14.49", large: "$17.99", desc: "Your choice of one premium topping on our signature cheese base" },
      { name: "Hawaiian", small: "$15.99", large: "$18.99", desc: "Sweet pineapple and savory ham — a timeless, crowd-pleasing combination" },
      { name: "The Vegi", small: "$16.99", large: "$21.99", desc: "Loaded with garden-fresh vegetables on a generous mozzarella base" },
      { name: "Breakfast", small: "$19.99", large: "$24.99", desc: "Eggs, sausage, and morning favorites baked on a fresh pizza crust" },
      { name: "5 Delicious", small: "$17.99", large: "$21.99", desc: "Five of our most beloved toppings combined on one expertly crafted pizza" },
      { name: "Meat Lovers", small: "$17.99", large: "$21.99", desc: "Pepperoni, sausage, bacon, ham, and ground beef — no compromises" },
      { name: "Deluxe", small: "$19.99", large: "$23.99", desc: "Premium toppings, generous portions, bold flavors — the full experience" },
    ],
  },
  {
    id: "chicken",
    title: "Famous Fried Chicken",
    intro: "Hand-breaded, double-fried, served hot with fresh dinner rolls.",
    columns: ["name", "price"],
    rows: [
      { name: "2 Pieces · 1 Roll", price: "$6.99" },
      { name: "3 Pieces · 1 Roll", price: "$8.49" },
      { name: "4 Pieces · 2 Rolls", price: "$9.99" },
      { name: "5 Pieces · 2 Rolls", price: "$12.99" },
      { name: "8 Pieces · 3 Rolls", price: "$14.99" },
      { name: "10 Pieces · 3 Rolls", price: "$18.99" },
      { name: "12 Pieces · 4 Rolls", price: "$21.99" },
      { name: "20 Pieces · 5 Rolls", price: "$34.99" },
      { name: "Chicken Wing (each)", price: "$1.69" },
      { name: "Drumstick (each)", price: "$1.99" },
      { name: "Thigh (each)", price: "$2.79" },
      { name: "Breast (each)", price: "$3.75" },
      { name: "Extra Roll", price: "$0.59" },
    ],
  },
  {
    id: "combos",
    title: "Combo Meals",
    intro: "Includes your choice of side and a fountain drink.",
    columns: ["name", "price"],
    rows: [
      { name: "Chicken Tenders (4 pc)", price: "$14.99" },
      { name: "Chicken Nuggets (10 pc)", price: "$14.99" },
      { name: "Regular Wings (10 pc)", price: "$14.99" },
      { name: "Hot Wings (10 pc)", price: "$14.99" },
      { name: "Shrimp Basket", price: "$14.99" },
    ],
  },
  {
    id: "subs",
    title: "Hot Subs",
    intro: "Freshly baked bread. Half or whole.",
    columns: ["name", "half", "whole"],
    rows: [
      { name: "Steak", half: "$11.49", whole: "$15.49" },
      { name: "Steak & Cheese", half: "$11.99", whole: "$15.99" },
      { name: "Steak & Mushroom", half: "$12.99", whole: "$16.99" },
      { name: "Steak & Green Peppers", half: "$12.99", whole: "$16.99" },
      { name: "Chicken Cheese Steak", half: "$11.99", whole: "$15.99" },
      { name: "Chicken Tender Sub", half: "$11.99", whole: "$15.99" },
      { name: "Italian Steak", half: "$13.99", whole: "$17.99" },
      { name: "Pizza Steak", half: "$12.99", whole: "$16.99" },
      { name: "Pizza Burger", half: "$12.99", whole: "$16.99" },
      { name: "Cheeseburger Sub", half: "$11.99", whole: "$15.99" },
      { name: "Bacon Cheeseburger Sub", half: "$12.99", whole: "$16.99" },
      { name: "Hamburger Sub", half: "$11.49", whole: "$15.49" },
      { name: "Fish Sub", half: "$11.99", whole: "$15.99" },
      { name: "Meatball & Cheese", half: "$11.99", whole: "$15.99" },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    intro: "Crisp, cold, and made to order. Dressings: Blue Cheese · Ranch · Italian (included) · French ($0.50).",
    columns: ["name", "price"],
    rows: [
      { name: "Chicken Salad", price: "$9.99" },
      { name: "Tuna Salad", price: "$9.99" },
      { name: "Chef Salad", price: "$9.99" },
      { name: "Chicken Tender Salad", price: "$11.99" },
      { name: "Garden Salad", price: "$8.99" },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    columns: ["name", "small", "large"],
    rows: [
      { name: "French Fries", small: "$4.99", large: "$7.99" },
      { name: "Cheese Fries", small: "$5.99", large: "$8.99" },
      { name: "Potato Wedges", small: "$5.99", large: "$8.99" },
      { name: "Onion Rings", small: "$5.99", large: "$8.99" },
      { name: "Broccoli Bites", small: "$7.99", large: "$13.99" },
      { name: "Mozzarella Sticks", small: "$7.99", large: "$13.99" },
    ],
  },
  {
    id: "breakfast",
    title: "Breakfast",
    intro: "Served fresh every morning.",
    columns: ["name", "price"],
    rows: [
      { name: "Breakfast Pizza Slice", price: "$3.69" },
      { name: "Breakfast Sandwiches", price: "$5.99" },
      { name: "Jumbo Sausage", price: "$5.99" },
    ],
  },
];

export const LOCATION_INTROS: Record<string, string> = {
  sharptown:
    "Our flagship Sharptown location is home to our signature pizza program and beloved fried chicken — perfect for family nights and big gatherings.",
  "east-new-market":
    "East New Market serves up hearty, generous portions — built for working appetites and big family meals.",
  vienna:
    "Vienna is our fresh, light-forward kitchen — wholesome salads, brisk breakfasts, and lighter takes on every favorite.",
};
