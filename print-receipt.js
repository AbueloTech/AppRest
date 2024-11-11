const escpos = require('escpos');
// Habilitar los adaptadores USB y de red
escpos.USB = require('escpos-usb');
escpos.Network = require('escpos-network');

// Función para imprimir el recibo
async function printReceipt(receiptData) {
  try {
    // Intenta encontrar una impresora USB
    let device = new escpos.USB();
    
    // Si no se encuentra una impresora USB, intenta con una impresora de red
    // Asegúrate de reemplazar 'PRINTER_IP' con la IP de tu impresora
    // device = new escpos.Network('PRINTER_IP');

    // Crea un objeto de impresora
    const options = { encoding: "GB18030" }
    const printer = new escpos.Printer(device, options);

    // Abre una conexión con la impresora
    await new Promise((resolve, reject) => {
      device.open((error) => {
        if (error) {
          reject(new Error('Error al abrir la conexión con la impresora: ' + error.message));
        } else {
          resolve();
        }
      });
    });

    // Imprime el recibo
    printer
      .font('a')
      .align('ct')
      .style('b')
      .size(1, 1)
      .text('Terreno Broaster')
      .text('Recibo de Compra')
      .text('------------------------')
      .align('lt')
      .style('normal')
      .size(0, 0)
      .text(`Ticket #${receiptData.ticketNumber}`)
      .text(`Fecha: ${receiptData.date}`)
      .text(`Forma de Pago: ${receiptData.paymentMethod}`)
      .text('------------------------');

    // Imprime los items del carrito
    receiptData.items.forEach(item => {
      printer.tableCustom([
        { text: item.name.substring(0, 12), align:"LEFT", width:0.4 },
        { text: item.quantity.toString(), align:"RIGHT", width:0.2 },
        { text: `$${item.price.toFixed(2)}`, align:"RIGHT", width:0.2 },
        { text: `$${(item.price * item.quantity).toFixed(2)}`, align:"RIGHT", width:0.2 }
      ]);
    });

    printer
      .text('------------------------')
      .align('rt')
      .style('b')
      .text(`Total: $${receiptData.total.toFixed(2)}`)
      .align('ct')
      .style('normal')
      .text('¡Gracias por su compra!')
      .text('Terreno Broaster')
      .cut()
      .close();

    console.log('Recibo impreso exitosamente');
  } catch (error) {
    console.error('Error al imprimir:', error);
  }
}

// Ejemplo de uso
const receiptData = {
  ticketNumber: 1001,
  date: new Date().toLocaleString(),
  paymentMethod: 'Efectivo',
  items: [
    { name: 'Hamburguesa', quantity: 2, price: 5.99 },
    { name: 'Papas Fritas', quantity: 1, price: 2.50 },
    { name: 'Refresco', quantity: 2, price: 1.99 }
  ],
  total: 18.46
};

printReceipt(receiptData);