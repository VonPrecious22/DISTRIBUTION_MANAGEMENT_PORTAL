const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateOrderPDF = (order) => {
  return new Promise((resolve, reject) => {
    const fileName = `order-${order._id}.pdf`;

    const folder = path.join(__dirname, "../public/receipts");
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filePath = path.join(folder, fileName);

    const pdf = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    pdf.pipe(stream);

    pdf.font("Times-Roman");
    pdf.fontSize(18).text("Brewery Distribution Portal", {
      align: "center",
      underline: true,
    
    });
    pdf.moveDown();

    pdf
      .fontSize(12)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    pdf.fontSize(14).text(`Order ID: ${order._id}`);
    pdf.fontSize(14).text(`User Name: ${order.buyer.name}`);
    pdf.fontSize(14).text(`Email: ${order.buyer.email}`);
    pdf.fontSize(12).text(`Contact: ${order.buyer.contact}`);
    pdf.moveDown(1.5);

    // ---- table setup ----
    const startX = 50;
    let y = pdf.y;

    const rowHeight = 22;
    const tableRight = startX + 450; // right edge of the table

    // column x-positions and widths (last column ends exactly at tableRight)
    const col = {
      sn: { x: startX, width: 30 },
      product: { x: startX + 30, width: 150 },
      quantity: { x: startX + 180, width: 70 },
      price: { x: startX + 250, width: 90 },
      subtotal: { x: startX + 340, width: 110 },
    };

    // x-positions of every vertical border, including the two outer edges
    const columnLines = [
      startX,
      col.product.x,
      col.quantity.x,
      col.price.x,
      col.subtotal.x,
      tableRight,
    ];

    const drawRowBorder = (topY) => {
      pdf.moveTo(startX, topY).lineTo(tableRight, topY).stroke();
    };

    const drawRow = (
      sn,
      product,
      quantity,
      price,
      subtotal,
      isHeader = false,
    ) => {
      const rowTop = y;

      pdf.fontSize(11).font(isHeader ? "Times-Bold" : "Times-Roman");

      pdf.text(sn, col.sn.x + 4, y + 5, { width: col.sn.width - 8 });
      pdf.text(product, col.product.x + 4, y + 5, {
        width: col.product.width - 8,
      });
      pdf.text(quantity, col.quantity.x + 4, y + 5, {
        width: col.quantity.width - 8,
        align: "center",
      });
      pdf.text(price, col.price.x + 4, y + 5, {
        width: col.price.width - 8,
        align: "right",
      });
      pdf.text(subtotal, col.subtotal.x + 4, y + 5, {
        width: col.subtotal.width - 8,
        align: "right",
      });

      y += rowHeight;

      // horizontal border under this row
      drawRowBorder(y);

      // vertical borders for this row's height
      columnLines.forEach((lineX) => {
        pdf.moveTo(lineX, rowTop).lineTo(lineX, y).stroke();
      });
    };

    // top border of the table
    drawRowBorder(y);

    // header row
    drawRow("SN", "Product", "Quantity", "Price", "Subtotal", true);

    // item rows
    order.items.forEach((item, index) => {
      drawRow(
        String(index + 1),
        item.name,
        String(item.quantity),
        `${item.unitPrice} FCFA`,
        `${item.subtotal} FCFA`,
      );
    });

    y += 14;

    // total amount, bottom right
    pdf.fontSize(13).font("Times-Bold");
    pdf.text(`Total: ${order.totalAmount} FCFA`, startX, y, {
      width: tableRight - startX,
      align: "right",
    });

    pdf.end();

    stream.on("finish", () => resolve(`/receipts/${fileName}`));
    stream.on("error", reject);
  });
};

module.exports = { generateOrderPDF };
