const sessionKey = "seeyam-enquiry-prompt-handled";
let handled = false;

export function suppressEnquiryPrompt() {
  handled = true;
  try { sessionStorage.setItem(sessionKey, "1"); } catch {}
  window.dispatchEvent(new Event("seeyam-enquiry-prompt-handled"));
}

export function wasHandled() {
  try { return handled || sessionStorage.getItem(sessionKey) === "1"; }
  catch { return handled; }
}

export function rememberEnquiryPrompt() {
  handled = true;
  try { sessionStorage.setItem(sessionKey, "1"); } catch {}
}
