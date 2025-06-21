// export function printReceipt(cartItems, totalUSD, totalLRD) {
//   const receiptHtml = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: sans-serif;
//             padding: 20px;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 10px;
//           }
//           th, td {
//             border-bottom: 1px solid #ccc;
//             padding: 8px;
//             text-align: left;
//           }
//           h2 {
//             margin-bottom: 0;
//           }
//           .total {
//             font-weight: bold;
//           }
//         </style>
//       </head>
//       <body>
//         <h2>Receipt</h2>
//         <p><strong>Order No:</strong> #12345</p>
//         <table>
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>Qty</th>
//               <th>Price</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${cartItems.map(item => `
//               <tr>
//                 <td>${item.name}</td>
//                 <td>${item.quantity}</td>
//                 <td>$${item.price.toFixed(2)}</td>
//                 <td>$${(item.price * item.quantity).toFixed(2)}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//         <p class="total">Total USD: $${totalUSD.toFixed(2)}</p>
//         <p class="total">Total LRD: $${totalLRD.toFixed(2)}</p>
//       </body>
//     </html>
//   `;

//   const printFrame = document.createElement('iframe');
//   printFrame.style.position = 'absolute';
//   printFrame.style.left = '-9999px';
//   document.body.appendChild(printFrame);

//   const frameWindow = printFrame.contentWindow || printFrame.contentDocument;
//   const doc = frameWindow.document || frameWindow;
//   doc.open();
//   doc.write(receiptHtml);
//   doc.close();

//   setTimeout(() => {
//     frameWindow.focus();
//     frameWindow.print();
//     document.body.removeChild(printFrame);
//   }, 500);
// }


// FOR WINDOW 
export default function usePrintReceipt() {
  return (cartItems, totalUSD, totalLRD, onClearCart) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            h2, h3 { margin-top: 0; }
          </style>
        </head>
        <body>
          <h2>🧾 Receipt</h2>
          <h3>Order Summary</h3>
          <table>
            <thead>
              <tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${cartItems
                .map(
                  item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
          <p><strong>Total USD:</strong> $${totalUSD.toFixed(2)}</p>
          <p><strong>Total LRD:</strong> $${totalLRD.toFixed(2)}</p>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      onClearCart();
    }, 500);
  };
}

