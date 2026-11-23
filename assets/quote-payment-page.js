import { showQuotePayment } from "./quote-payment.js";

const render = () => showQuotePayment(document, window.location.hash);
window.addEventListener("hashchange", render);
render();
