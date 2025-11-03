import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

/**
 * Export a DOM node to multi-page A4 PDF using html-to-image.
 * Strips gradients/filters/animations *only during export* to avoid
 * oklch() and filter issues. Adds detailed error logs.
 */
export async function exportElementToPDF(elementId, filename = "export.pdf") {
  const el = document.getElementById(elementId);
  if (!el) {
    const msg = `exportElementToPDF: element #${elementId} not found`;
    console.error(msg);
    throw new Error(msg);
  }

  // Add a flag so CSS can simplify visuals during capture
  document.body.classList.add("pdf-exporting");

  // Wait 2 RAFs so charts have rendered & CSS flag is applied
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    // html-to-image "filter" lets us skip problematic nodes
    const filter = (node) => {
      if (!(node instanceof HTMLElement)) return true;

      // Skip decorative blobs / heavy filters / animations
      const bad = [
        "animate-blob",
        "mix-blend-multiply",
        "blur-3xl",
        "blur-2xl",
        "pointer-events-none",
      ];
      if (bad.some((c) => node.classList?.contains(c))) return false;

      // Also skip nodes that explicitly use gradient backgrounds inline
      const bg = node.style?.backgroundImage || "";
      if (bg.includes("linear-gradient") || bg.includes("radial-gradient")) return false;

      return true;
    };

    // Force a plain background (avoid transparent PDF)
    const style = {
      background: "#ffffff",
      // neutralize any potential CSS that may taint the canvas
      "-webkit-filter": "none",
      "filter": "none",
    };

    // Use PNG to preserve sharp text; JPG works too
    const dataUrl = await htmlToImage.toPng(el, {
      cacheBust: true,
      pixelRatio: 2, // crisp output
      filter,
      style,
      // canvasWidth/Height help avoid fractional sizes
      canvasWidth: el.scrollWidth,
      canvasHeight: el.scrollHeight,
      // skip external fonts to avoid timing issues
      skipFonts: true,
      // Prefer CORS-safe images; if any cross-origin image is tainting,
      // filter() above should have excluded their node.
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

    pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (e) {
    // Log everything we can for debugging
    console.error("PDF export failed:", e, {
      name: e?.name,
      message: e?.message,
      stack: e?.stack,
    });
    throw e instanceof Error ? e : new Error("Unknown PDF export error");
  } finally {
    document.body.classList.remove("pdf-exporting");
  }
}
