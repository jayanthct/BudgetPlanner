export const exportDashboardToPDF = async () => {
  // We use the browser's native print engine.
  // This avoids issues with modern CSS like "oklch()" which html2canvas cannot parse.
  // It guarantees vector quality, selectable text, and perfect rendering.
  window.print();
};
