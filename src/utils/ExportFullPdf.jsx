import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

export async function exportAllTabsToPDF(
  filename = "alphawell_full_report.pdf"
) {
  const sections = [
    { id: "exec-summary", title: "Executive Summary" },
    { id: "neighborhood-summary", title: "Neighborhood Analysis" },
    { id: "production-summary", title: "Production Forecast" },
    { id: "economic-summary", title: "Economic Forecast" },
  ];

  // Flag so CSS can simplify visuals (same as exportElementToPDF)
  document.body.classList.add("pdf-exporting");

  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r))
  );

  try {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // ---------- HEADER + FOOTER CONFIG ----------
    const headerHeight = 60;
    const footerHeight = 50;
    const contentTop = headerHeight;

    // Your logo (Base64 PNG or public path)
    const LOGO = "../src/assets/logo.jpg"; // same as exportElementToPDF

    const addHeader = () => {
      pdf.setFillColor("#F1F5F9");
      pdf.rect(0, 0, pageWidth, headerHeight, "F");

      if (LOGO) {
        pdf.addImage(LOGO, "PNG", 20, 10, 40, 40);
      }

      pdf.setFontSize(16);
      pdf.setTextColor("#0F172A");
      pdf.text("AlphaWell Intelligence", 70, 28);

      pdf.setFontSize(9);
      pdf.setTextColor("#475569");
      pdf.text(
        "AI-Powered Well Forecasting & Economic Intelligence",
        70,
        42
      );
    };

    const addFooter = () => {
      pdf.setFillColor("#F1F5F9");
      pdf.rect(
        0,
        pageHeight - footerHeight,
        pageWidth,
        footerHeight,
        "F"
      );

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

    let firstPage = true;

    for (const section of sections) {
      const node = document.getElementById(section.id);
      if (!node) continue;

      // ---------- Convert DOM to PNG ----------
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        filter,
        style,
        canvasWidth: node.scrollWidth,
        canvasHeight: node.scrollHeight,
        skipFonts: true,
      });

      const img = new Image();
      img.src = dataUrl;
      await img.decode();

      const imgWidth = pageWidth;
      const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;

      let heightLeft = imgHeight;
      let position = 0;

      // ---------- FIRST PAGE FOR THIS SECTION ----------
      if (!firstPage) {
        pdf.addPage();
      }
      firstPage = false;

      addHeader();

      // Section title just below header
      pdf.setFontSize(11);
      pdf.setTextColor("#0F172A");
      

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        contentTop,
        imgWidth,
        imgHeight
      );

      addFooter();

      heightLeft -= pageHeight - headerHeight - footerHeight;

      // ---------- CONTINUED PAGES FOR THIS SECTION ----------
      
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
    }

    pdf.save(filename);
  } catch (e) {
    console.error("PDF full export failed:", e);
    throw e instanceof Error ? e : new Error("Unknown full PDF export error");
  } finally {
    document.body.classList.remove("pdf-exporting");
  }
}
