"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { restaurantConfig as CONTACT } from "./config/restaurant";

import {
  ArrowRight,
  ArrowUp,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  QrCode,
  Search,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";

/* ============================================================================
 * DASTARKHWAN — Flagship Phase 2 Luxury Dining Experience
 * Brand: Premium Modern Pakistani Luxury | Tagline: GOOD FOOD. GREAT MOMENTS.
 * Palette: Deep Emerald (#0B3D2E), Antique Gold (#D4AF37), Warm Ivory (#F8F6ED), Charcoal (#1A1A1A)
 * ============================================================================ */

type MenuCategoryId = "all" | "shuruaat" | "signatures" | "biryani" | "meetha";
type HallPreference = "Main Emerald Hall" | "The Royal Courtyard" | "VIP Private Alcove";
type TimeSlotOption =
  | "Lunch (12:30 PM – 3:30 PM)"
  | "Early Dinner (6:30 PM – 8:15 PM)"
  | "Prime Dinner (8:30 PM – 10:30 PM)"
  | "Midnight Feast (10:45 PM – 1:00 AM)";
type InquiryType = "Private Banquet" | "Bespoke Catering" | "Press & Editorial";

interface MenuItem {
  id: string;
  category: Exclude<MenuCategoryId, "all">;
  categoryLabel: string;
  title: string;
  tagline: string;
  pricePkr: number;
  spiceLevel: 1 | 2 | 3;
  spiceLabel: "Mild" | "Medium" | "Spicy";
  servingSize: string;
  description: string;
  ingredients: string[];
  image: string;
  imageAlt: string;
}

interface AmbienceItem {
  id: string;
  title: string;
  subtitle: string;
  hallPreference: HallPreference;
  capacity: string;
  sensoryNote: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface ImpressionItem {
  id: string;
  quote: string;
  author: string;
  initials: string;
  city: string;
  occasion: string;
}

interface ReservationConfirmation {
  reference: string;
  fullName: string;
  phone: string;
  guests: string;
  date: string;
  timeSlot: TimeSlotOption;
  hallPreference: HallPreference;
  notes: string;
}

interface InquiryConfirmation {
  reference: string;
  type: InquiryType;
  name: string;
  email: string;
}

const MENU_CATEGORIES: { id: MenuCategoryId; label: string; subLabel: string }[] = [
  { id: "all", label: "All Dishes", subLabel: "12 Selections" },
  { id: "shuruaat", label: "Starters & Kebabs", subLabel: "Charcoal Grill" },
  { id: "signatures", label: "Chef's Signatures", subLabel: "Slow-Cooked Classics" },
  { id: "biryani", label: "Biryani & Pulao", subLabel: "Aromatic Rice" },
  { id: "meetha", label: "Desserts", subLabel: "Sweet Finishes" },
];

const MENU_ITEMS: MenuItem[] = [
  // Starters & Kebabs (3)
  {
    id: "lucknowi-galouti-kebab",
    category: "shuruaat",
    categoryLabel: "Starter",
    title: "Lucknowi Galouti Kebab",
    tagline: "Melt-in-mouth charcoal medallions",
    pricePkr: 3450,
    spiceLevel: 2,
    spiceLabel: "Medium",
    servingSize: "4 Pieces • Serves 2",
    description:
      "Finely minced mutton medallions smoked over hardwood charcoal and served atop crisp golden flatbread with fresh mint chutney.",
    ingredients: ["Prime mutton", "Roasted spices", "Crisp flatbread", "Mint chutney"],
    image: "/images/dish-galouti.jpg",
    imageAlt: "Four seared Lucknowi Galouti Kebabs plated on golden flatbread with fresh herbs",
  },
  {
    id: "peshawari-charsi-chapli",
    category: "shuruaat",
    categoryLabel: "Starter",
    title: "Peshawari Chapli Kebab",
    tagline: "Crispy iron-skillet classic",
    pricePkr: 3150,
    spiceLevel: 3,
    spiceLabel: "Spicy",
    servingSize: "2 Patties • Serves 2",
    description:
      "Hand-minced beef rib-eye patties pan-seared on cast iron with crushed coriander seeds, pomegranate, vine tomato, and green chilies.",
    ingredients: ["Beef rib-eye", "Crushed coriander", "Vine tomato", "Green chili"],
    image: "/images/dish-chapli.jpg",
    imageAlt: "Charred spiced minced meat patties topped with seared tomato and fresh herbs",
  },
  {
    id: "angara-reshmi-seekh",
    category: "shuruaat",
    categoryLabel: "Starter",
    title: "Silky Chicken Seekh Kebabs",
    tagline: "Grilled to perfection",
    pricePkr: 3250,
    spiceLevel: 2,
    spiceLabel: "Medium",
    servingSize: "4 Skewers • Serves 2",
    description:
      "Tender minced chicken skewers brushed with saffron butter over live oak embers and finished with roasted pistachios.",
    ingredients: ["Tender chicken", "Green cardamom", "Butter glaze", "Roasted pistachio"],
    image: "/images/dish-seekh.jpg",
    imageAlt: "Charcoal-grilled spiced meat skewers steaming over dark slate with herbs and lime",
  },

  // Chef's Signatures (3)
  {
    id: "nalli-nihari",
    category: "signatures",
    categoryLabel: "Signature",
    title: "24-Hour Nalli Nihari",
    tagline: "A rich heritage tradition",
    pricePkr: 4850,
    spiceLevel: 2,
    spiceLabel: "Medium",
    servingSize: "Slow Shank • Serves 2",
    description:
      "Marrow-rich lamb shank slow-simmered for twenty-four hours in a velvet spice reduction, finished with ginger juliennes and fresh lime.",
    ingredients: ["Lamb shank", "Slow-simmered gravy", "Fresh ginger", "Artisan bread"],
    image: "/images/dish-nihari.jpg",
    imageAlt: "Slow-simmered lamb shank Nihari garnished with crisp ginger strips and warm bread",
  },
  {
    id: "shinwari-karahi",
    category: "signatures",
    categoryLabel: "Signature",
    title: "Royal Shinwari Karahi",
    tagline: "Wok-seared over high flame",
    pricePkr: 5600,
    spiceLevel: 3,
    spiceLabel: "Spicy",
    servingSize: "750g Wok • Serves 2–3",
    description:
      "Fresh tender mutton cuts flash-cooked in a traditional iron wok with sweet Roma tomatoes, cracked black pepper, and green chilies.",
    ingredients: ["Fresh mutton", "Roma tomatoes", "Black pepper", "Garlic naan"],
    image: "/images/dish-karahi.jpg",
    imageAlt: "Rich sizzling mutton karahi served in a hammered copper wok with fresh herbs",
  },
  {
    id: "chinioti-dum-kunna",
    category: "signatures",
    categoryLabel: "Signature",
    title: "Clay-Pot Mutton Kunna",
    tagline: "Sealed earthen slow braise",
    pricePkr: 4950,
    spiceLevel: 2,
    spiceLabel: "Medium",
    servingSize: "Clay Pot • Serves 2",
    description:
      "Succulent mutton shoulder gently braised inside an earthen clay pot with roasted black cumin, nutmeg, and pure saffron.",
    ingredients: ["Mutton shoulder", "Black cumin", "Pure saffron", "Clay pot"],
    image: "/images/dish-kunna.jpg",
    imageAlt: "Slow-braised spiced mutton curry served warm in an authentic clay pot",
  },

  // Biryani & Pulao (3)
  {
    id: "awadhi-gosht-biryani",
    category: "biryani",
    categoryLabel: "Biryani & Rice",
    title: "Awadhi Mutton Biryani",
    tagline: "A timeless classic",
    pricePkr: 4250,
    spiceLevel: 2,
    spiceLabel: "Medium",
    servingSize: "Sealed Pot • Serves 2",
    description:
      "Extra-long aged basmati rice layered with yogurt-marinated mutton, caramelized onions, and pure saffron, unsealed tableside.",
    ingredients: ["Aged basmati", "Saffron milk", "Crisp onions", "Mint raita"],
    image: "/images/dish-awadhi-biryani.jpg",
    imageAlt: "Aromatic saffron basmati biryani layered with tender meat and fresh herbs",
  },
  {
    id: "dehlvi-yakhni-pulao",
    category: "biryani",
    categoryLabel: "Biryani & Rice",
    title: "Classic Yakhni Pulao",
    tagline: "Delicately spiced lamb rice",
    pricePkr: 3850,
    spiceLevel: 1,
    spiceLabel: "Mild",
    servingSize: "Copper Dish • Serves 2",
    description:
      "Fragrant long-grain rice gently steamed in rich twelve-hour lamb stock steeped with whole coriander, fennel, and warm spices.",
    ingredients: ["Slow lamb stock", "Whole spices", "Aged basmati", "Whipped yogurt"],
    image: "/images/dish-dehlvi-pulao.jpg",
    imageAlt: "Fragrant golden lamb pulao steamed with whole spices and toasted nuts",
  },
  {
    id: "sindhi-mutton-biryani",
    category: "biryani",
    categoryLabel: "Biryani & Rice",
    title: "Sindhi Mutton Biryani",
    tagline: "Bold, tangy & aromatic",
    pricePkr: 4100,
    spiceLevel: 3,
    spiceLabel: "Spicy",
    servingSize: "Sealed Pot • Serves 2",
    description:
      "A beloved regional celebration rice layered with tangy dried plums, fresh garden mint, golden potatoes, and spiced tender mutton.",
    ingredients: ["Tangy plums", "Garden mint", "Golden potatoes", "Roasted cumin raita"],
    image: "/images/dish-sindhi-biryani.jpg",
    imageAlt: "Vibrant spiced Pakistani biryani with herbs, saffron rice, and tender meat",
  },

  // Desserts (3)
  {
    id: "zafrani-shahi-tukray",
    category: "meetha",
    categoryLabel: "Dessert",
    title: "Saffron Shahi Tukray",
    tagline: "A royal sweet indulgence",
    pricePkr: 2450,
    spiceLevel: 1,
    spiceLabel: "Mild",
    servingSize: "Double Portion • Serves 2",
    description:
      "Crisp golden brioche steeped in warm saffron-cardamom syrup and topped with velvety reduced milk cream and roasted pistachios.",
    ingredients: ["Golden brioche", "Reduced milk cream", "Saffron", "Toasted pistachio"],
    image: "/images/dish-shahi-tukray.jpg",
    imageAlt: "Golden saffron-soaked Shahi Tukray topped with creamy milk reduction and pistachios",
  },
  {
    id: "peshawari-pistachio-kulfi",
    category: "meetha",
    categoryLabel: "Dessert",
    title: "Peshawari Pistachio Kulfi",
    tagline: "Rich & creamy cardamom chill",
    pricePkr: 1950,
    spiceLevel: 1,
    spiceLabel: "Mild",
    servingSize: "Two Molds • Serves 1–2",
    description:
      "Slow-simmered traditional ice cream churned with fragrant green cardamom, salted roasted pistachios, and dried rose petals.",
    ingredients: ["Slow milk reduction", "Salted pistachio", "Rosewater", "Cardamom"],
    image: "/images/dish-kulfi.jpg",
    imageAlt: "Creamy traditional pistachio kulfi garnished with crushed nuts and rose petals",
  },
  {
    id: "badami-gajar-halwa",
    category: "meetha",
    categoryLabel: "Dessert",
    title: "Warm Carrot & Almond Halwa",
    tagline: "Caramelized winter comfort",
    pricePkr: 2250,
    spiceLevel: 1,
    spiceLabel: "Mild",
    servingSize: "Warm Copper Dish • Serves 2",
    description:
      "Sweet winter red carrots slowly caramelized in fresh farm milk and clarified butter, crowned with toasted almonds and warm cream crumble.",
    ingredients: ["Sweet red carrots", "Fresh cream crumble", "Toasted almonds", "Cardamom"],
    image: "/images/dish-halwa.jpg",
    imageAlt: "Rich caramelized carrot halwa dessert topped with slivered almonds",
  },
];

const AMBIENCE_GALLERY: AmbienceItem[] = [
  {
    id: "royal-courtyard",
    title: "The Royal Courtyard",
    subtitle: "Open-Air Garden Dining",
    hallPreference: "The Royal Courtyard",
    capacity: "Up to 44 Guests • Open Air",
    sensoryNote: "Coastal evening breeze, limestone colonnades & glowing brass lanterns",
    description:
      "Framed by hand-carved stone arches, lush night-blooming jasmine, and coastal sea breeze, our courtyard transitions seamlessly from relaxed lunch to candlelit dinner.",
    image: "/images/ambience-courtyard.jpg",
    imageAlt: "Candlelit open-air courtyard dining tables framed by limestone arches and brass lanterns",
  },
  {
    id: "charcoal-dum-pit",
    title: "The Open Fire Kitchen",
    subtitle: "Live Charcoal Grill",
    hallPreference: "Main Emerald Hall",
    capacity: "Chef's Counter • 8 Seats",
    sensoryNote: "Live hardwood embers, sizzle platters & roasted spice aromas",
    description:
      "At the heart of our culinary theatre, master chefs grill hand-crafted seekh skewers over glowing embers and tend slow-sealed copper pots.",
    image: "/images/ambience-dumpit.jpg",
    imageAlt: "Charcoal-seared kebabs sizzling on a hot skillet with charred green chilies and herbs",
  },
  {
    id: "emerald-dining-salon",
    title: "Emerald Dining Salon",
    subtitle: "Main Dining Room",
    hallPreference: "Main Emerald Hall",
    capacity: "Up to 68 Guests • Velvet Seating",
    sensoryNote: "Plush emerald banquettes, brushed antique brass & warm candlelight",
    description:
      "Deep emerald velvet seating and sleek marble tables bathed in soft brass pendant glow—crafted for unhurried conversation and evening elegance.",
    image: "/images/hero-salon.jpg",
    imageAlt: "Plush dark emerald green restaurant dining hall with gold accents and warm table candlelight",
  },
  {
    id: "tableside-cloche",
    title: "Tableside Cloche Service",
    subtitle: "Signature Presentation",
    hallPreference: "Main Emerald Hall",
    capacity: "Every Signature Entrée",
    sensoryNote: "Warm hammered brass domes unveiled with delicate aromatic smoke",
    description:
      "Inspired by our golden cloche crest, signature entrees arrive beneath polished antique-gold domes, lifted tableside to reveal fresh saffron and herb aromas.",
    image: "/images/cloche-emblem.png",
    imageAlt: "Burnished golden cloche dome crest over dark emerald stone background",
  },
  {
    id: "the-spice-vault",
    title: "Whole Spice Conservatory",
    subtitle: "Single-Origin Pantry",
    hallPreference: "Main Emerald Hall",
    capacity: "Curated Spice Library",
    sensoryNote: "Sun-dried Kashmiri saffron, whole cardamom & freshly toasted blends",
    description:
      "Each morning begins with dry-toasting whole saffron, black cardamom, and mountain spices sourced directly across Pakistan, freshly ground per service.",
    image: "/images/ambience-spicevault.jpg",
    imageAlt: "Vibrant red saffron threads arranged inside an ornamental handcrafted bowl",
  },
  {
    id: "private-family-alcoves",
    title: "Private Family Suites",
    subtitle: "VIP Dining Rooms",
    hallPreference: "VIP Private Alcove",
    capacity: "8 to 18 Guests • Dedicated Host",
    sensoryNote: "Intimate privacy screens, bespoke menus & dedicated table steward",
    description:
      "Enclosed behind sculpted arches with dedicated hospitality staff and direct valet access—designed for family celebrations and private hosting.",
    image: "/images/ambience-alcoves.jpg",
    imageAlt: "Grand arched palace courtyard framing intimate private dining spaces",
  },
];

const IMPRESSIONS: ImpressionItem[] = [
  {
    id: "imp-1",
    quote:
      "An extraordinary dining experience! The flavours, candlelit ambience and heartfelt hospitality brought a fresh sense of occasion to our family celebration.",
    author: "Zainab & Tariq Mahmood",
    initials: "ZT",
    city: "Sample guest review",
    occasion: "Anniversary Dinner",
  },
  {
    id: "imp-2",
    quote:
      "The 24-Hour Nalli Nihari walks an unforgettable balance—deeply traditional flavour yet refined and light. Hosting international guests in the VIP suite was effortless from start to finish.",
    author: "Ambassador S. Qureshi",
    initials: "SQ",
    city: "Islamabad & Geneva",
    occasion: "Diplomatic Hosting",
  },
  {
    id: "imp-3",
    quote:
      "Every detail speaks to quiet elegance—emerald velvet seating, warm candlelight, freshly ground spices, and Saffron Shahi Tukray that remained memorable for days.",
    author: "Mehreen Raza",
    initials: "MR",
    city: "Sample guest review",
    occasion: "Family Celebration",
  },
];

/* ============================================================================
 * Validation Helpers (Modern Web Guidance: user-invalid fallback & ARIA sync)
 * ============================================================================ */

function getCustomValidityMessage(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const v = control.validity;
  const label = control.dataset.label || "This field";
  if (v.valueMissing) {
    if (control.tagName === "SELECT") return `Please choose an option for ${label}.`;
    return `${label} is required.`;
  }
  if (v.typeMismatch) {
    if (control.getAttribute("type") === "email") return "Please enter a valid email address (for example, name@domain.com).";
    return `Please enter a valid ${label.toLowerCase()}.`;
  }
  if (v.tooShort) {
    return `${label} must be at least ${control.getAttribute("minlength")} characters.`;
  }
  if (v.rangeUnderflow) {
    return `Please select today or an upcoming dining date.`;
  }
  if (v.patternMismatch) {
    return "Please enter a valid 10–15 digit WhatsApp or phone number.";
  }
  return control.validationMessage || `${label} needs attention.`;
}

function attachUserInvalidFallback(form: HTMLFormElement, getInteracted: (el: Element) => boolean, markInteracted: (el: Element) => void) {
  const hasNative = typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("selector(:user-invalid)");
  const update = (el: EventTarget | null) => {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) return;
    if (hasNative) return;
    if (el.type === "radio" && el.name) {
      const group = form.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(el.name)}"]`);
      const anyInteracted = [...group].some((r) => getInteracted(r));
      const groupInvalid = anyInteracted && !el.validity.valid;
      group.forEach((r) => r.classList.toggle("user-invalid-fallback", groupInvalid));
      return;
    }
    el.classList.toggle("user-invalid-fallback", getInteracted(el) && !el.validity.valid);
  };

  const onBlur = (e: Event) => {
    if (e.target instanceof Element) {
      markInteracted(e.target);
      update(e.target);
    }
  };
  const onChange = (e: Event) => {
    if (e.target instanceof HTMLSelectElement || (e.target instanceof HTMLInputElement && (e.target.type === "radio" || e.target.type === "date"))) {
      markInteracted(e.target);
      update(e.target);
    }
  };
  const onInput = (e: Event) => {
    if (e.target instanceof Element && getInteracted(e.target)) {
      update(e.target);
    }
  };
  const onInvalid = (e: Event) => {
    if (e.target instanceof Element) {
      markInteracted(e.target);
      update(e.target);
    }
  };
  const onReset = () => {
    form.querySelectorAll(".user-invalid-fallback").forEach((node) => node.classList.remove("user-invalid-fallback"));
  };

  form.addEventListener("blur", onBlur, true);
  form.addEventListener("change", onChange);
  form.addEventListener("input", onInput);
  form.addEventListener("invalid", onInvalid, true);
  form.addEventListener("reset", onReset);

  return () => {
    form.removeEventListener("blur", onBlur, true);
    form.removeEventListener("change", onChange);
    form.removeEventListener("input", onInput);
    form.removeEventListener("invalid", onInvalid, true);
    form.removeEventListener("reset", onReset);
  };
}

function getIsUserInvalid(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, interactedMap: WeakSet<Element>): boolean {
  if (typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("selector(:user-invalid)")) {
    try {
      return el.matches(":user-invalid");
    } catch {
      return el.classList.contains("user-invalid-fallback") || (interactedMap.has(el) && !el.validity.valid);
    }
  }
  return el.classList.contains("user-invalid-fallback") || (interactedMap.has(el) && !el.validity.valid);
}

/* ============================================================================
 * Reusable Master Brand Cloche Emblem SVG (Phase 1 Exact Geometry)
 * ============================================================================ */

function DastarkhwanLogo({
  size = "md",
  showWordmark = true,
  showTagline = true,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  showTagline?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `dk-gold-${uid}`;
  const iconWidth = size === "sm" ? 42 : size === "lg" ? 72 : 52;
  const iconHeight = size === "sm" ? 32 : size === "lg" ? 56 : 40;

  return (
    <span className={`dk-logo dk-logo--${size}`}>
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="dk-logo-svg"
      >
        <defs>
          <linearGradient id={gradId} x1="12" y1="6" x2="108" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F4E3A1" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7820" />
          </linearGradient>
        </defs>

        {/* Three symmetrical aromatic steam plumes */}
        <path
          d="M48 25C44 20 43 13 48 9C51 14 50 20 48 25Z"
          fill={`url(#${gradId})`}
          opacity="0.92"
        />
        <path
          d="M60 22C55 15 56 7 61 2C65 8 63 16 60 22Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M72 25C76 20 77 13 72 9C69 14 70 20 72 25Z"
          fill={`url(#${gradId})`}
          opacity="0.92"
        />

        {/* Crown knob & collar */}
        <circle cx="60" cy="27" r="4" fill={`url(#${gradId})`} />
        <rect x="53" y="31" width="14" height="2.4" rx="1.2" fill={`url(#${gradId})`} />

        {/* Arched dome with Phase 1 sculpted crescent highlight cutout */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25 65C25 45.118 40.67 34 60 34C79.33 34 95 45.118 95 65H25ZM40 59C43 46 53 40 65 39C53 43 46 50 44 59H40Z"
          fill={`url(#${gradId})`}
        />

        {/* Curved luxury charger platter base */}
        <path
          d="M12 69C31 75 89 75 108 69C97 78 78 81 60 81C42 81 23 78 12 69Z"
          fill={`url(#${gradId})`}
        />
        <path d="M24 85H96" stroke={`url(#${gradId})`} strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      </svg>

      {showWordmark && (
        <span className="dk-logo-text">
          <span className="dk-wordmark">{CONTACT.name}</span>
          {showTagline && (
            <span className="dk-tagline">
              <span className="dk-tagline-rule" aria-hidden="true" />
              GOOD FOOD. GREAT MOMENTS.
              <span className="dk-tagline-rule" aria-hidden="true" />
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/* ============================================================================
 * Spice Indicator Helper (Accessible: text + visual 1-3 flame glyphs)
 * ============================================================================ */

function SpiceRating({ level, label }: { level: 1 | 2 | 3; label: string }) {
  return (
    <span className="dk-spice-pill" aria-label={`Spice level: ${level} out of 3, ${label}`}>
      <span className="dk-spice-flames" aria-hidden="true">
        {[1, 2, 3].map((idx) => (
          <Flame
            key={idx}
            size={13}
            strokeWidth={1.6}
            className={idx <= level ? "dk-flame-active" : "dk-flame-muted"}
          />
        ))}
      </span>
      <span>{label}</span>
    </span>
  );
}

/* ============================================================================
 * Accessible Native Modal Dialog Shell (MWG Top-Layer Pattern)
 * ============================================================================ */

function useModalController(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closingRef = useRef(false);

  const supportsTopLayerExit = useCallback(() => {
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return false;
    return CSS.supports("transition-behavior: allow-discrete") && CSS.supports("selector(:modal)");
  }, []);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closingRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || supportsTopLayerExit()) {
      dialog.close();
      return;
    }

    closingRef.current = true;
    dialog.setAttribute("data-closing", "");
    const finish = () => {
      dialog.removeAttribute("data-closing");
      closingRef.current = false;
      if (dialog.open) dialog.close();
    };
    dialog.addEventListener("transitionend", finish, { once: true });
    dialog.addEventListener("transitioncancel", finish, { once: true });
    window.setTimeout(finish, 320);
  }, [supportsTopLayerExit]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.removeAttribute("data-closing");
      closingRef.current = false;
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      requestClose();
    }
  }, [isOpen, requestClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.removeAttribute("data-closing");
      closingRef.current = false;
      onClose();
    };

    const handleCancel = (e: Event) => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !supportsTopLayerExit()) {
        e.preventDefault();
        requestClose();
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);

    // Light-dismiss fallback only where native `closedby="any"` is unavailable
    let downInside = false;
    const supportsClosedBy = "closedBy" in HTMLDialogElement.prototype;

    const onPointerDown = (e: PointerEvent) => {
      if (e.target !== dialog) {
        downInside = true;
        return;
      }
      const r = dialog.getBoundingClientRect();
      downInside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.target === dialog && !downInside) {
        const r = dialog.getBoundingClientRect();
        const outside =
          e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        if (outside) requestClose();
      }
    };

    if (!supportsClosedBy) {
      dialog.addEventListener("pointerdown", onPointerDown);
      dialog.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
      if (!supportsClosedBy) {
        dialog.removeEventListener("pointerdown", onPointerDown);
        dialog.removeEventListener("pointerup", onPointerUp);
      }
    };
  }, [onClose, requestClose, supportsTopLayerExit]);

  return { dialogRef, requestClose };
}

/* ============================================================================
 * Main Flagship Single-File Application Component
 * ============================================================================ */

export default function DastarkhwanApp() {
  /* ---------------- Navigation & Mobile Drawer State ---------------- */
  const drawerRef = useRef<HTMLDialogElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    const drawer = drawerRef.current;
    if (!drawer || !drawer.open) return;
    drawer.scrollTo({ left: drawer.scrollWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.setTimeout(() => {
      if (drawer.open) drawer.close();
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 280);
  }, []);

  const openDrawer = useCallback(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (!drawer.open) drawer.showModal();
    setDrawerOpen(true);

    // Fallback jump-scroll for browsers without scroll-initial-target
    if (typeof CSS === "undefined" || !CSS.supports("scroll-initial-target", "nearest")) {
      drawer.style.scrollSnapType = "none";
      drawer.scrollLeft = drawer.scrollWidth;
      requestAnimationFrame(() => {
        drawer.style.scrollSnapType = "";
        requestAnimationFrame(() => {
          drawer.scrollTo({ left: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        });
      });
    } else {
      drawer.scrollTo({ left: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const handleClose = () => setDrawerOpen(false);
    drawer.addEventListener("close", handleClose);

    // Swipe-shut observer on backdrop spacer sentinel
    const navPanel = drawer.querySelector(".dk-drawer-panel");
    let observer: IntersectionObserver | undefined;
    if (navPanel && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting && drawer.open) {
              drawer.close();
            }
          }
        },
        { root: drawer, threshold: 0.05 }
      );
      observer.observe(navPanel);
    }

    // Fallback backdrop progress where scroll-driven CSS animation-timeline isn't supported
    const supportsTimeline = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    const handleScroll = () => {
      if (supportsTimeline) return;
      const maxScroll = Math.max(1, drawer.scrollWidth - drawer.clientWidth);
      const progress = Math.max(0, Math.min(1, 1 - drawer.scrollLeft / maxScroll));
      drawer.style.setProperty("--drawer-backdrop", (progress * 0.72).toFixed(3));
    };

    if (!supportsTimeline) {
      drawer.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      drawer.removeEventListener("close", handleClose);
      observer?.disconnect();
      if (!supportsTimeline) {
        drawer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const navigateToSection = useCallback(
    (hash: string) => {
      closeDrawer();
      const target = document.querySelector(hash);
      if (target instanceof HTMLElement) {
        window.setTimeout(() => {
          target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
          });
        }, 60);
      }
    },
    [closeDrawer]
  );

  /* ---------------- Curated Menu Tabs & Search State ---------------- */
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const [fadeState, setFadeState] = useState({ start: false, end: false });

  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    const updateFades = () => {
      const overflow = el.scrollWidth > el.clientWidth + 2;
      setFadeState({
        start: overflow && el.scrollLeft > 8,
        end: overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
      });
    };
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = MENU_CATEGORIES.length;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % count;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + count) % count;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = count - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const nextCat = MENU_CATEGORIES[nextIndex];
      setActiveCategory(nextCat.id);
      const btns = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      const nextBtn = btns?.[nextIndex];
      nextBtn?.focus();
      nextBtn?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    }
  };

  const filteredMenu = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCat = activeCategory === "all" || item.category === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  /* ---------------- Guest Reviews Carousel State ---------------- */
  const [reviewIndex, setReviewIndex] = useState(0);
  const currentReview = IMPRESSIONS[reviewIndex] || IMPRESSIONS[0];

  /* ---------------- Phase 3 QR Ordering Preview Modal ---------------- */
  const [qrPreviewOpen, setQrPreviewOpen] = useState(false);
  const { dialogRef: qrDialogRef, requestClose: closeQrDialog } = useModalController(qrPreviewOpen, () =>
    setQrPreviewOpen(false)
  );

  /* ---------------- Ambience Lightbox Modal State ---------------- */
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const activeAmbience = lightboxIndex !== null ? AMBIENCE_GALLERY[lightboxIndex] : null;
  const { dialogRef: lightboxDialogRef, requestClose: closeLightbox } = useModalController(
    lightboxIndex !== null,
    () => setLightboxIndex(null)
  );

  /* ---------------- Reservation Form State & Accessible Validation ---------------- */
  const todayIso = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const [resForm, setResForm] = useState<{
    fullName: string;
    phone: string;
    guests: string;
    date: string;
    timeSlot: TimeSlotOption | "";
    hallPreference: HallPreference;
    notes: string;
  }>({
    fullName: "",
    phone: "",
    guests: "",
    date: todayIso,
    timeSlot: "Prime Dinner (8:30 PM – 10:30 PM)",
    hallPreference: "Main Emerald Hall",
    notes: "",
  });

  const resFormRef = useRef<HTMLFormElement | null>(null);
  const resInteractedRef = useRef<WeakSet<Element>>(new WeakSet());
  const [resErrors, setResErrors] = useState<Record<string, string>>({});
  const [resLiveSummary, setResLiveSummary] = useState("");
  const resSummaryTimer = useRef<number | undefined>(undefined);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationConfirmation | null>(null);

  const { dialogRef: confirmDialogRef, requestClose: closeConfirmDialog } = useModalController(
    confirmedReservation !== null,
    () => setConfirmedReservation(null)
  );

  const syncResField = useCallback((el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const fieldName = el.name || el.id;
    const isUserInvalid = getIsUserInvalid(el, resInteractedRef.current);
    const hasError = isUserInvalid && !el.validity.valid;

    el.setAttribute("aria-invalid", hasError ? "true" : "false");

    const baseDescribed = el.dataset.baseDescribedby || "";
    const errorId = el.dataset.errorId || "";
    const tokens = [baseDescribed, hasError ? errorId : ""].filter(Boolean);
    if (tokens.length > 0) {
      el.setAttribute("aria-describedby", tokens.join(" "));
    } else {
      el.removeAttribute("aria-describedby");
    }

    setResErrors((prev) => {
      const nextMsg = hasError ? getCustomValidityMessage(el) : "";
      if ((prev[fieldName] || "") === nextMsg) return prev;
      return { ...prev, [fieldName]: nextMsg };
    });
  }, []);

  useEffect(() => {
    const form = resFormRef.current;
    if (!form) return;

    const cleanupFallback = attachUserInvalidFallback(
      form,
      (el) => resInteractedRef.current.has(el),
      (el) => resInteractedRef.current.add(el)
    );

    const handleInteract = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) {
        if (e.type === "blur" || e.type === "change" || e.type === "invalid") {
          resInteractedRef.current.add(t);
        }
        window.requestAnimationFrame(() => syncResField(t));
      }
    };

    form.addEventListener("blur", handleInteract, true);
    form.addEventListener("change", handleInteract);
    form.addEventListener("input", handleInteract);
    form.addEventListener("invalid", handleInteract, true);

    return () => {
      cleanupFallback();
      form.removeEventListener("blur", handleInteract, true);
      form.removeEventListener("change", handleInteract);
      form.removeEventListener("input", handleInteract);
      form.removeEventListener("invalid", handleInteract, true);
      window.clearTimeout(resSummaryTimer.current);
    };
  }, [syncResField]);

  const handleReserveAmbienceArea = useCallback(
    (hall: HallPreference) => {
      setResForm((prev) => ({ ...prev, hallPreference: hall }));
      closeLightbox();
      window.setTimeout(() => {
        const section = document.getElementById("reservations");
        section?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
        document.getElementById("res-fullname")?.focus({ preventScroll: true });
      }, 180);
    },
    [closeLightbox]
  );

  const handleReservationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const controls = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")
    );

    controls.forEach((ctrl) => {
      resInteractedRef.current.add(ctrl);
      if (typeof CSS !== "undefined" && !CSS.supports("selector(:user-invalid)") && !ctrl.validity.valid) {
        ctrl.classList.add("user-invalid-fallback");
      }
    });

    const isValid = form.checkValidity();

    controls.forEach((ctrl) => syncResField(ctrl));

    if (!isValid) {
      const firstInvalid = controls.find((c) => !c.validity.valid);
      firstInvalid?.focus();

      const invalidCount = controls.filter((c) => !c.validity.valid && c.type !== "radio").length;
      window.clearTimeout(resSummaryTimer.current);
      resSummaryTimer.current = window.setTimeout(() => {
        setResLiveSummary(
          `Reservation form needs attention in ${Math.max(1, invalidCount)} field${invalidCount > 1 ? "s" : ""}. Focus moved to ${firstInvalid?.dataset.label || "the first field"}.`
        );
      }, 500);
      return;
    }

    setResLiveSummary("");
    const randomCode = `DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setConfirmedReservation({
      reference: randomCode,
      fullName: resForm.fullName.trim(),
      phone: resForm.phone.trim(),
      guests: resForm.guests,
      date: resForm.date,
      timeSlot: (resForm.timeSlot || "Prime Dinner (8:30 PM – 10:30 PM)") as TimeSlotOption,
      hallPreference: resForm.hallPreference,
      notes: resForm.notes.trim(),
    });
  };

  /* ---------------- Concierge Inquiry Form State & Validation ---------------- */
  const [inqForm, setInqForm] = useState<{
    type: InquiryType;
    name: string;
    email: string;
    message: string;
  }>({
    type: "Private Banquet",
    name: "",
    email: "",
    message: "",
  });
  const inqFormRef = useRef<HTMLFormElement | null>(null);
  const inqInteractedRef = useRef<WeakSet<Element>>(new WeakSet());
  const [inqErrors, setInqErrors] = useState<Record<string, string>>({});
  const [inqLiveSummary, setInqLiveSummary] = useState("");
  const inqSummaryTimer = useRef<number | undefined>(undefined);
  const [inqConfirmation, setInqConfirmation] = useState<InquiryConfirmation | null>(null);

  const syncInqField = useCallback((el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const fieldName = el.name || el.id;
    const isUserInvalid = getIsUserInvalid(el, inqInteractedRef.current);
    const hasError = isUserInvalid && !el.validity.valid;

    el.setAttribute("aria-invalid", hasError ? "true" : "false");
    const baseDescribed = el.dataset.baseDescribedby || "";
    const errorId = el.dataset.errorId || "";
    const tokens = [baseDescribed, hasError ? errorId : ""].filter(Boolean);
    if (tokens.length > 0) el.setAttribute("aria-describedby", tokens.join(" "));
    else el.removeAttribute("aria-describedby");

    setInqErrors((prev) => {
      const nextMsg = hasError ? getCustomValidityMessage(el) : "";
      if ((prev[fieldName] || "") === nextMsg) return prev;
      return { ...prev, [fieldName]: nextMsg };
    });
  }, []);

  useEffect(() => {
    const form = inqFormRef.current;
    if (!form) return;

    const cleanupFallback = attachUserInvalidFallback(
      form,
      (el) => inqInteractedRef.current.has(el),
      (el) => inqInteractedRef.current.add(el)
    );

    const handleInteract = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) {
        if (e.type === "blur" || e.type === "change" || e.type === "invalid") {
          inqInteractedRef.current.add(t);
        }
        window.requestAnimationFrame(() => syncInqField(t));
      }
    };

    form.addEventListener("blur", handleInteract, true);
    form.addEventListener("change", handleInteract);
    form.addEventListener("input", handleInteract);
    form.addEventListener("invalid", handleInteract, true);

    return () => {
      cleanupFallback();
      form.removeEventListener("blur", handleInteract, true);
      form.removeEventListener("change", handleInteract);
      form.removeEventListener("input", handleInteract);
      form.removeEventListener("invalid", handleInteract, true);
      window.clearTimeout(inqSummaryTimer.current);
    };
  }, [syncInqField]);

  const handleInquirySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const controls = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")
    );

    controls.forEach((ctrl) => {
      inqInteractedRef.current.add(ctrl);
      if (typeof CSS !== "undefined" && !CSS.supports("selector(:user-invalid)") && !ctrl.validity.valid) {
        ctrl.classList.add("user-invalid-fallback");
      }
    });

    const isValid = form.checkValidity();
    controls.forEach((ctrl) => syncInqField(ctrl));

    if (!isValid) {
      const firstInvalid = controls.find((c) => !c.validity.valid);
      firstInvalid?.focus();
      window.clearTimeout(inqSummaryTimer.current);
      inqSummaryTimer.current = window.setTimeout(() => {
        setInqLiveSummary(
          `Concierge form contains validation errors. Please review ${firstInvalid?.dataset.label || "highlighted fields"}.`
        );
      }, 500);
      return;
    }

    setInqLiveSummary("");
    const refCode = `DEMO-INQ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setInqConfirmation({
      reference: refCode,
      type: inqForm.type,
      name: inqForm.name.trim(),
      email: inqForm.email.trim(),
    });
    setInqForm({ type: inqForm.type, name: "", email: "", message: "" });
    form.reset();
  };

  /* ============================================================================
   * Render Complete Luxury Experience
   * ============================================================================ */

  return (
    <div className="dk-root">
      {/* Embedded Scoped Design System Stylesheet for Single-File Portability */}
      <style>{`
        :root {
          --dk-emerald: #0B3D2E;
          --dk-emerald-deep: #082F23;
          --dk-emerald-soft: #135A44;
          --dk-gold: #D4AF37;
          --dk-gold-soft: #F2D779;
          --dk-ivory: #F8F6ED;
          --dk-ivory-warm: #EFEBD9;
          --dk-charcoal: #1A1A1A;
          --dk-charcoal-muted: #4A4A46;
          --dk-danger: #B9382C;
          --dk-danger-ivory: #8F2218;
          --dk-font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
          --dk-font-sans: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @property --drawer-backdrop {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 96px;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }

        .dk-root {
          background-color: var(--dk-emerald);
          color: var(--dk-ivory);
          font-family: var(--dk-font-sans);
          line-height: 1.65;
          min-height: 100vh;
          overflow-x: clip;
        }

        .dk-font-display {
          font-family: var(--dk-font-display);
        }

        /* Embossed Metallic 24K Gold Foil Accent Typography */
        .dk-gold-foil {
          color: #D4AF37;
          background: linear-gradient(135deg, #F0DFA8 0%, #D4AF37 48%, #A57A1D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dk-visually-hidden:not(:focus):not(:active) {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        .dk-skip-link {
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 200;
          background: var(--dk-gold);
          color: var(--dk-charcoal);
          padding: 12px 20px;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
        }

        :focus-visible {
          outline: 2px solid var(--dk-gold);
          outline-offset: 3px;
        }

        /* ---------------- Master Brand Logo ---------------- */
        .dk-logo {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }
        .dk-logo--lg {
          flex-direction: column;
          text-align: center;
          gap: 10px;
        }
        .dk-logo-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .dk-wordmark {
          font-family: var(--dk-font-display);
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--dk-gold);
          font-size: 1.15rem;
          line-height: 1.1;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .dk-logo--lg .dk-wordmark {
          font-size: 1.65rem;
          letter-spacing: 0.26em;
        }
        .dk-logo--sm .dk-wordmark {
          font-size: 0.98rem;
          letter-spacing: 0.18em;
        }
        .dk-tagline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.56rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          color: rgba(248, 246, 237, 0.78);
          text-transform: uppercase;
          white-space: nowrap;
        }
        .dk-tagline-rule {
          display: inline-block;
          width: 14px;
          height: 1px;
          background: rgba(212, 175, 55, 0.55);
        }
        @media (max-width: 479px) {
          .dk-logo--sm {
            gap: 10px;
          }
          .dk-logo--sm .dk-logo-svg {
            width: 34px;
            height: auto;
            flex-shrink: 0;
          }
          .dk-logo--sm .dk-wordmark {
            font-size: 0.88rem;
            letter-spacing: 0.14em;
          }
          .dk-logo--sm .dk-tagline {
            font-size: 0.45rem;
            letter-spacing: 0.13em;
            gap: 5px;
          }
          .dk-logo--sm .dk-tagline-rule {
            width: 8px;
          }
        }

        /* ---------------- Architectural Surface Motifs ---------------- */
        .dk-jali-surface {
          background-color: #082F23;
          background-image:
            radial-gradient(ellipse at top center, rgba(212, 175, 55, 0.1) 0%, rgba(8, 47, 35, 0) 58%),
            radial-gradient(ellipse at bottom center, rgba(4, 22, 16, 0.88) 0%, rgba(8, 47, 35, 0) 65%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96' fill='none'%3E%3Cpath d='M48 6C60 22 74 30 74 48C74 66 60 74 48 90C36 74 22 66 22 48C22 30 36 22 48 6Z' stroke='%23D4AF37' stroke-opacity='0.085' stroke-width='1'/%3E%3Cpath d='M0 48C14 38 20 26 20 0M96 48C82 38 76 26 76 0M0 48C14 58 20 70 20 96M96 48C82 58 76 70 76 96' stroke='%23D4AF37' stroke-opacity='0.07' stroke-width='1'/%3E%3Ccircle cx='48' cy='48' r='6' stroke='%23D4AF37' stroke-opacity='0.08' stroke-width='0.9'/%3E%3C/svg%3E");
          background-size: auto, auto, 96px 96px;
        }

        /* ---------------- Header & Utility Bar ---------------- */
        .dk-utility-bar {
          background-color: #041912;
          border-bottom: 1px solid rgba(212, 175, 55, 0.22);
          font-size: 0.74rem;
          letter-spacing: 0.06em;
          color: rgba(248, 246, 237, 0.88);
        }

        .dk-sticky-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          background-color: rgba(4, 26, 19, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.32);
        }

        .dk-nav-link {
          position: relative;
          display: inline-block;
          font-size: 0.74rem;
          font-weight: 500;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          white-space: nowrap;
          color: rgba(248, 246, 237, 0.9);
          padding: 8px 2px;
          transition: color 0.22s ease;
        }
        .dk-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2px;
          height: 1px;
          background: var(--dk-gold);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.24s ease;
        }
        .dk-nav-link:hover,
        .dk-nav-link:focus-visible {
          color: var(--dk-gold);
        }
        .dk-nav-link:hover::after,
        .dk-nav-link:focus-visible::after {
          transform: scaleX(1);
        }

        /* ---------------- Buttons (Antique Burnished Royal Gold — Warm Bronze Depth) ---------------- */
        .dk-btn-gold {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 46px;
          padding: 11px 26px;
          white-space: nowrap;
          background: linear-gradient(160deg, #DFBF6E 0%, #C6962C 48%, #9B7119 100%);
          color: #101612;
          font-family: var(--dk-font-sans);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          border: 1px solid rgba(235, 209, 138, 0.8);
          border-radius: 9999px;
          box-shadow: 0 8px 26px rgba(176, 128, 28, 0.34), inset 0 1px 0 rgba(255, 244, 210, 0.45);
          transition: background 0.25s ease, transform 0.22s ease, box-shadow 0.25s ease;
        }
        .dk-btn-gold:hover {
          transform: translateY(-1px);
          background: linear-gradient(160deg, #E8CA7E 0%, #D4AF37 48%, #AA7E20 100%);
          box-shadow: 0 12px 30px rgba(196, 151, 44, 0.44), inset 0 1px 0 rgba(255, 248, 224, 0.65);
        }
        .dk-btn-gold:active {
          transform: translateY(1px);
        }

        .dk-btn-glass {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 46px;
          padding: 11px 24px;
          white-space: nowrap;
          background-color: rgba(4, 24, 18, 0.62);
          backdrop-filter: blur(8px);
          color: var(--dk-ivory);
          font-family: var(--dk-font-sans);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border: 1px solid rgba(212, 175, 55, 0.72);
          border-radius: 9999px;
          box-shadow: inset 0 1px 0 rgba(248, 246, 237, 0.12);
          transition: background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
        }
        .dk-btn-glass:hover {
          transform: translateY(-1px);
          background-color: rgba(198, 150, 44, 0.18);
          border-color: #DFBE6F;
          color: #EFE0B4;
          box-shadow: 0 8px 24px rgba(198, 150, 44, 0.22);
        }

        /* ---------------- Mobile Scroll-Snap Drawer (<dialog>) ---------------- */
        dialog.dk-drawer[open] {
          --drawer-width: min(84vw, 340px);
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          width: 100dvw;
          height: 100dvh;
          max-width: none;
          max-height: none;
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior: contain;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          display: grid;
          grid-template-columns: var(--drawer-width) 100%;
          animation: dk-drawer-backdrop 1s linear both;
          animation-timeline: scroll(self inline);
        }
        dialog.dk-drawer::-webkit-scrollbar {
          display: none;
        }
        dialog.dk-drawer::after {
          content: "";
          display: block;
          scroll-snap-align: end;
          scroll-initial-target: nearest;
        }
        dialog.dk-drawer::backdrop {
          background: rgba(7, 24, 18, var(--drawer-backdrop, 0.72));
          backdrop-filter: blur(4px);
          overscroll-behavior: contain;
          overflow: hidden;
        }
        @keyframes dk-drawer-backdrop {
          from { --drawer-backdrop: 0.74; }
          to { --drawer-backdrop: 0; }
        }
        .dk-drawer-panel {
          scroll-snap-align: start;
          height: 100%;
          background: var(--dk-emerald-deep);
          border-right: 1px solid rgba(212, 175, 55, 0.35);
          padding: 24px 24px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          color: var(--dk-ivory);
        }

        /* ---------------- Top-Layer Modal Dialog Transitions (Lightbox, Confirm, QR) ---------------- */
        dialog.dk-modal {
          margin: auto;
          padding: 0;
          border: 1px solid rgba(212, 175, 55, 0.45);
          border-radius: 3px;
          background: var(--dk-emerald-deep);
          color: var(--dk-ivory);
          max-width: min(92vw, 940px);
          max-height: 90dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.65);

          opacity: 0;
          transform: translateY(14px) scale(0.985);
          transition:
            opacity 0.26s ease,
            transform 0.26s ease,
            display 0.26s allow-discrete,
            overlay 0.26s allow-discrete;
        }
        dialog.dk-modal[open] {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        @starting-style {
          dialog.dk-modal[open] {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
        }
        dialog.dk-modal[data-closing] {
          opacity: 0;
          transform: translateY(10px) scale(0.985);
        }
        dialog.dk-modal::backdrop {
          background: rgba(6, 16, 12, 0.78);
          backdrop-filter: blur(5px);
          overflow: hidden;
          overscroll-behavior: contain;
          opacity: 0;
          transition:
            opacity 0.26s ease,
            display 0.26s allow-discrete,
            overlay 0.26s allow-discrete;
        }
        dialog.dk-modal[open]::backdrop {
          opacity: 1;
        }
        @starting-style {
          dialog.dk-modal[open]::backdrop {
            opacity: 0;
          }
        }
        dialog.dk-modal[data-closing]::backdrop {
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          dialog.dk-modal,
          dialog.dk-modal::backdrop {
            transform: none !important;
            transition-duration: 0.08s;
          }
        }

        /* ---------------- Scrollable Accessible Tablist ---------------- */
        .dk-tablist-wrap {
          position: relative;
        }
        .dk-tablist {
          display: flex;
          align-items: stretch;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid rgba(212, 175, 55, 0.22);
          padding-bottom: 2px;
        }
        .dk-tablist::-webkit-scrollbar {
          display: none;
        }
        .dk-tablist-wrap--fade-start .dk-tablist {
          mask-image: linear-gradient(to right, transparent, black 28px, black);
        }
        .dk-tablist-wrap--fade-end .dk-tablist {
          mask-image: linear-gradient(to right, black, black calc(100% - 28px), transparent);
        }
        .dk-tablist-wrap--fade-start.dk-tablist-wrap--fade-end .dk-tablist {
          mask-image: linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent);
        }

        .dk-tab {
          position: relative;
          flex: 0 0 auto;
          min-height: 52px;
          padding: 10px 20px;
          text-align: left;
          background: transparent;
          color: rgba(248, 246, 237, 0.82);
          border: 1px solid transparent;
          cursor: pointer;
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }
        .dk-tab:hover {
          color: var(--dk-ivory);
          background: rgba(212, 175, 55, 0.1);
        }
        .dk-tab[aria-selected="true"] {
          color: var(--dk-gold-soft);
          background: rgba(212, 175, 55, 0.16);
          border-color: rgba(212, 175, 55, 0.35);
        }
        .dk-tab[aria-selected="true"]::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 3px;
          background: linear-gradient(90deg, #D4AF37, #F2D779, #D4AF37);
        }
        @media (forced-colors: active) {
          .dk-tab[aria-selected="true"]::after {
            border-bottom: 2px solid Highlight;
          }
        }

        /* ---------------- Spice Indicator ---------------- */
        .dk-spice-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: rgba(248, 246, 237, 0.85);
        }
        .dk-spice-flames {
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .dk-flame-active {
          color: var(--dk-gold);
        }
        .dk-flame-muted {
          color: rgba(248, 246, 237, 0.24);
        }

        /* ---------------- Accessible Form Controls (:user-invalid + fallback) ---------------- */
        .dk-control {
          width: 100%;
          min-height: 48px;
          padding: 12px 15px;
          font-family: var(--dk-font-sans);
          font-size: max(1rem, 1em);
          line-height: 1.4;
          border-radius: 2px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .dk-control--search {
          padding-left: 2.75rem;
          padding-right: 2.75rem;
        }

        .dk-control--ivory {
          background-color: #FFFFFF;
          color: var(--dk-charcoal);
          border: 1px solid rgba(26, 26, 26, 0.22);
        }
        .dk-control--ivory::placeholder {
          color: #6B6B65;
        }
        .dk-control--ivory:focus {
          outline: none;
          border-color: var(--dk-emerald);
          box-shadow: 0 0 0 3px rgba(11, 61, 46, 0.14);
        }
        .dk-control--ivory:is(:user-invalid, .user-invalid-fallback) {
          border-color: var(--dk-danger-ivory);
          box-shadow: 0 0 0 3px rgba(143, 34, 24, 0.12);
        }

        .dk-control--dark {
          background-color: rgba(8, 47, 35, 0.9);
          color: var(--dk-ivory);
          border: 1px solid rgba(212, 175, 55, 0.42);
        }
        .dk-control--dark::placeholder {
          color: rgba(248, 246, 237, 0.6);
        }
        .dk-control--dark:focus {
          outline: none;
          border-color: var(--dk-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.18);
        }
        .dk-control--dark:is(:user-invalid, .user-invalid-fallback) {
          border-color: #F28B82;
          box-shadow: 0 0 0 3px rgba(242, 139, 130, 0.16);
        }

        .dk-field-error {
          display: block;
          margin-top: 6px;
          font-size: 0.79rem;
          font-weight: 500;
        }
        .dk-field-error--ivory {
          color: var(--dk-danger-ivory);
        }
        .dk-field-error--dark {
          color: #F6A59D;
        }

        .dk-radio-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 10px 14px;
          border: 1px solid rgba(26, 26, 26, 0.18);
          background: #FFFFFF;
          border-radius: 2px;
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--dk-charcoal);
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .dk-radio-card:has(input:checked) {
          border-color: var(--dk-emerald);
          background-color: rgba(11, 61, 46, 0.06);
          font-weight: 600;
        }
        .dk-radio-card--dark {
          background: rgba(7, 41, 31, 0.72);
          border-color: rgba(212, 175, 55, 0.28);
          color: var(--dk-ivory);
        }
        .dk-radio-card--dark:has(input:checked) {
          border-color: var(--dk-gold);
          background: rgba(212, 175, 55, 0.14);
        }

        .dk-card-zoom img {
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dk-card-zoom:hover img {
          transform: scale(1.045);
        }
        @media (prefers-reduced-motion: reduce) {
          .dk-card-zoom:hover img {
            transform: none;
          }
        }

        /* ---------------- Premium visual refinement ---------------- */
        .dk-root {
          --dk-gold: #D8B65A;
          --dk-gold-soft: #F1DFA7;
          background: #071D16;
          letter-spacing: -0.006em;
        }
        .dk-root header {
          position: relative;
          z-index: 50;
        }
        .dk-root .dk-utility-bar {
          background: linear-gradient(90deg, #061710, #102D22 52%, #061710);
          border-bottom: 1px solid rgba(216,182,90,.22);
        }
        .dk-root .dk-sticky-nav {
          background: rgba(5, 25, 18, .94);
          border-bottom: 1px solid rgba(216,182,90,.2);
          box-shadow: 0 12px 36px rgba(0,0,0,.16);
          backdrop-filter: blur(18px);
        }
        .dk-root #home {
          min-height: min(820px, calc(100svh - 72px));
          padding-top: clamp(5rem, 10vw, 9rem);
          padding-bottom: clamp(5rem, 10vw, 9rem);
          background-color: #061710;
        }
        .dk-root #home > img {
          object-position: 58% 48%;
          filter: saturate(.88) contrast(1.08);
          transform: scale(1.015);
        }
        .dk-root #home > div[aria-hidden="true"]:nth-of-type(1) {
          background: linear-gradient(90deg, #061710 0%, rgba(6,23,16,.96) 27%, rgba(6,23,16,.76) 52%, rgba(6,23,16,.08) 100%);
        }
        .dk-root #home > div[aria-hidden="true"]:nth-of-type(2) {
          background: linear-gradient(0deg, rgba(4,18,12,.82), transparent 36%, rgba(4,18,12,.28));
        }
        .dk-root #home h1 {
          max-width: 11ch;
          font-size: clamp(2.8rem, 5.6vw, 5.15rem);
          line-height: 1.04;
          letter-spacing: -.035em;
          text-wrap: balance;
        }
        .dk-root #home p {
          max-width: 34rem;
          color: rgba(248,246,237,.86);
          line-height: 1.85;
        }
        .dk-root .dk-btn-gold,
        .dk-root .dk-btn-glass {
          min-height: 52px;
          padding: 14px 22px;
          border-radius: 3px;
          letter-spacing: .09em;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .dk-root .dk-btn-gold {
          background: linear-gradient(135deg, #F0DFA8, #D8B65A 52%, #B88D35);
          color: #10251B;
          box-shadow: 0 8px 24px rgba(184,141,53,.16);
        }
        .dk-root .dk-btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 13px 30px rgba(184,141,53,.25);
        }
        .dk-root .dk-btn-glass {
          border-color: rgba(241,223,167,.5);
          background: rgba(255,255,255,.055);
          backdrop-filter: blur(10px);
        }
        .dk-root .dk-btn-glass:hover {
          background: rgba(255,255,255,.12);
          transform: translateY(-2px);
        }
        .dk-root section[id] {
          scroll-margin-top: 92px;
        }
        .dk-root #ethos,
        .dk-root #menu {
          position: relative;
        }
        .dk-root #ethos {
          background: linear-gradient(135deg, #F7F2E7, #EEE5D2);
        }
        .dk-root #ethos img,
        .dk-root #ambience img {
          transition: transform .8s cubic-bezier(.2,.75,.25,1), filter .5s ease;
        }
        .dk-root #ethos .overflow-hidden:hover img,
        .dk-root #ambience .overflow-hidden:hover img {
          transform: scale(1.035);
        }
        .dk-root #menu {
          background: linear-gradient(180deg, #09291E 0%, #061D15 100%);
        }
        .dk-root #reservations,
        .dk-root #concierge {
          background-image: radial-gradient(ellipse at 85% 15%, rgba(216,182,90,.09), transparent 36%);
        }
        .dk-root input,
        .dk-root select,
        .dk-root textarea {
          border-radius: 3px;
        }
        .dk-root a:focus-visible,
        .dk-root button:focus-visible {
          outline-offset: 4px;
        }
        @media (max-width: 767px) {
          .dk-root #home {
            min-height: 690px;
            padding-top: 5.5rem;
            padding-bottom: 5.5rem;
          }
          .dk-root #home > img {
            width: 100%;
            opacity: .56;
            object-position: 58% center;
          }
          .dk-root #home > div[aria-hidden="true"]:nth-of-type(1) {
            background: linear-gradient(90deg, rgba(4,18,12,.88), rgba(4,18,12,.54)), linear-gradient(0deg, #041812 0%, transparent 75%);
          }
          .dk-root #home h1 {
            margin-left: auto;
            margin-right: auto;
            font-size: clamp(2.65rem, 11vw, 4rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dk-root *,
          .dk-root *::before,
          .dk-root *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Accessible Skip Link */}
      <a href="#main-content" className="dk-skip-link dk-visually-hidden">
        Skip to main content
      </a>

      {/* =====================================================================
          SECTION A: GLOBAL UTILITY BAR & STICKY NAVIGATION
      ===================================================================== */}
      <header>
        <div className="dk-utility-bar">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <span className="inline-flex items-center gap-2">
                <MapPin size={13} strokeWidth={1.6} className="text-[#D4AF37]" aria-hidden="true" />
                <span>{CONTACT.address}</span>
              </span>
              <span className="hidden items-center gap-2 md:inline-flex">
                <Clock size={13} strokeWidth={1.6} className="text-[#D4AF37]" aria-hidden="true" />
                <span>{CONTACT.hoursPrimary}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              {CONTACT.phone ? (
                <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 text-[#F8F6ED] transition hover:text-[#D4AF37]">
                  <Phone size={13} strokeWidth={1.6} className="text-[#D4AF37]" aria-hidden="true" />
                  <span>{CONTACT.phone}</span>
                </a>
              ) : (
                <span className="text-xs text-[#F8F6ED]/70">Restaurant contact details available on request</span>
              )}
            </div>
          </div>
        </div>

        <nav className="dk-sticky-nav" aria-label="Primary navigation">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-6 lg:px-8">
            <a href="#home" aria-label="DASTARKHWAN — Return to top" className="min-w-0 shrink-0">
              <DastarkhwanLogo size="sm" />
            </a>

            <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
              <li><a href="#home" className="dk-nav-link">Home</a></li>
              <li><a href="#ethos" className="dk-nav-link">Our Story</a></li>
              <li><a href="#menu" className="dk-nav-link">Menu</a></li>
              <li><a href="#experience" className="dk-nav-link">Experience</a></li>
              <li><a href="#ambience" className="dk-nav-link">Gallery</a></li>
              <li><a href="#concierge" className="dk-nav-link">Contact</a></li>
            </ul>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex">
                <a href="#reservations" className="dk-btn-gold">
                  <Calendar size={14} strokeWidth={1.8} aria-hidden="true" />
                  <span>Reserve a Table</span>
                </a>
              </span>

              <button
                type="button"
                onClick={openDrawer}
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav-drawer"
                aria-label="Open navigation menu"
                className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-sm border border-[#D4AF37]/40 text-[#F8F6ED] transition hover:border-[#D4AF37] hover:text-[#D4AF37] lg:hidden"
              >
                <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Accessible Swipe-Dismissible Mobile Navigation Drawer (<dialog>) */}
      <dialog
        ref={drawerRef}
        id="mobile-nav-drawer"
        className="dk-drawer"
        aria-label="Mobile navigation"
      >
        <div className="dk-drawer-panel">
          <div>
            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-5">
              <DastarkhwanLogo size="sm" showTagline={false} />
              <button
                type="button"
                autoFocus
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-sm border border-[#D4AF37]/35 text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
              >
                <X size={20} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile menu sections" className="mt-7">
              <ul className="space-y-1">
                {[
                  { href: "#home", label: "Home" },
                  { href: "#ethos", label: "Our Story" },
                  { href: "#menu", label: "Menu" },
                  { href: "#experience", label: "Experience" },
                  { href: "#ambience", label: "Gallery" },
                  { href: "#reservations", label: "Table Reservations" },
                  { href: "#concierge", label: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() => navigateToSection(link.href)}
                      className="flex min-h-[48px] w-full items-center justify-between border-b border-[#D4AF37]/20 px-1 text-left text-sm font-medium uppercase tracking-[0.16em] text-[#F8F6ED] transition hover:text-[#D4AF37]"
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={16} strokeWidth={1.5} className="text-[#D4AF37]/70" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigateToSection("#reservations")}
                className="dk-btn-gold w-full"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#D4AF37]/20 pt-5 text-xs text-[#F8F6ED]/75">
            <p className="font-medium text-[#D4AF37]">{CONTACT.address}</p>
            <p>Concierge: {CONTACT.phone || "Add restaurant phone number"}</p>
            <p>WhatsApp: {CONTACT.whatsapp || "Add restaurant WhatsApp number before launch"}</p>
          </div>
        </div>
      </dialog>

      {/* =====================================================================
          MAIN LANDMARK
      ===================================================================== */}
      <main id="main">
        {/* ===================================================================
            SECTION B: HERO — Split Left Editorial Copy & Right Plated Dining Artistry
        =================================================================== */}
        <section
          id="home"
          className="relative isolate flex min-h-[calc(100svh-104px)] items-center overflow-hidden bg-[#041812] py-20 sm:py-24"
        >
          {/* Right-weighted Gourmet Culinary & Candlelight Background */}
          <img
            src="/images/dish-galouti.jpg"
            alt="Gourmet seared kebabs on crisp golden flatbread beside hammered brassware in warm candlelight at DASTARKHWAN"
            width={1600}
            height={1200}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-right opacity-95 saturate-[1.15] contrast-[1.06] lg:left-auto lg:w-[68%]"
          />
          {/* Smooth Left Obsidian-Emerald Gradient Transition for Crisp Readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041812] via-[#041812]/80 to-transparent lg:via-[#041812]/85"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[#041812] via-transparent to-[#041812]/70"
          />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#DFCFA6]">
                <span>A Modern Pakistani Dining Experience</span>
                <span className="hidden h-px w-14 bg-gradient-to-r from-[#C6962C] to-transparent sm:inline-block" aria-hidden="true" />
              </div>

              <h1
                id="main-content"
                tabIndex={-1}
                className="dk-font-display mt-5 text-4xl font-semibold leading-[1.12] tracking-tight text-[#F8F6ED] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] sm:text-5xl lg:text-[3.75rem]"
              >
                A Taste of Tradition.
                <br />
                A Touch of{" "}
                <span className="dk-gold-foil italic">
                  Elegance.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-lg text-base font-normal leading-relaxed text-[#EFEBD9]/95 lg:mx-0 sm:text-lg">
                Discover the richness of Pakistani cuisine, thoughtfully reimagined for unforgettable moments wherever you are.
                
              </p>

              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center">
                <a href="#menu" className="dk-btn-gold w-full sm:w-auto">
                  <span>Explore Our Menu</span>
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </a>
                <a href="#reservations" className="dk-btn-glass w-full sm:w-auto">
                  <Calendar size={15} strokeWidth={1.7} className="text-[#D4AF37]" aria-hidden="true" />
                  <span>Reserve a Table</span>
                </a>
              </div>

              <div className="mt-12 hidden items-center gap-3 text-xs tracking-[0.14em] text-[#DFCFA6]/80 lg:inline-flex">
                <span className="h-px w-8 bg-[#C6962C]/60" aria-hidden="true" />
                <span className="uppercase">Scroll to Explore</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION C: WELCOME & PHILOSOPHY SPLIT (Warm Cream #F5EFE1)
        =================================================================== */}
        <section
          id="ethos"
          className="relative overflow-hidden bg-[#F5EFE1] py-20 text-[#1A1A1A] sm:py-24"
        >
          {/* Delicate Engraved Mughal Arch Filigree Watermark */}
          <svg
            aria-hidden="true"
            viewBox="0 0 280 340"
            fill="none"
            className="pointer-events-none absolute -bottom-6 right-0 hidden h-[360px] w-[290px] text-[#9E731A] opacity-15 lg:block"
          >
            <path
              d="M40 340V165C40 120 75 95 100 72C122 52 135 28 140 12C145 28 158 52 180 72C205 95 240 120 240 165V340"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M62 340V172C62 134 90 112 112 92C128 77 137 60 140 48C143 60 152 77 168 92C190 112 218 134 218 172V340"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <path d="M14 340H266" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-16">
              {/* Left Column: Candlelit Dining Salon Frame */}
              <div className="relative md:col-span-6">
                <div className="overflow-hidden rounded-xl border border-[#C6962C]/55 bg-[#051F17] shadow-2xl">
                  <img
                    src="/images/hero-salon.jpg"
                    alt="Warm candlelit Emerald Dining Salon at DASTARKHWAN with fluted green velvet seating"
                    width={960}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover saturate-[1.12] contrast-[1.04]"
                  />
                </div>
              </div>

              {/* Right Column: Editorial Copy & CTA */}
              <div className="md:col-span-6">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0B3D2E]">
                    Welcome to Dastarkhwan
                  </p>
                  <span className="h-px w-12 bg-[#C6962C]" aria-hidden="true" />
                </div>
                <h2 className="dk-font-display mt-3 text-3xl font-semibold leading-tight text-[#1A1A1A] sm:text-4xl lg:text-[2.65rem]">
                  Where Every Meal Becomes a Memory.
                </h2>

                <p className="mt-5 text-sm leading-relaxed text-[#3E3E3A] sm:text-base">
                  At Dastarkhwan, we bring people together through authentic Pakistani flavours, warm heartfelt
                  hospitality, and unhurried dining experiences set in timeless comfort.
                </p>

                <div className="mt-7">
                  <a href="#experience" className="dk-btn-gold">
                    <span>Discover Our Story</span>
                    <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION D: OUR SIGNATURE FLAVOURS & INTERACTIVE MENU
        =================================================================== */}
        <section
          id="menu"
          className="dk-jali-surface border-t border-[#C6962C]/35 py-20 text-[#F8F6ED] sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Centered Header with Flanked Metallic Gold Rules */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="hidden h-px w-14 bg-gradient-to-r from-transparent to-[#C6962C] sm:inline-block" aria-hidden="true" />
                <h2 className="dk-font-display text-3xl font-semibold text-[#F8F6ED] sm:text-4xl lg:text-[2.75rem]">
                  Our Signature Flavours
                </h2>
                <span className="hidden h-px w-14 bg-gradient-to-l from-transparent to-[#C6962C] sm:inline-block" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#E5DEC9]/90 sm:text-base">
                A celebration of authentic flavours and contemporary presentation, crafted fresh to order.
              </p>
            </div>

            {/* Clean Search + Tabs Bar */}
            <div className="mt-10 flex flex-col justify-between gap-4 border-b border-[#C6962C]/30 pb-6 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <div
                  className={`dk-tablist-wrap ${fadeState.start ? "dk-tablist-wrap--fade-start" : ""} ${
                    fadeState.end ? "dk-tablist-wrap--fade-end" : ""
                  }`}
                >
                  <div
                    ref={tablistRef}
                    role="tablist"
                    aria-label="Curated menu categories"
                    // @ts-expect-error progressive HTML attribute per W3C focusgroup spec
                    focusgroup="tablist nomemory"
                    className="dk-tablist border-b-0"
                  >
                    {MENU_CATEGORIES.map((cat, idx) => {
                      const selected = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          id={`tab-${cat.id}`}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          aria-controls="menu-tabpanel"
                          tabIndex={selected ? 0 : -1}
                          onClick={() => setActiveCategory(cat.id)}
                          onKeyDown={(e) => handleTabKeyDown(e, idx)}
                          className="dk-tab rounded-t-md"
                        >
                          <span className="block text-sm font-semibold tracking-wide">{cat.label}</span>
                          <span className="block text-[11px] uppercase tracking-[0.14em] opacity-75">{cat.subLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Search Landmark (<search>) */}
              <search className="w-full shrink-0 lg:w-72">
                <label
                  htmlFor="menu-search"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#DFCFA6]"
                >
                  Search Menu
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6962C]"
                  />
                  <input
                    id="menu-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Biryani, Nihari, Kebabs..."
                    className="dk-control dk-control--dark dk-control--search"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear menu search"
                      className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-[#D4AF37] hover:bg-[#D4AF37]/15"
                    >
                      <X size={15} strokeWidth={1.6} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </search>
            </div>

            {/* Tab Panel Results Count */}
            <div
              id="menu-tabpanel"
              role="tabpanel"
              aria-labelledby={`tab-${activeCategory}`}
              className="mt-8"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F8F6ED]/75">
                <p aria-live="polite">
                  Showing <strong className="font-semibold text-[#D4AF37]">{filteredMenu.length}</strong> curated{" "}
                  {filteredMenu.length === 1 ? "course" : "courses"}
                  {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ""}
                </p>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#D4AF37]/85">
                  All prices in PKR • Applicable taxes exclusive
                </span>
              </div>

              {filteredMenu.length === 0 ? (
                <div className="border border-[#D4AF37]/30 bg-[#07291F] px-6 py-14 text-center">
                  <UtensilsCrossed
                    size={28}
                    strokeWidth={1.4}
                    className="mx-auto text-[#D4AF37]"
                    aria-hidden="true"
                  />
                  <h3 className="dk-font-display mt-4 text-xl text-[#F8F6ED]">
                    No courses match your current selection
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[#F8F6ED]/75">
                    Try searching for heirloom dishes such as Nihari, Shinwari Karahi, Biryani, or reset to explore all
                    twelve selections.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="dk-btn-glass mt-6"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredMenu.map((dish) => (
                    <article
                      key={dish.id}
                      className="dk-card-zoom group flex flex-col overflow-hidden rounded-xl border border-[#C6962C]/45 bg-[#051E16] shadow-[0_14px_34px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1.5 hover:border-[#DFBE6F] hover:shadow-[0_20px_44px_rgba(0,0,0,0.45),0_0_24px_rgba(198,150,44,0.16)]"
                    >
                      {/* Clean Full-Bleed Food Photo */}
                      <div className="relative overflow-hidden bg-[#041812]">
                        <img
                          src={dish.image}
                          alt={dish.imageAlt}
                          width={800}
                          height={600}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover saturate-[1.12] contrast-[1.04]"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#051E16]/85 via-transparent to-transparent"
                        />
                        <span className="absolute left-3 top-3 rounded-full border border-[#C6962C]/55 bg-[#041812]/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#DFCFA6] backdrop-blur-sm">
                          {dish.categoryLabel}
                        </span>
                      </div>

                      {/* Clean Minimal Editorial Card Body */}
                      <div className="flex flex-1 flex-col justify-between p-5 text-center">
                        <div>
                          <h3 className="dk-font-display text-lg font-semibold leading-snug text-[#F8F6ED] transition group-hover:text-[#DFBE6F]">
                            {dish.title}
                          </h3>
                          <p className="mt-1 font-serif text-xs italic text-[#DFCFA6]/90">
                            {dish.tagline}
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-[#E5DEC9]/80">
                            {dish.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3">
                          <div
                            className="mx-auto mb-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C6962C]/70 to-transparent"
                            aria-hidden="true"
                          />
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold tracking-wider text-[#DFBE6F]">
                              PKR {dish.pricePkr.toLocaleString("en-PK")}
                            </span>
                            <SpiceRating level={dish.spiceLevel} label={dish.spiceLabel} />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Subtle Phase 3 Preview Strip */}
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-xl border border-[#C6962C]/45 bg-[#051E16]/95 bg-[radial-gradient(ellipse_at_right,rgba(198,150,44,0.12)_0%,transparent_65%)] p-6 shadow-xl sm:flex-row sm:items-center sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#C6962C]/55 bg-[#082B20] text-[#D4AF37]">
                  <QrCode size={22} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                    In-Salon Digital Dining • Phase III Preview
                  </p>
                  <h3 className="dk-font-display mt-1 text-xl font-semibold text-[#F8F6ED]">
                    Tableside QR Menu &amp; Preference Service
                  </h3>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#E5DEC9]/85 sm:text-sm">
                    Soon at every table: scan the brass table emblem to customize spice levels, request fresh tea
                    pairings, and pace your courses seamlessly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQrPreviewOpen(true)}
                className="dk-btn-glass shrink-0"
              >
                Preview Table Experience
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION E: EXPERIENCE BANNER ("More Than Just a Meal")
        =================================================================== */}
        <section
          id="experience"
          className="relative isolate overflow-hidden bg-[#041812] py-20 text-[#F8F6ED] sm:py-24"
        >
          <img
            src="/images/ambience-courtyard.jpg"
            alt="Candlelit stone dining courtyard with lanterns at twilight"
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-75 saturate-[1.12]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041812] via-[#041812]/80 to-[#041812]/35"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
                Our Promise
              </p>
              <h2 className="dk-font-display mt-2 text-3xl font-semibold text-[#F8F6ED] sm:text-4xl lg:text-[2.75rem]">
                More Than Just a Meal
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: Award,
                    title: "Thoughtful Hospitality",
                    note: "Attentive care paced cleanly around your guests.",
                  },
                  {
                    icon: Sparkles,
                    title: "Exceptional Flavours",
                    note: "Whole roasted spices & slow-simmered recipes.",
                  },
                  {
                    icon: Users,
                    title: "Moments Worth Sharing",
                    note: "Crafted for family milestones & quiet evenings.",
                  },
                ].map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="border-l border-[#C6962C]/55 pl-5"
                    >
                      <Icon size={24} strokeWidth={1.5} className="text-[#D4AF37]" aria-hidden="true" />
                      <h3 className="dk-font-display mt-3 text-lg font-semibold text-[#F8F6ED]">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#DFCFA6]/85">
                        {pillar.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION F: CULINARY STORY SPLIT (Light Warm Cream #F5EFE1)
        =================================================================== */}
        <section className="relative overflow-hidden bg-[#F5EFE1] py-20 text-[#1A1A1A] sm:py-24">
          {/* Subtle Engraved Architectural Mosque Dome Silhouette Watermark */}
          <svg
            aria-hidden="true"
            viewBox="0 0 360 240"
            fill="none"
            className="pointer-events-none absolute -bottom-2 right-0 hidden h-[240px] w-[360px] text-[#9E731A] opacity-15 lg:block"
          >
            <path d="M20 230H340" stroke="currentColor" strokeWidth="1.4" />
            <path d="M55 230V135H95V230M75 135V82M65 82H85M75 64V82" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M115 230V155H245V230M135 155C135 112 162 96 180 78C198 96 225 112 225 155"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path d="M180 60V78M265 230V125H305V230M285 125V72M285 54V72" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-16">
              {/* Left Column: Burnished Cloche Emblem Showcase */}
              <div className="relative md:col-span-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full rounded-xl border border-[#C6962C]/60 sm:block"
                />
                <div className="relative overflow-hidden rounded-xl border border-[#C6962C]/50 bg-[#051F17] shadow-2xl">
                  <img
                    src="/images/cloche-emblem.png"
                    alt="Burnished antique gold cloche emblem representing tableside service at DASTARKHWAN"
                    width={960}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="border-t border-[#C6962C]/35 bg-[#06241B] px-6 py-4 text-[#F8F6ED]">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Signature Service
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#DFCFA6]">
                        Your City, Pakistan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Simple Story */}
              <div className="md:col-span-6">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0B3D2E]">
                    Our Craft
                  </p>
                  <span className="h-px w-12 bg-[#C6962C]" aria-hidden="true" />
                </div>
                <h2 className="dk-font-display mt-3 text-3xl font-semibold leading-tight text-[#1A1A1A] sm:text-4xl lg:text-[2.65rem]">
                  Rooted in Tradition.
                  <br />
                  Crafted for Today.
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3E3E3A] sm:text-base">
                  <p>
                    A journey of flavours, culture, and quiet passion—where classic family recipes meet modern fine
                    dining.
                  </p>
                  <p>
                    From freshly toasted whole spices every morning to sealed clay-pot slow braising over live hardwood
                    coals, every dish arrives with authentic warmth and care.
                  </p>
                </div>

                <div className="mt-8">
                  <a href="#ambience" className="dk-btn-gold">
                    <span>Explore Our Spaces</span>
                    <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION G: A GLIMPSE INTO OUR WORLD (Lightbox Gallery on Cream #F6F2E6)
        =================================================================== */}
        <section
          id="ambience"
          className="border-t border-[#C6962C]/25 bg-[#F6F2E6] py-20 text-[#1A1A1A] sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0B3D2E]">
                Spaces &amp; Atmosphere
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="hidden h-px w-12 bg-[#C6962C]/75 sm:inline-block" aria-hidden="true" />
                <h2 className="dk-font-display text-3xl font-semibold text-[#1A1A1A] sm:text-4xl lg:text-[2.75rem]">
                  A Glimpse Into Our World
                </h2>
                <span className="hidden h-px w-12 bg-[#C6962C]/75 sm:inline-block" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4A4A46] sm:text-base">
                Select any space below to take a closer look or reserve that specific dining area for your party.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AMBIENCE_GALLERY.map((spot, idx) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Inspect ${spot.title} — ${spot.subtitle}`}
                  className="dk-card-zoom group relative overflow-hidden rounded-xl border border-[#C6962C]/55 bg-[#052017] text-left shadow-xl transition duration-300 hover:-translate-y-1.5 hover:border-[#C6962C] hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={spot.image}
                      alt={spot.imageAlt}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover saturate-[1.12] contrast-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#052017]/80 via-transparent to-transparent"
                    />
                    <span className="absolute right-3.5 top-3.5 rounded-full border border-[#C6962C]/65 bg-[#041812]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#DFBE6F] backdrop-blur-sm">
                      Inspect Space
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C6962C]">
                      {spot.subtitle}
                    </p>
                    <h3 className="dk-font-display mt-1 text-xl font-semibold text-[#F8F6ED] transition group-hover:text-[#DFBE6F]">
                      {spot.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#E5DEC9]/85">{spot.sensoryNote}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION H: WORDS FROM OUR GUESTS (Interactive Carousel + Cards on Emerald Jali)
        =================================================================== */}
        <section className="dk-jali-surface border-t border-[#C6962C]/35 py-20 text-[#F8F6ED] sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="hidden h-px w-14 bg-gradient-to-r from-transparent to-[#C6962C] sm:inline-block" aria-hidden="true" />
                <h2 className="dk-font-display text-3xl font-semibold text-[#F8F6ED] sm:text-4xl">
                  Words From Our Guests
                </h2>
                <span className="hidden h-px w-14 bg-gradient-to-l from-transparent to-[#C6962C] sm:inline-block" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-[#F8F6ED]/65">Illustrative sample reviews for this demo — replace with verified customer feedback before launch.</p>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 sm:gap-8">
              <button
                type="button"
                aria-label="Previous guest review"
                onClick={() => setReviewIndex((prev) => (prev - 1 + IMPRESSIONS.length) % IMPRESSIONS.length)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C6962C]/60 bg-[#041812]/65 text-[#D4AF37] transition hover:border-[#DFBE6F] hover:bg-[#C6962C]/15"
              >
                <ChevronLeft size={18} strokeWidth={1.6} aria-hidden="true" />
              </button>

              <article className="flex-1 text-center">
                <blockquote className="font-serif text-lg italic leading-relaxed text-[#F8F6ED] sm:text-xl">
                  “{currentReview.quote}”
                </blockquote>

                <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#DFCFA6]">
                    — {currentReview.author} • {currentReview.occasion}
                  </span>
                  <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        strokeWidth={1.5}
                        className="fill-[#C6962C] text-[#C6962C]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </article>

              <button
                type="button"
                aria-label="Next guest review"
                onClick={() => setReviewIndex((prev) => (prev + 1) % IMPRESSIONS.length)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C6962C]/60 bg-[#041812]/65 text-[#D4AF37] transition hover:border-[#DFBE6F] hover:bg-[#C6962C]/15"
              >
                <ChevronRight size={18} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================
            AMBIENT BANNER: "Your Table Awaits"
        =================================================================== */}
        <section className="relative isolate overflow-hidden border-t border-[#C6962C]/35 bg-[#041812] py-16 text-center text-[#F8F6ED] sm:py-20">
          <img
            src="/images/hero-salon.jpg"
            alt="Candlelit table setting prepared for evening dinner service"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-45 saturate-[1.15]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[#041812]/80 via-[#041812]/65 to-[#041812]/90"
          />
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="dk-font-display text-3xl font-semibold text-[#F8F6ED] sm:text-4xl">
              Your Table Awaits
            </h2>
            <p className="mt-2 text-sm text-[#E5DEC9]/90 sm:text-base">
              Make room for good food and great moments.
            </p>
            <div className="mt-7">
              <a href="#reservations" className="dk-btn-gold">
                <Calendar size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>Reserve Your Table</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION G: TABLE RESERVATION ENGINE (Warm Ivory Contrast Surface)
        =================================================================== */}
        <section id="reservations" className="bg-[#F8F6ED] py-20 text-[#1A1A1A] sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#0B3D2E]">
                Private Hosting &amp; Dining
              </p>
              <h2 className="dk-font-display mt-3 text-3xl font-semibold text-[#1A1A1A] sm:text-4xl lg:text-[2.75rem]">
                Reserve Your Dastarkhwan
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4A4A46] sm:text-base">
                Request your preferred dining salon, evening seating, and dietary considerations. Submit a sample reservation request. In a live restaurant website, requests are sent to the restaurant for confirmation.
              </p>
            </div>

            <form
              ref={resFormRef}
              noValidate
              onSubmit={handleReservationSubmit}
              className="mt-12 rounded-lg border border-[#D4AF37]/65 bg-[#EFEBD9]/75 p-6 shadow-md sm:p-10"
            >
              {/* Single Centralized Screen-Reader Polite Error Summary */}
              <div className="dk-visually-hidden" aria-live="polite" aria-atomic="true">
                {resLiveSummary}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label htmlFor="res-fullname" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                    Full Name <span aria-hidden="true" className="text-[#8F2218]">*</span>
                  </label>
                  <p id="res-fullname-hint" className="mt-1 text-xs text-[#4A4A46]">
                    As addressed at our reception desk.
                  </p>
                  <input
                    id="res-fullname"
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={resForm.fullName}
                    onChange={(e) => setResForm((p) => ({ ...p, fullName: e.target.value }))}
                    data-label="Full Name"
                    data-base-describedby="res-fullname-hint"
                    data-error-id="res-fullname-error"
                    aria-describedby="res-fullname-hint"
                    aria-invalid="false"
                    placeholder="e.g. Tariq Mahmood"
                    className="dk-control dk-control--ivory mt-2"
                  />
                  {resErrors.fullName && (
                    <span id="res-fullname-error" className="dk-field-error dk-field-error--ivory">
                      {resErrors.fullName}
                    </span>
                  )}
                </div>

                {/* WhatsApp / Phone Number */}
                <div>
                  <label htmlFor="res-phone" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                    WhatsApp / Phone Number <span aria-hidden="true" className="text-[#8F2218]">*</span>
                  </label>
                  <p id="res-phone-hint" className="mt-1 text-xs text-[#4A4A46]">
                    Used exclusively for your 15-minute table confirmation.
                  </p>
                  <input
                    id="res-phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="^[+]?[0-9\s\-()]{10,18}$"
                    autoComplete="tel"
                    value={resForm.phone}
                    onChange={(e) => setResForm((p) => ({ ...p, phone: e.target.value }))}
                    data-label="WhatsApp / Phone Number"
                    data-base-describedby="res-phone-hint"
                    data-error-id="res-phone-error"
                    aria-describedby="res-phone-hint"
                    aria-invalid="false"
                    placeholder="+92 300 1234567"
                    className="dk-control dk-control--ivory mt-2"
                  />
                  {resErrors.phone && (
                    <span id="res-phone-error" className="dk-field-error dk-field-error--ivory">
                      {resErrors.phone}
                    </span>
                  )}
                </div>

                {/* Number of Guests (<select> for 6+ options) */}
                <div>
                  <label htmlFor="res-guests" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                    Number of Guests <span aria-hidden="true" className="text-[#8F2218]">*</span>
                  </label>
                  <p id="res-guests-hint" className="mt-1 text-xs text-[#4A4A46]">
                    Parties of 12+ qualify for a dedicated butler alcove.
                  </p>
                  <select
                    id="res-guests"
                    name="guests"
                    required
                    value={resForm.guests}
                    onChange={(e) => setResForm((p) => ({ ...p, guests: e.target.value }))}
                    data-label="Number of Guests"
                    data-base-describedby="res-guests-hint"
                    data-error-id="res-guests-error"
                    aria-describedby="res-guests-hint"
                    aria-invalid="false"
                    className="dk-control dk-control--ivory mt-2"
                  >
                    <option value="" disabled>
                      Select party size
                    </option>
                    <option value="1 Guest">1 Guest (Solo Table)</option>
                    <option value="2 Guests">2 Guests (Intimate Table)</option>
                    <option value="4 Guests">4 Guests (Family Table)</option>
                    <option value="6 Guests">6 Guests (Majlis Setting)</option>
                    <option value="8 Guests">8 Guests (Grand Table)</option>
                    <option value="12+ VIP">12+ VIP (Private Dastarkhwan)</option>
                  </select>
                  {resErrors.guests && (
                    <span id="res-guests-error" className="dk-field-error dk-field-error--ivory">
                      {resErrors.guests}
                    </span>
                  )}
                </div>

                {/* Dining Date */}
                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                    Dining Date <span aria-hidden="true" className="text-[#8F2218]">*</span>
                  </label>
                  <p id="res-date-hint" className="mt-1 text-xs text-[#4A4A46]">
                    Open Tuesday through Sunday; closed Mondays for spice roasting.
                  </p>
                  <div className="relative mt-2">
                    <input
                      id="res-date"
                      name="date"
                      type="date"
                      required
                      min={todayIso}
                      value={resForm.date}
                      onChange={(e) => setResForm((p) => ({ ...p, date: e.target.value }))}
                      data-label="Dining Date"
                      data-base-describedby="res-date-hint"
                      data-error-id="res-date-error"
                      aria-describedby="res-date-hint"
                      aria-invalid="false"
                      className="dk-control dk-control--ivory"
                    />
                  </div>
                  {resErrors.date && (
                    <span id="res-date-error" className="dk-field-error dk-field-error--ivory">
                      {resErrors.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Seating Time Slot Fieldset (4 Radios) */}
              <fieldset className="mt-8 border-0 p-0">
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                  Seating Time Slot <span aria-hidden="true" className="text-[#8F2218]">*</span>
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      "Lunch (12:30 PM – 3:30 PM)",
                      "Early Dinner (6:30 PM – 8:15 PM)",
                      "Prime Dinner (8:30 PM – 10:30 PM)",
                      "Midnight Feast (10:45 PM – 1:00 AM)",
                    ] as TimeSlotOption[]
                  ).map((slot) => (
                    <label key={slot} className="dk-radio-card">
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot}
                        required
                        checked={resForm.timeSlot === slot}
                        onChange={() => setResForm((p) => ({ ...p, timeSlot: slot }))}
                        className="h-4 w-4 accent-[#0B3D2E]"
                      />
                      <span className="leading-snug">{slot}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Hall Preference Fieldset (3 Radios — Pre-selectable from Lightbox) */}
              <fieldset className="mt-7 border-0 p-0">
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                  Hall Preference <span aria-hidden="true" className="text-[#8F2218]">*</span>
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {(
                    [
                      {
                        value: "Main Emerald Hall",
                        note: "Plush emerald seating & tableside service",
                      },
                      {
                        value: "The Royal Courtyard",
                        note: "Open-air lanterns & coastal breeze",
                      },
                      {
                        value: "VIP Private Alcove",
                        note: "Private family suite & dedicated valet",
                      },
                    ] as { value: HallPreference; note: string }[]
                  ).map((hall) => (
                    <label key={hall.value} className="dk-radio-card items-start py-3">
                      <input
                        type="radio"
                        name="hallPreference"
                        value={hall.value}
                        required
                        checked={resForm.hallPreference === hall.value}
                        onChange={() => setResForm((p) => ({ ...p, hallPreference: hall.value }))}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#0B3D2E]"
                      />
                      <span>
                        <span className="block text-sm font-medium">{hall.value}</span>
                        <span className="block text-xs font-normal text-[#4A4A46]">{hall.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Special Requests & Dietary Notes */}
              <div className="mt-7">
                <label htmlFor="res-notes" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                  Special Requests &amp; Dietary Notes <span className="font-normal text-[#4A4A46]">(Optional)</span>
                </label>
                <p id="res-notes-hint" className="mt-1 text-xs text-[#4A4A46]">
                  Allergies, anniversary table arrangements, high-chair requests, or pre-ordered signature courses.
                </p>
                <textarea
                  id="res-notes"
                  name="notes"
                  rows={3}
                  value={resForm.notes}
                  onChange={(e) => setResForm((p) => ({ ...p, notes: e.target.value }))}
                  aria-describedby="res-notes-hint"
                  aria-invalid="false"
                  placeholder="Share celebration details or allergy sensitivities..."
                  className="dk-control dk-control--ivory mt-2"
                />
              </div>

              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#1A1A1A]/15 pt-6 sm:flex-row">
                <p className="text-xs text-[#4A4A46]">
                  100% Zabihah Halal kitchen • Smart-elegant evening attire requested
                </p>
                <button type="submit" className="dk-btn-gold w-full sm:w-auto">
                  <Calendar size={16} strokeWidth={1.6} aria-hidden="true" />
                  <span>Confirm Table Request</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ===================================================================
            SECTION H: CONCIERGE & LOCATION
        =================================================================== */}
        <section
          id="concierge"
          className="dk-jali-surface border-t border-[#D4AF37]/30 py-20 text-[#F8F6ED] sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Address, Telephone, WhatsApp, Email, Service Hours */}
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#D4AF37]">
                  Flagship Venue
                </p>
                <h2 className="dk-font-display mt-3 text-3xl font-semibold text-[#F8F6ED] sm:text-4xl">
                  Concierge &amp; Location
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#E5DEC9]/85">
                  Find us at our restaurant location. Add your address, accessibility details, and directions before launching this website for a restaurant.
                </p>

                <dl className="mt-8 space-y-5 border-t border-[#D4AF37]/20 pt-8 text-sm">
                  <div className="flex items-start gap-3.5">
                    <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        Flagship Address
                      </dt>
                      <dd className="mt-1 text-[#F8F6ED]">{CONTACT.address}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        Direct Concierge Desk
                      </dt>
                      <dd className="mt-1">
                        {CONTACT.phone ? (
                          <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className="hover:text-[#D4AF37]">{CONTACT.phone}</a>
                        ) : "Add restaurant phone number before launch"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MessageCircle
                      size={18}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-[#D4AF37]"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        WhatsApp Reservations
                      </dt>
                      <dd className="mt-1 text-[#F8F6ED]">{CONTACT.whatsapp ? <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-[#D4AF37]">{CONTACT.whatsapp}</a> : "Add restaurant WhatsApp number before launch"}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        Private Events &amp; Press
                      </dt>
                      <dd className="mt-1">
                        {CONTACT.email ? (
                          <a href={`mailto:${CONTACT.email}`} className="hover:text-[#D4AF37]">{CONTACT.email}</a>
                        ) : "Add restaurant email before launch"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        Service &amp; Valet Hours
                      </dt>
                      <dd className="mt-1 text-[#F8F6ED]">{CONTACT.hoursPrimary}</dd>
                      <dd className="mt-0.5 text-xs text-[#F8F6ED]/70">{CONTACT.hoursValet || "Add optional service details in restaurant configuration"}</dd>
                    </div>
                  </div>
                </dl>

                {/* Architectural Map & Pre-Opening Site Placement Frame */}
                <div className="mt-7 rounded-lg border border-[#D4AF37]/40 bg-[#051F17]/90 p-4">
                  <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-[#E8CE82]">
                    <span>Restaurant location • Your City, Pakistan</span>
                    <span>Location to be configured</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#F8F6ED]/80">
                    Add the restaurant's verified address and Google Maps link in src/config/restaurant.ts before publishing for a client.
                  </p>
                </div>
              </div>

              {/* Right Column: Direct Concierge Inquiry Form */}
              <div className="lg:col-span-7">
                <div className="rounded-lg border border-[#D4AF37]/45 bg-[#051F17]/95 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.34)] sm:p-9">
                  <h3 className="dk-font-display text-2xl font-semibold text-[#F8F6ED]">
                    Direct Concierge Dispatch
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#F8F6ED]/75 sm:text-sm">
                    Arrange bespoke private banquets, corporate hospitality, home catering degs, or press visits.
                  </p>

                  {inqConfirmation && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mt-6 flex items-start gap-3 border border-[#D4AF37] bg-[#07291F] p-4 text-sm text-[#F8F6ED]"
                    >
                      <CheckCircle2 size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-[#D4AF37]">
                          Demo inquiry preview — Reference {inqConfirmation.reference}
                        </p>
                        <p className="mt-1 text-xs text-[#F8F6ED]/85">
                          Thank you, {inqConfirmation.name}. This is a demo only; no inquiry has been sent. Connect an email or CRM destination before launch.
                        </p>
                      </div>
                    </div>
                  )}

                  <form ref={inqFormRef} noValidate onSubmit={handleInquirySubmit} className="mt-6 space-y-5">
                    <div className="dk-visually-hidden" aria-live="polite" aria-atomic="true">
                      {inqLiveSummary}
                    </div>

                    <fieldset className="border-0 p-0">
                      <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
                        Inquiry Purpose <span aria-hidden="true">*</span>
                      </legend>
                      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {(["Private Banquet", "Bespoke Catering", "Press & Editorial"] as InquiryType[]).map((kind) => (
                          <label key={kind} className="dk-radio-card dk-radio-card--dark">
                            <input
                              type="radio"
                              name="inquiryType"
                              value={kind}
                              required
                              checked={inqForm.type === kind}
                              onChange={() => setInqForm((p) => ({ ...p, type: kind }))}
                              className="h-4 w-4 accent-[#D4AF37]"
                            />
                            <span className="text-xs font-medium">{kind}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="inq-name" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F8F6ED]">
                          Your Name <span aria-hidden="true" className="text-[#E5C76B]">*</span>
                        </label>
                        <p id="inq-name-hint" className="mt-1 text-[11px] text-[#F8F6ED]/65">
                          Full name or organization representative.
                        </p>
                        <input
                          id="inq-name"
                          name="name"
                          type="text"
                          required
                          minLength={2}
                          autoComplete="name"
                          value={inqForm.name}
                          onChange={(e) => setInqForm((p) => ({ ...p, name: e.target.value }))}
                          data-label="Your Name"
                          data-base-describedby="inq-name-hint"
                          data-error-id="inq-name-error"
                          aria-describedby="inq-name-hint"
                          aria-invalid="false"
                          placeholder="e.g. Ayesha Siddiqui"
                          className="dk-control dk-control--dark mt-1.5"
                        />
                        {inqErrors.name && (
                          <span id="inq-name-error" className="dk-field-error dk-field-error--dark">
                            {inqErrors.name}
                          </span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="inq-email" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F8F6ED]">
                          Email Address <span aria-hidden="true" className="text-[#E5C76B]">*</span>
                        </label>
                        <p id="inq-email-hint" className="mt-1 text-[11px] text-[#F8F6ED]/65">
                          Direct address for formal tasting proposals.
                        </p>
                        <input
                          id="inq-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={inqForm.email}
                          onChange={(e) => setInqForm((p) => ({ ...p, email: e.target.value }))}
                          data-label="Email Address"
                          data-base-describedby="inq-email-hint"
                          data-error-id="inq-email-error"
                          aria-describedby="inq-email-hint"
                          aria-invalid="false"
                          placeholder="name@company.pk"
                          className="dk-control dk-control--dark mt-1.5"
                        />
                        {inqErrors.email && (
                          <span id="inq-email-error" className="dk-field-error dk-field-error--dark">
                            {inqErrors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inq-message" className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F8F6ED]">
                        Event Details &amp; Preferred Dates <span aria-hidden="true" className="text-[#E5C76B]">*</span>
                      </label>
                      <p id="inq-message-hint" className="mt-1 text-[11px] text-[#F8F6ED]/65">
                        Minimum 10 characters: please share approximate guest count, dates, or menu preferences.
                      </p>
                      <textarea
                        id="inq-message"
                        name="message"
                        required
                        minLength={10}
                        rows={4}
                        value={inqForm.message}
                        onChange={(e) => setInqForm((p) => ({ ...p, message: e.target.value }))}
                        data-label="Event Details"
                        data-base-describedby="inq-message-hint"
                        data-error-id="inq-message-error"
                        aria-describedby="inq-message-hint"
                        aria-invalid="false"
                        placeholder="Describe your gathering, preferred evening, or private buyout inquiry..."
                        className="dk-control dk-control--dark mt-1.5"
                      />
                      {inqErrors.message && (
                        <span id="inq-message-error" className="dk-field-error dk-field-error--dark">
                          {inqErrors.message}
                        </span>
                      )}
                    </div>

                    <div className="pt-1">
                      <button type="submit" className="dk-btn-gold w-full sm:w-auto">
                        Send Concierge Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          SECTION I: LUXURY FOOTER (Deep Obsidian-Emerald matching Header)
      ===================================================================== */}
      <footer className="border-t border-[#D4AF37]/40 bg-[#041912] py-16 text-[#F8F6ED]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <DastarkhwanLogo size="md" />
              <p className="mt-5 max-w-sm text-xs leading-relaxed text-[#F8F6ED]/80">
                A premium Pakistani dining experience—uniting regional culinary heritage, thoughtful hospitality, and an elegant setting.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="#concierge"
                  aria-label="DASTARKHWAN Concierge WhatsApp"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#D4AF37]/35 text-[#D4AF37] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  <MessageCircle size={17} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a
                  href="#ambience"
                  aria-label="DASTARKHWAN Ambience Showcase"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#D4AF37]/35 text-[#D4AF37] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  <Instagram size={17} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="md:col-span-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Navigation</h2>
              <nav aria-label="Footer navigation" className="mt-4">
                <ul className="space-y-2.5 text-xs text-[#E5DEC9]/90">
                  <li><a href="#home" className="transition hover:text-[#D4AF37]">Home</a></li>
                  <li><a href="#ethos" className="transition hover:text-[#D4AF37]">Our Story</a></li>
                  <li><a href="#menu" className="transition hover:text-[#D4AF37]">Menu</a></li>
                  <li><a href="#experience" className="transition hover:text-[#D4AF37]">Experience</a></li>
                  <li><a href="#ambience" className="transition hover:text-[#D4AF37]">Gallery</a></li>
                  <li><a href="#reservations" className="transition hover:text-[#D4AF37]">Reservations</a></li>
                  <li><a href="#concierge" className="transition hover:text-[#D4AF37]">Contact</a></li>
                </ul>
              </nav>
            </div>

            {/* Restaurant hours & contact */}
            <div className="md:col-span-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Hours &amp; Address
              </h2>
              <div className="mt-4 space-y-2.5 text-xs leading-relaxed text-[#E5DEC9]/90">
                <p>{CONTACT.address}</p>
                <p>{CONTACT.hoursPrimary}</p>
                <p>Monday: Closed for Weekly Kitchen Prep</p>
                <p className="pt-1 text-[#D4AF37]">{CONTACT.phone || "Add phone"} • {CONTACT.email || "Add email"}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#C6962C]/25 pt-8 text-xs text-[#E5DEC9]/75 sm:flex-row">
            <p>© {new Date().getFullYear()} DASTARKHWAN. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C6962C]/45 px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] text-[#D4AF37]">
                <span>Designed &amp; Engineered for Matrix Studio Portfolio</span>
              </div>
              <a
                href="#home"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#DFCFA6] transition hover:text-[#D4AF37]"
              >
                <span>Back to Top</span>
                <ArrowUp size={13} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          NATIVE ACCESSIBLE TOP-LAYER MODALS (<dialog>)
      ===================================================================== */}

      {/* 1. Ambience Lightbox Modal (<dialog>) */}
      <dialog
        ref={lightboxDialogRef}
        className="dk-modal"
        closedby="any"
        aria-labelledby="lightbox-title"
      >
        {activeAmbience && (
          <div>
            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  {activeAmbience.subtitle}
                </p>
                <h2 id="lightbox-title" className="dk-font-display text-2xl font-semibold text-[#F8F6ED]">
                  {activeAmbience.title}
                </h2>
              </div>
              <button
                type="button"
                autoFocus
                onClick={closeLightbox}
                aria-label="Close ambience inspection modal"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-[#D4AF37]/40 text-[#D4AF37] transition hover:bg-[#D4AF37]/15"
              >
                <X size={20} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="bg-[#051B14] lg:col-span-7">
                <img
                  src={activeAmbience.image}
                  alt={activeAmbience.imageAlt}
                  width={960}
                  height={720}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-5">
                <div>
                  <span className="inline-block rounded-sm border border-[#D4AF37]/40 bg-[#0B3D2E] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#D4AF37]">
                    {activeAmbience.capacity}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-[#F8F6ED]/90">
                    {activeAmbience.description}
                  </p>
                  <p className="mt-4 border-l-2 border-[#D4AF37] pl-3 text-xs italic text-[#E5C76B]">
                    Sensory Note: {activeAmbience.sensoryNote}
                  </p>
                </div>

                <div className="mt-8 space-y-4 border-t border-[#D4AF37]/20 pt-5">
                  <button
                    type="button"
                    onClick={() => handleReserveAmbienceArea(activeAmbience.hallPreference)}
                    className="dk-btn-gold w-full"
                  >
                    Reserve This Area ({activeAmbience.hallPreference})
                  </button>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) =>
                          prev === null ? 0 : (prev - 1 + AMBIENCE_GALLERY.length) % AMBIENCE_GALLERY.length
                        )
                      }
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border border-[#D4AF37]/30 px-3.5 text-xs font-medium uppercase tracking-wider text-[#F8F6ED] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      <ChevronLeft size={16} aria-hidden="true" />
                      <span>Previous</span>
                    </button>
                    <span className="text-xs text-[#F8F6ED]/65">
                      {(lightboxIndex ?? 0) + 1} / {AMBIENCE_GALLERY.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % AMBIENCE_GALLERY.length))
                      }
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border border-[#D4AF37]/30 px-3.5 text-xs font-medium uppercase tracking-wider text-[#F8F6ED] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>

      {/* 2. Reservation Confirmation Modal (<dialog>) */}
      <dialog
        ref={confirmDialogRef}
        className="dk-modal max-w-lg"
        closedby="any"
        aria-labelledby="reservation-confirm-title"
      >
        {confirmedReservation && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/25 pb-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={26} strokeWidth={1.6} className="shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                    Reservation Preview
                  </p>
                  <h2 id="reservation-confirm-title" className="dk-font-display text-2xl font-semibold text-[#F8F6ED]">
                    Reference #{confirmedReservation.reference}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                autoFocus
                onClick={closeConfirmDialog}
                aria-label="Close reservation confirmation"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-[#D4AF37]/35 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-[#D4AF37]/20 pb-2">
                <dt className="text-[#F8F6ED]/70">Guest Name</dt>
                <dd className="font-medium text-[#F8F6ED]">{confirmedReservation.fullName}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#D4AF37]/20 pb-2">
                <dt className="text-[#F8F6ED]/70">WhatsApp / Contact</dt>
                <dd className="font-medium text-[#F8F6ED]">{confirmedReservation.phone}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#D4AF37]/20 pb-2">
                <dt className="text-[#F8F6ED]/70">Party &amp; Date</dt>
                <dd className="font-medium text-[#F8F6ED]">
                  {confirmedReservation.guests} • {confirmedReservation.date}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#D4AF37]/20 pb-2">
                <dt className="text-[#F8F6ED]/70">Seating Slot</dt>
                <dd className="text-right font-medium text-[#D4AF37]">{confirmedReservation.timeSlot}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#D4AF37]/20 pb-2">
                <dt className="text-[#F8F6ED]/70">Sanctuary Hall</dt>
                <dd className="font-medium text-[#F8F6ED]">{confirmedReservation.hallPreference}</dd>
              </div>
              {confirmedReservation.notes && (
                <div className="pt-1">
                  <dt className="text-xs uppercase tracking-wider text-[#D4AF37]">Dietary / Seating Notes</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-[#F8F6ED]/80">{confirmedReservation.notes}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 border border-[#D4AF37]/30 bg-[#0B3D2E] p-4 text-xs leading-relaxed text-[#F8F6ED]/85">
              Demo preview only — no reservation has been sent. Connect the restaurant's booking system or WhatsApp number in src/config/restaurant.ts before launch.
            </div>

            <div className="mt-6">
              <button type="button" onClick={closeConfirmDialog} className="dk-btn-gold w-full">
                Return to Dastarkhwan
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* 3. Phase 3 QR Table Ordering Concierge Preview Modal (<dialog>) */}
      <dialog
        ref={qrDialogRef}
        className="dk-modal max-w-md"
        closedby="any"
        aria-labelledby="qr-preview-title"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Phase III Table Preview
              </p>
              <h2 id="qr-preview-title" className="dk-font-display text-2xl font-semibold text-[#F8F6ED]">
                Table 04 • Emerald Salon
              </h2>
            </div>
            <button
              type="button"
              autoFocus
              onClick={closeQrDialog}
              aria-label="Close table experience preview"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-[#D4AF37]/35 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-3 text-xs leading-relaxed text-[#F8F6ED]/90 sm:text-sm">
            <p>
              Guests dining at DASTARKHWAN scan a brass table emblem beside their setting—giving discreet, effortless
              control right at the table:
            </p>
            <ul className="space-y-2 border-t border-[#D4AF37]/20 pt-3">
              <li className="flex items-center gap-2.5">
                <Sparkles size={15} className="shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>Pair courses with artisan cardamom tea &amp; fresh mint coolers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Flame size={15} className="shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>Customize grill char and spice heat levels to match your palate</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>Signal our service team when your table is ready for the next course</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                closeQrDialog();
                window.setTimeout(() => navigateToSection("#reservations"), 150);
              }}
              className="dk-btn-gold flex-1"
            >
              Reserve This Salon
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
