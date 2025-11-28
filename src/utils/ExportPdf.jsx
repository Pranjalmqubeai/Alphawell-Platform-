import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

/**
 * Export a DOM node to multi-page A4 PDF using html-to-image.
 * Adds AlphaWell header + footer with logo, address, email.
 */
export async function exportElementToPDF(elementId, filename = "export.pdf") {
  const el = document.getElementById(elementId);
  if (!el) {
    const msg = `exportElementToPDF: element #${elementId} not found`;
    console.error(msg);
    throw new Error(msg);
  }

  // Add flag so CSS can simplify visuals for snapshot
  document.body.classList.add("pdf-exporting");

  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r))
  );

  try {
    const filter = (node) => {
      if (!(node instanceof HTMLElement)) return true;

      const bad = [
        "animate-blob",
        "mix-blend-multiply",
        "blur-3xl",
        "blur-2xl",
        "pointer-events-none",
      ];
      if (bad.some((c) => node.classList?.contains(c))) return false;

      const bg = node.style?.backgroundImage || "";
      if (bg.includes("linear-gradient") || bg.includes("radial-gradient"))
        return false;

      return true;
    };

    const style = { background: "#ffffff", filter: "none" };

    const dataUrl = await htmlToImage.toPng(el, {
      cacheBust: true,
      pixelRatio: 2,
      filter,
      style,
      canvasWidth: el.scrollWidth,
      canvasHeight: el.scrollHeight,
      skipFonts: true,
    });

    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // ---------- HEADER + FOOTER CONFIG ----------
    const headerHeight = 60;
    const footerHeight = 50;
    const contentTop = headerHeight;

    // Your logo (Base64 PNG recommended)
    const LOGO = "../src/assets/logo.jpg"; // <-- Replace with your logo path (public/)

    const addHeader = () => {
      pdf.setFillColor("#F1F5F9");
      pdf.rect(0, 0, pageWidth, headerHeight, "F");

      // Logo
      if (LOGO) {
        pdf.addImage(LOGO, "PNG", 20, 10, 40, 40);
      }

      pdf.setFontSize(16);
      pdf.setTextColor("#0F172A");
      pdf.text("AlphaWell Intelligence", 70, 28);

      pdf.setFontSize(9);
      pdf.setTextColor("#475569");
      pdf.text("AI-Powered Well Forecasting & Economic Intelligence", 70, 42);
    };

    const addFooter = () => {
      pdf.setFillColor("#F1F5F9");
      pdf.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");

      pdf.setFontSize(8);
      pdf.setTextColor("#475569");

      pdf.text(
        "© 2025 AlphaWell Intelligence — All Rights Reserved",
        20,
        pageHeight - 28
      );
      pdf.text("Email: support@alphawell.ai", 20, pageHeight - 16);
      pdf.text("Website: https://alphawell.ai", 20, pageHeight - 4);
    };

    // ---------- FIRST PAGE ----------
    addHeader();
    pdf.addImage(
      dataUrl,
      "PNG",
      0,
      contentTop, // start BELOW the header
      imgWidth,
      imgHeight
    );

    addFooter();

    heightLeft -= pageHeight - headerHeight - footerHeight;

    // ---------- MORE PAGES ----------
    while (heightLeft > 20) {
      pdf.addPage();
      addHeader();

      position = heightLeft - imgHeight + contentTop;

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      addFooter();

      heightLeft -= pageHeight - headerHeight - footerHeight;
    }

    pdf.save(filename);
  } catch (e) {
    console.error("PDF export failed:", e);
    throw e instanceof Error ? e : new Error("Unknown PDF export error");
  } finally {
    document.body.classList.remove("pdf-exporting");
  }
}
