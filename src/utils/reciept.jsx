// export default function usePrintReceipt() {
//   
//   return async (cartItems, totalUSD, totalLRD, onClearCart) => {
//     // ===== PAPER AUTO DETECT =====
//     const IS_80MM = true
//     const TOTAL_WIDTH = IS_80MM ? 48 : 32

//     // ===== ESC/POS COMMANDS =====
//     const ESC = "\x1B"
//     const GS = "\x1D"

//     const INIT = ESC + "@"
//     const CENTER = ESC + "a" + "\x01"
//     const LEFT = ESC + "a" + "\x00"

//     const DOUBLE_ON = GS + "!" + "\x01"
//     const DOUBLE_OFF = GS + "!" + "\x00"

//     const LINE_SPACE = ESC + "\x50"
//     const LINE_SPACE_DEFAULT = ESC + "2"
//     const FEED_LINES = ESC + "d" + "\x04"

//     // ===== BARCODE =====
//     const BARCODE_HEIGHT = GS + "h" + "\x50"
//     const BARCODE_WIDTH = GS + "w" + "\x03"
//     const BARCODE_CODE128 = GS + "k" + "\x49"

//     const barcode = (data) =>
//       BARCODE_HEIGHT +
//       BARCODE_WIDTH +
//       BARCODE_CODE128 +
//       String.fromCharCode(data.length) +
//       data +
//       CENTER +
//       data

//     // ===== COLUMNS =====
//     const COLS = IS_80MM
//       ? { name: 28, qty: 4, price: 6, total: 10 }
//       : { name: 12, qty: 3, price: 8, total: 9 }

//     const padCenter = (text, width) => {
//       const left = Math.floor((width - text.length) / 2)
//       const right = width - text.length - left
//       return " ".repeat(left) + text + " ".repeat(right)
//     }

//     const wrapText = (text, width) => {
//       const lines = []
//       let remaining = text
//       while (remaining.length > width) {
//         lines.push(remaining.slice(0, width))
//         remaining = remaining.slice(width)
//       }
//       lines.push(remaining)
//       return lines
//     }

//     const itemRows = (name, qty, price, total, currency) => {
//       const nameLines = wrapText(name, COLS.name)
//       let output = ""
//       nameLines.forEach((lineText, index) => {
//         if (index === 0) {
//           output +=
//             lineText.padEnd(COLS.name) +
//             padCenter(String(qty), COLS.qty) +
//             price.padStart(COLS.price) +
//             ` ${total}${currency}`.padStart(COLS.total) +
//             "\n"
//         } else {
//           output +=
//             lineText.padEnd(COLS.name) +
//             " ".repeat(COLS.qty + COLS.price + COLS.total) +
//             "\n"
//         }
//       })
//       return output
//     }

//     const line = (char = "-") => char.repeat(TOTAL_WIDTH) + "\n"

//     // ===== BUILD RECEIPT =====
//     const getReceiptText = () => {
//       let text = ""
//       text += INIT + LINE_SPACE

//       text += CENTER + DOUBLE_ON
//       text += "JUNCTION BUSINESS CENTER\n"
//       text += DOUBLE_OFF
//       text += "ELWA Junction, Paynesville City\n"
//       text += "Contact: 0775899090 / 0889456743\n\n"

//       text += LEFT
//       text += "Cashier ID: PL-1012\n"
//       text += line()

//       const now = new Date()
//       const pad = (n) => String(n).padStart(2, "0")
//       const date = `${pad(now.getDate())}/${pad(
//         now.getMonth() + 1
//       )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
//         now.getMinutes()
//       )}:${pad(now.getSeconds())}`

//       text += `Receipt No: 12345678`.padEnd(TOTAL_WIDTH - date.length) + date + "\n"
//       text += line()

//       text +=
//         "ITEM".padEnd(COLS.name) +
//         padCenter("QTY", COLS.qty) +
//         "PRICE".padStart(COLS.price) +
//         "TOTAL".padStart(COLS.total) +
//         "\n"

//       text += line()

//       cartItems.forEach((item) => {
//         const qty = item.quantity
//         const price = item.price.toFixed(2)
//         const total = (item.price * qty).toFixed(2)
//         const currency = item.currency ?? "USD"

//         text += itemRows(item.name, qty, price, total, currency)
//       })

//       text += line()

//       const totalUSDStr = Number(totalUSD).toFixed(2)
//       const totalLRDStr = Number(totalLRD).toFixed(2)

//       text += `Total USD$`.padEnd(TOTAL_WIDTH - totalUSDStr.length) + totalUSDStr + "\n"
//       text += `Total LRD$`.padEnd(TOTAL_WIDTH - totalLRDStr.length) + totalLRDStr + "\n\n"


//       text += CENTER
//       text += barcode("9876543210") + "\n\n"

//       text += "Thank you for purchasing\n"
//       text += "Powered by Pekin Ledger, a Pekin Group solution\n"

//       text += FEED_LINES + LINE_SPACE_DEFAULT
//       return text
//     }

//     // ===== PRINT =====
//     try {
//       const res = await fetch("http://localhost:9100/print", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           type: "receipt",
//           text: getReceiptText(),
//         }),
//       })

//       const data = await res.json()
//       if (!data.error) onClearCart()
//       else alert("Print failed: " + data.error)
//     } catch (err) {
//       console.error(err)
//       alert("Cannot connect to print service")
//     }
//   }
// }


export default function usePrintReceipt() {
  return async (cartItems, totalUSD, totalLRD, grandTotal, conversionRate, payment, onClearCart) => {
    const businessName = localStorage.getItem('business_name')
    const cashierID = localStorage.getItem('user')
    const store_id = localStorage.getItem("store_id");
  
    const IS_80MM = true;
    const TOTAL_WIDTH = IS_80MM ? 48 : 32;

    const ESC = "\x1B";
    const GS = "\x1D";
    const INIT = ESC + "@";
    const CENTER = ESC + "a" + "\x01";
    const LEFT = ESC + "a" + "\x00";
    const DOUBLE_ON = GS + "!" + "\x01";
    const DOUBLE_OFF = GS + "!" + "\x00";
    const LINE_SPACE = ESC + "\x50";
    const LINE_SPACE_DEFAULT = ESC + "2";
    const FEED_LINES = ESC + "d" + "\x04";

    const BARCODE_HEIGHT = GS + "h" + "\x50";
    const BARCODE_WIDTH = GS + "w" + "\x03";
    const BARCODE_CODE128 = GS + "k" + "\x49";

    const barcode = (data) =>
      BARCODE_HEIGHT +
      BARCODE_WIDTH +
      BARCODE_CODE128 +
      String.fromCharCode(data.length) +
      data +
      CENTER +
      data;

    const COLS = IS_80MM
      ? { name: 28, qty: 4, price: 6, total: 10 }
      : { name: 12, qty: 3, price: 8, total: 9 };

    const padCenter = (text, width) => {
      const left = Math.floor((width - text.length) / 2);
      const right = width - text.length - left;
      return " ".repeat(left) + text + " ".repeat(right);
    };

    const wrapText = (text, width) => {
      const lines = [];
      let remaining = text;
      while (remaining.length > width) {
        lines.push(remaining.slice(0, width));
        remaining = remaining.slice(width);
      }
      lines.push(remaining);
      return lines;
    };

    const itemRows = (name, qty, price, total, currency) => {
      const nameLines = wrapText(name, COLS.name);
      let output = "";
      nameLines.forEach((lineText, index) => {
        if (index === 0) {
          output +=
            lineText.padEnd(COLS.name) +
            padCenter(String(qty), COLS.qty) +
            price.padStart(COLS.price) +
            ` ${total}${currency}`.padStart(COLS.total) +
            "\n";
        } else {
          output +=
            lineText.padEnd(COLS.name) +
            " ".repeat(COLS.qty + COLS.price + COLS.total) +
            "\n";
        }
      });
      return output;
    };

    const line = (char = "-") => char.repeat(TOTAL_WIDTH) + "\n";

    const getReceiptText = () => {
      let text = "";
      text += INIT + LINE_SPACE;

      text += CENTER + DOUBLE_ON;
      text += businessName + '\n';
      text += DOUBLE_OFF;
      text += "ELWA Junction, Paynesville City\n";
      text += "Contact: 0775899090 / 0889456743\n\n";

      text += LEFT;

      text += `Store ID: ${store_id}`.padEnd(TOTAL_WIDTH - (`Cashier ID: ${cashierID}`).length)
            + `Cashier ID: ${cashierID}\n`;

      text += line();

      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      text += `Receipt No: 12345678`.padEnd(TOTAL_WIDTH - date.length) + date + "\n";
      text += line();

      // Items
      text +=
        "ITEM".padEnd(COLS.name) +
        padCenter("QTY", COLS.qty) +
        "PRICE".padStart(COLS.price) +
        "TOTAL".padStart(COLS.total) +
        "\n";
      text += line();

      cartItems.forEach((item) => {
        const qty = item.quantity;
        const price = item.price.toFixed(2);
        const total = (item.price * qty).toFixed(2);
        const currency = item.currency ?? "USD";
        text += itemRows(item.name, qty, price, total, currency);
      });

      text += line();

      // Subtotals
      text += `Total USD$`.padEnd(TOTAL_WIDTH - totalUSD.toFixed(2).length) + totalUSD.toFixed(2) + "\n";
      text += `Total LRD$`.padEnd(TOTAL_WIDTH - totalLRD.toFixed(2).length) + totalLRD.toFixed(2) + "\n";
      text += `Tax\n`;
      // Conversion rate
      
      // Grand total (already has the selected currency included)
      text += `Grand Total`.padEnd(TOTAL_WIDTH - String(grandTotal).length) + grandTotal + "\n";
      text += `Exchange Rate 1USD = ${conversionRate}LRD\n`;

      // Single payment
      if (payment) {
        text += `Payment Method ${payment.method}\n`;
      }

      text += "\n";
      text += CENTER;
      text += barcode("9876543210") + "\n\n";
      text += "Thank you for purchasing\n";
      text += "Powered by Pekin Ledger, a Pekin Group solution\n";
      text += FEED_LINES + LINE_SPACE_DEFAULT;

      return text;
    };

    try {
      const res = await fetch("http://localhost:9100/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "receipt",
          text: getReceiptText(),
        }),
      });

      const data = await res.json();
      if (!data.error) onClearCart();
      else alert("Print failed: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to print service");
    }
  };
}

