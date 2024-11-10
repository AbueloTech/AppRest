async function printReceipt() {
    // Crear el contenido del recibo
    const receiptContent = document.getElementById("receiptContent").innerHTML;
    
    // Crear un documento HTML específico para impresión
    const printDoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Recibo de Compra - Terreno Broaster</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                @page {
                    size: 80mm 297mm; /* Tamaño típico de papel de recibo */
                    margin: 0;
                }
                @media print {
                    body {
                        width: 72mm; /* Ancho efectivo de impresión */
                        margin: 0;
                        padding: 5mm;
                        font-size: 12px;
                    }
                    .logo {
                        max-width: 60mm;
                        height: auto;
                    }
                    table {
                        width: 100%;
                        margin-bottom: 10px;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 2px;
                        text-align: left;
                        font-size: 10px;
                    }
                    hr {
                        margin: 5px 0;
                    }
                    /* Ocultar elementos innecesarios para impresión */
                    .no-print {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <div style="text-align: center;">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Broaster1-JNLLDnamafP3kGLc111K3gvd24XMVK.jpg" 
                     alt="Terreno Broaster Logo" 
                     class="logo" 
                     style="max-width: 200px;">
            </div>
            ${receiptContent}
            <div style="text-align: center; margin-top: 20px;">
                <p>¡Gracias por su compra!</p>
                <p>Terreno Broaster</p>
            </div>
        </body>
        </html>
    `;

    try {
        // Crear un Blob con el contenido HTML
        const blob = new Blob([printDoc], { type: 'text/html' });
        const blobURL = URL.createObjectURL(blob);

        // Abrir ventana de impresión
        const printWindow = window.open(blobURL, 'PRINT', 'height=600,width=800');

        printWindow.onload = function() {
            // Esperar a que los estilos se carguen
            setTimeout(async () => {
                try {
                    if (printWindow.document.queryCommandSupported('print')) {
                        // Mostrar el diálogo de impresión
                        const printResult = await printWindow.show();
                        
                        // Limpiar recursos después de imprimir
                        URL.revokeObjectURL(blobURL);
                        if (!printResult) {
                            printWindow.close();
                        }
                    } else {
                        // Fallback para navegadores que no soportan la API moderna
                        printWindow.print();
                        setTimeout(() => {
                            printWindow.close();
                            URL.revokeObjectURL(blobURL);
                        }, 1000);
                    }
                } catch (error) {
                    console.error('Error al imprimir:', error);
                    alert('Hubo un error al intentar imprimir. Por favor, intente nuevamente.');
                    printWindow.close();
                    URL.revokeObjectURL(blobURL);
                }
            }, 1000);
        };
    } catch (error) {
        console.error('Error al preparar la impresión:', error);
        alert('Hubo un error al preparar la impresión. Por favor, intente nuevamente.');
    }
}