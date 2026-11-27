import type { PlatformSettings } from "./wordpress";

export const SEEYAM_CONTACT = {
  phone: "+919443594435",
  whatsapp: "+919003790017",
  email: "Seeyam.tech@gmail.com",
  streetAddress: "First floor, Neela Arcade, No. 7, 200 Feet Radial Rd, Thoraipakkam",
  city: "Chennai",
  region: "Tamil Nadu",
  postalCode: "600097",
};

const defaultAddress = `${SEEYAM_CONTACT.streetAddress}, ${SEEYAM_CONTACT.city}, ${SEEYAM_CONTACT.region} ${SEEYAM_CONTACT.postalCode}`;

export const SEEYAM_CAMPUS = {
  id: "branch-thoraipakkam",
  name: "Thoraipakkam",
  slug: "thoraipakkam",
  city: SEEYAM_CONTACT.city,
  address: defaultAddress,
  phone: SEEYAM_CONTACT.phone,
  whatsapp: SEEYAM_CONTACT.whatsapp,
  email: SEEYAM_CONTACT.email,
  timing: "",
  landmark: "Neela Arcade",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3359887124116!2d80.23156061077928!3d12.950339287310534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d005e653d01%3A0xfd6851cad8cabab8!2sSeeyam!5e0!3m2!1sen!2sin!4v1795599077413!5m2!1sen!2sin",
};

export function mapLinkFromEmbed(embedUrl: string) {
  try {
    const embed = new URL(embedUrl);
    if (embed.origin !== "https://www.google.com" || embed.pathname !== "/maps/embed") return undefined;
    const place = embed.searchParams.get("pb")?.match(/!1s0x[0-9a-f]+:(0x[0-9a-f]+)(?:!|$)/i)?.[1];
    if (!place) return undefined;
    const cid = BigInt(place);
    return cid > BigInt(0) ? `https://maps.google.com/?cid=${cid}` : undefined;
  } catch {
    return undefined;
  }
}

export function contactDetails(settings?: PlatformSettings) {
  const address = settings?.contact_address?.trim() || defaultAddress;
  return {
    phone: settings?.footer_phone || settings?.navbar_helpline_phone || SEEYAM_CONTACT.phone,
    whatsapp: settings?.contact_whatsapp || SEEYAM_CONTACT.whatsapp,
    email: settings?.footer_email || SEEYAM_CONTACT.email,
    address,
    displayAddress: `SEEYAM, ${address.replace(/^seeyam(?: technologies)?\s*,\s*/i, "")}`,
    maps: settings?.contact_maps || mapLinkFromEmbed(SEEYAM_CAMPUS.mapEmbedUrl) || SEEYAM_CAMPUS.mapEmbedUrl,
  };
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function whatsappHref(phone: string, message?: string) {
  const url = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
