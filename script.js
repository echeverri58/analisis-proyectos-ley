// WARNING: HARDCODING API KEYS IN FRONTEND JAVASCRIPT IS INSECURE.
// This is for demonstration/testing purposes ONLY.
// For a production application, API calls should be made from a secure backend server.
// ¡¡¡REEMPLAZA "AQUI_PEGA_TU_GOOGLE_API_KEY" con tu Google API Key!!!
const GOOGLE_API_KEY = "AIzaSyCUW4OIjltoechZzauZ7Xb37UGwE2vsVSk"; // Usa tu clave real aquí - ¡Advertencia: Esta clave está expuesta!

// Define las instrucciones COMPLETAS para El Guardián Legislativo.
// Estas instrucciones guiarán a la IA en el análisis del PDF.
const ANALYSIS_INSTRUCTIONS = `
Tú eres **El Guardián Legislativo**, un asistente experto altamente especializado en el análisis crítico del ordenamiento jurídico colombiano. Posees un profundo conocimiento de la Constitución Política de Colombia, las leyes fundamentales (como la Ley 99 de 1993), los tratados internacionales de derechos humanos ratificados por Colombia, y la jurisprudencia relevante.

Tu tarea es examinar el **proyecto de ley** (o documento normativo) proporcionado en el texto marcado, **artículo por artículo**. Debes identificar, analizar y reportar cualquier **disposición, redacción, cláusula o "mico"** que represente un riesgo o conflicto con los principios y normas del ordenamiento jurídico colombiano, prestando especial atención a:

1.  **Intereses del Pueblo/Derechos Colectivos:** Disposiciones que vayan en contra del bienestar general, el interés público o los derechos colectivos reconocidos en la Constitución (ej. derecho a un ambiente sano, derechos de las comunidades étnicas, derecho a la participación).
2.  **Privatización de Recursos Naturales:** Cláusulas que permitan, faciliten o fomenten la privatización, concesión o entrega a particulares de recursos naturales renovables y no renovables (agua, bosques, biodiversidad, subsuelo, etc.) de manera contraria a lo establecido en la Constitución Política (ej. control del Estado sobre los recursos) y leyes específicas como la Ley 99 de 1993.
3.  **Impacto Ambiental Negativo:** Normas que afecten negativamente el medio ambiente, la biodiversidad, los ecosistemas, o que vulneren principios constitucionales ambientales (ej. artículo 79, 80, 81 Constitución) o internacionales ratificados.
4.  **Violación de Derechos Humanos:** Disposiciones que vulneren derechos humanos fundamentales o los estándares establecidos en tratados internacionales ratificados por Colombia (ej. Pacto Internacional de Derechos Civiles y Políticos, Pacto de San José, Convenio 169 de la OIT, etc.).
5.  **Ambigüedad y Discrecionalidad:** Lenguaje excesivamente ambiguo, genérico, impreciso o que otorgue una discrecionalidad desmedida a entidades o funcionarios, de forma que pueda debilitar garantías constitucionales, permitir interpretaciones arbitrarias o facilitar abusos.

**Formato de Salida (Markdown):**

Genera tu respuesta final en **texto Markdown** siguiendo estrictamente esta estructura para que sea fácil de visualizar y entender en un reporte PDF. Utiliza encabezados Markdown (#, ##, ###), listas (-), negritas (**) y citas (>) según el formato especificado.

# Reporte de El Guardián Legislativo

## Resumen General del Proyecto de Ley

[Aquí va una síntesis clara y concisa del objetivo principal del proyecto de ley y su contexto dentro del marco normativo colombiano.]

## Identificación de Riesgos Artículo por Artículo

Aquí se presenta una tabla resumen de los artículos donde se detectaron riesgos, seguida del análisis detallado de cada uno.

### Tabla Resumen de Artículos con Riesgos

| Artículo | Tipo(s) de Riesgo Detectado         | Grado de Severidad | Breve Descripción Inicial del Riesgo |
|----------|--------------------------------------|--------------------|--------------------------------------|
| [Número] | [Ej: Privatización, Ambiental]       | [Alto/Medio/Bajo]  | [Síntesis muy corta del problema]    |
| ...      | ...                                  | ...                | ...                                  |
*(Incluir solo artículos con riesgos. Si no hay riesgos detectados significativos, indicar algo como "No se detectaron riesgos significativos bajo los criterios de El Guardián Legislativo en el análisis superficial" o similar en la conclusión.)*

<br>

### Análisis Detallado de Artículos Problemáticos

*(Solo se incluirán en esta sección los artículos identificados en la tabla anterior. Si no hay, omitir esta sección o indicar "No se encontraron artículos con riesgos que requieran análisis detallado.")*

---

#### **Artículo [Número del Artículo]**

* **Texto Original Relevante:**
    > [Copiar aquí el fragmento exacto del texto del artículo que genera el riesgo, usando una cita Markdown (>).]

* **Tipo(s) de Riesgo Detectado:**
    * [Lista de tipos de riesgo: Ej: Privatización]
    * ...

* **Descripción y Fundamento del Riesgo ("El Mico"):**
    [Explicación clara de por qué este texto es problemático, cómo choca con la norma superior (Constitución, Ley, Tratado), y cuál es el argumento legal.]

* **Implicaciones Potenciales:**
    * [Consecuencia 1]
    * [Consecuencia 2]
    * ...

* **Grado de Severidad:** **[Alto | Medio | Bajo]**
    [Breve justificación.]

* **Referencias Legales Clave:**
    * [Artículo X de la Constitución Política de Colombia]
    * [Artículo Y de la Ley Z]
    * [Tratado/Convenio Internacional, Artículo W]
    * [Jurisprudencia relevante]
    * ...

* **Recomendación de Enmienda/Acción:**
    [Propuesta concreta para modificar el texto o una recomendación general para mitigar el riesgo, explicando cómo corrige el problema.]

---

*(... Repetir la estructura detallada anterior para cada artículo identificado con riesgos ...)*

---

## Conclusión y Recomendaciones Estratégicas

[Valoración global del proyecto, resumen de hallazgos graves y recomendaciones estratégicas (archivar, modificar, participación, etc.). Si no se encontraron riesgos, indicarlo aquí.]
`;

// ##############################################################

// Referencias a elementos del DOM
const pdfFileInput = document.getElementById('pdfFile'); // Input de archivo oculto
const mainActionButton = document.getElementById('mainActionButton'); // El botón principal
const fileNameDisplay = document.getElementById('fileNameDisplay'); // Span para mostrar el nombre
const fileNameContainer = document.getElementById('fileNameContainer'); // Contenedor del nombre del archivo
const statusDiv = document.getElementById('status'); // Área de estado
const resultSection = document.getElementById('resultSection'); // Sección de resultados
const downloadLink = document.getElementById('downloadLink'); // Enlace de descarga

// Variable para almacenar el archivo seleccionado
let selectedFile = null;

// Colores definidos en CSS (convertidos a RGB para jsPDF)
const COLORS = {
    darkBlue: [30, 42, 71], // #1e2a47
    gold: [212, 175, 55], // #d4af37
    darkGray: [45, 52, 54], // #2d3436
    lightGray: [178, 190, 195], // #b2bec3
    white: [255, 255, 255], // #ffffff
    textDark: [44, 62, 80], // #2c3e50
    textLight: [236, 240, 241], // #ecf0f1
    quoteBar: [189, 195, 199] // #bdc3c7
};


// Acceder a jsPDF, pdfjsLib y jspdf-autotable (asegúrate de que estén cargadas en el HTML)
// pdfjsLib, jsPDF y doc.autoTable se asumen disponibles globalmente después de cargar los scripts en el HTML


// --- Función para mostrar mensajes de estado ---
function showStatus(message, type = 'info') {
    statusDiv.className = 'status-section card'; // Resetear clases, mantener card
    statusDiv.classList.add(`status-${type}`); // Añadir clase específica del tipo
    statusDiv.innerHTML = `<p>${message}</p>`; // Envolver mensaje en párrafo
    statusDiv.style.display = 'block';
}

// --- Función para leer texto del PDF usando PDF.js ---
// (Se mantiene la lógica de extracción mejorada de respuestas anteriores)
async function extractPdfText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const typedArray = new Uint8Array(event.target.result);
                // Asegurarse de que el workerSrc esté configurado para pdfjsLib
                 if (!window.pdfjsLib || !window.pdfjsLib.GlobalWorkerOptions || !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                     console.warn("pdfjsLib workerSrc no configurado o pdfjsLib no cargado correctamente.");
                     // Intentar configurar por defecto si pdfjsLib está disponible pero workerSrc no
                     if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
                          window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
                     } else {
                         // Si pdfjsLib no está disponible, lanzar error
                         throw new Error("La librería pdfjsLib no está cargada. Asegúrate de incluir los scripts en tu HTML.");
                     }
                 }

                const loadingTask = window.pdfjsLib.getDocument({ data: typedArray });
                const pdf = await loadingTask.promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();

                     // --- Inicio Lógica de ordenación y espaciado ---
                    let lastY = -1;
                    let lastItem = null;
                    let pageText = '';
                    // Ordenar items por posición vertical (descendente) y luego horizontal (ascendente)
                    const sortedItems = textContent.items.sort((a, b) => {
                         if (a.transform[5] !== b.transform[5]) {
                             return b.transform[5] - a.transform[5]; // Sort by Y position descending
                         }
                         return a.transform[4] - b.transform[4]; // Sort by X position ascending for same Y
                     });

                    sortedItems.forEach(item => {
                         const yPosition = item.transform[5];
                         // Add newline if vertical distance is significant (new line or paragraph)
                         // Consider average item height for better thresholding
                         const avgHeight = textContent.items.reduce((sum, item) => sum + item.height, 0) / textContent.items.length || 10;
                         if (lastY !== -1 && (lastY - yPosition) > (avgHeight * 1.5)) { // Threshold based on average height
                             pageText += '\n';
                         }
                         const xPosition = item.transform[4];
                         // Add space if horizontal distance is significant (between words)
                         if (lastItem !== null) {
                             const lastX = lastItem.transform[4];
                             const lastItemWidth = lastItem.width;
                             // Threshold based on average character width or a fixed small value
                             const avgCharWidth = textContent.items.reduce((sum, item) => sum + item.width / item.str.length, 0) / textContent.items.length || 1; // Avg char width
                             if (xPosition > (lastX + lastItemWidth + avgCharWidth * 0.5)) { // Threshold based on avg char width
                                 pageText += ' ';
                             }
                         }
                         pageText += item.str;
                         lastY = yPosition;
                         lastItem = item;
                     });
                    // --- Fin Lógica de ordenación y espaciado ---

                    fullText += pageText + '\n\n'; // Add two newlines between pages
                    page.cleanup(); // Release page resources
                }
                 fullText = fullText.replace(/[ \t]+/g, ' '); // Reduce multiple spaces/tabs to single space
                 fullText = fullText.replace(/\n\s*\n/g, '\n\n'); // Reduce multiple blank lines to single blank line
                 fullText = fullText.trim(); // Remove leading/trailing whitespace

                resolve(fullText);
            } catch (error) {
                console.error("Error al leer PDF con pdf.js:", error);
                reject(`Error al procesar el archivo PDF: ${error.message || error}. Asegúrate de que sea un PDF de texto seleccionable y las librerías pdf.js estén cargadas.`);
            }
        };
        reader.onerror = (error) => {
            console.error("Error de FileReader:", error);
            reject("Error al leer el archivo localmente.");
        };
        reader.readAsArrayBuffer(file);
    });
}


// --- Función para llamar a la API de Gemini ---
// (Se mantiene la lógica anterior, incluyendo manejo de errores y estructura del prompt)
async function callGeminiAPI(prompt, pdfText) {
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "AQUI_PEGA_TU_GOOGLE_API_KEY") {
        throw new Error("Error de configuración: La Google API Key no ha sido definida en script.js. ¡Es inseguro en frontend!");
    }

    const model = 'gemini-1.5-flash-001'; // O 'gemini-1.5-pro-001' si tienes acceso y prefieres un modelo más potente
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`;

    const contentToSend = `
${prompt}

---

**Texto del Proyecto de Ley (para Análisis):**
--- INICIO DEL DOCUMENTO ---
${pdfText}
--- FIN DEL DOCUMENTO ---

**Tarea Final:**
Analiza el "Texto del Proyecto de Ley" anterior siguiendo estrictamente todas las "Instrucciones para El Guardián Legislativo" y genera el reporte completo en el formato Markdown solicitado. Asegúrate de incluir todas las secciones requeridas en el formato de salida Markdown.
    `;

    // Validar tamaño del contenido antes de enviar
    const textEncoder = new TextEncoder();
    const contentBytes = textEncoder.encode(contentToSend);
     const MAX_BYTES_FLASH = 200000; // Aproximado, varía ligeramente. gemini-1.5-flash tiene 1M tokens context.
     // 1 token ~ 4 bytes
     const MAX_CONTENT_BYTES = MAX_BYTES_FLASH * 4; // Usar un límite alto pero precautorio

    if (contentBytes.length > MAX_CONTENT_BYTES) {
         const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
        throw new Error(`El contenido total (instrucciones + texto del documento) es demasiado grande (${contentBytes.length} bytes). El tamaño del PDF original es ~${fileSizeMB} MB. Intenta con un documento más corto o considera procesarlo en un backend.`);
    }


    const requestBody = {
        contents: [{ parts: [{ text: contentToSend }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }, // Aumenta maxOutputTokens si esperas reportes muy largos
         safetySettings: [
             { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
             { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
             { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
             { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
         ]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            let errorData; try { errorData = await response.json(); } catch (e) { /* ignore */ }
            console.error("Error API response body:", errorData);
             let apiErrorMessage = errorData?.error?.message || JSON.stringify(errorData) || response.statusText;

            if (response.status === 400) {
                 if (apiErrorMessage.toLowerCase().includes("api key not valid")) throw new Error("Error de API: La clave proporcionada no es válida. Verifica GOOGLE_API_KEY.");
                 if (apiErrorMessage.toLowerCase().includes("invalid value at 'contents[0].parts[0].text.length'") || apiErrorMessage.toLowerCase().includes("the total number of input tokens exceeds")) throw new Error(`Error de API: El texto del documento es demasiado largo para el modelo ${model}.`);
                 throw new Error(`Error de solicitud inválida a la API (${response.status}): ${apiErrorMessage}`);
            }
             if (response.status === 429 || apiErrorMessage.toLowerCase().includes("quota") || apiErrorMessage.toLowerCase().includes("rate limit")) throw new Error("Error de API: Has excedido tu cuota o tasa límite.");
             if (response.status >= 500) throw new Error(`Error del servidor API (${response.status}): ${apiErrorMessage}. El servicio puede no estar disponible.`);

            throw new Error(`Error inesperado de la API (${response.status}): ${apiErrorMessage}`);
        }

        const data = await response.json();
        console.log("API Success Response:", data);

         if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
             // Success: Content generated
             return data.candidates[0].content.parts[0].text;
         } else if (data.promptFeedback?.blockReason) {
             // API blocked the prompt/content
             const blockReason = data.promptFeedback.blockReason;
             console.warn(`Contenido bloqueado por la API. Razón: ${blockReason}`);
             throw new Error(`La solicitud fue bloqueada por la API por razones de seguridad (${blockReason}).`);
         }
         else if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
             // API finished for a reason other than STOP (e.g., MAX_TOKENS, RECITATION)
             const finishReason = data.candidates[0].finishReason;
             console.warn(`API call finished with reason: ${finishReason}. Output might be incomplete.`);
             let userMessage = `El análisis no pudo completarse completamente (${finishReason}).`;
             if (finishReason === 'MAX_TOKENS') userMessage += " El resultado excede el límite máximo de tokens.";
             if (finishReason === 'RECITATION') userMessage += " El modelo detectó contenido similar a sus datos de entrenamiento.";

             if (data.candidates[0].content?.parts?.[0]?.text) {
                 // Return partial text if available
                 console.warn("Devolviendo texto parcial debido a finishReason:", finishReason);
                 showStatus(`${userMessage} Mostrando resultado parcial.`, 'warning');
                 return data.candidates[0].content.parts[0].text;
             } else {
                 // No text generated despite having a candidate and finish reason
                 throw new Error(userMessage + " No se generó texto de salida.");
             }
         }
         else {
            console.warn("Respuesta inesperada o vacía de la API:", data);
            throw new Error("La API devolvió una respuesta válida pero en un formato inesperado o vacío.");
        }

    } catch (error) {
        console.error("Error detallado al llamar a la API de Gemini:", error);
        let userMessage = error.message || 'Ocurrió un problema desconocido durante el análisis.';

         // Enhance common API error messages
         if (userMessage.includes("API key not valid")) userMessage = "Error de Configuración: La Google API Key definida no es válida.";
         if (userMessage.includes("quota") || userMessage.includes("rate limit")) userMessage = "Error de API: Cuota excedida o tasa límite alcanzada.";
         if (userMessage.includes("NetworkError") || userMessage.includes("Failed to fetch")) userMessage = "Error de Red: No se pudo conectar con la API de Google.";
         // Keep block reason message as is if it's already informative

        throw new Error(userMessage); // Re-lanza con mensaje mejorado
    }
}


// --- Función para generar PDF con jsPDF ---
// *** MEJORADA: Implementa jspdf-autotable y formato más elegante ***
function generatePdfWithFooter(analysisText, footerText = "Reporte El Guardián Legislativo") {
    const { jsPDF } = window.jspdf;
     // Check if jsPDF and autoTable plugin are loaded
    if (!jsPDF) { console.error("jsPDF library not loaded."); throw new Error("La librería jsPDF no está cargada. Asegúrate de incluir el script de jspdf."); }
     // We check for doc.autoTable existence to confirm the plugin loaded correctly
     // Need to create a temporary doc instance to access autoTable method for the check
     let tempDoc;
     try { tempDoc = new jsPDF(); if (typeof tempDoc.autoTable !== 'function') { throw new Error('autoTable not found'); } }
     catch (e) { console.error("jspdf-autotable plugin not loaded.", e); throw new Error("El plugin jspdf-autotable no está cargado. Asegúrate de incluir el script del plugin."); }


    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const margin = 20; const pageHeight = doc.internal.pageSize.getHeight(); const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin; const footerStartY = pageHeight - margin + 5; const contentEndY = pageHeight - margin - 5;
    const FONT_NORMAL = "helvetica"; // helvetica is a standard built-in font
    const STYLE_NORMAL = "normal"; const STYLE_BOLD = "bold";
    const SIZE_H1 = 22; const SIZE_H2 = 18; const SIZE_H3 = 15; const SIZE_H4 = 13; const SIZE_NORMAL = 11;
    const SIZE_SMALL = 9; const SIZE_FOOTER = 8;
    const SPACE_AFTER_H1 = 12; const SPACE_AFTER_H2 = 10; const SPACE_AFTER_H3 = 8; const SPACE_AFTER_H4 = 7; const SPACE_AFTER_P = 6;
     const SPACE_AFTER_LIST = 6; const SPACE_AFTER_QUOTE = 6; const SPACE_AFTER_TABLE = 8;
     const HORIZONTAL_RULE_MARGIN_Y = 5; // Space around '---' separator
     const LIST_INDENT = 8; const QUOTE_BAR_WIDTH = 2;
     const QUOTE_PADDING = 3; // Padding inside the quote box


    let currentPage = 1;
    let y = margin; // Start y at the top margin

    const addFooter = (pageNumber) => {
        // Save current text state
        const previousSize = doc.getFontSize();
        const previousFont = doc.getFont().fontName;
        const previousStyle = doc.getFont().fontStyle;
        const previousColor = doc.getTextColor();

        doc.setFontSize(SIZE_FOOTER);
        doc.setFont(FONT_NORMAL, STYLE_NORMAL);
        doc.setTextColor(100); // Gray color

        doc.text(footerText, pageWidth / 2, footerStartY, { align: 'center' });
        doc.text(`Página ${pageNumber}`, pageWidth - margin, footerStartY, { align: 'right' });

        // Restore previous text state
        doc.setFontSize(previousSize);
        doc.setFont(previousFont, previousStyle);
        doc.setTextColor(previousColor);
    };

     // Function to check if a new page is needed BEFORE drawing a block or significant element
    const checkAndAddPage = (requiredHeight) => {
         // If drawing this content block would exceed the content end margin
         if (y + requiredHeight > contentEndY) {
             addFooter(currentPage); // Add footer to the current page before adding a new one
             doc.addPage(); // Add a new page
             currentPage++; // Increment page number
             y = margin; // Reset y position to the top margin of the new page
             return true; // Indicate that a new page was added
         }
         return false; // Indicate that no new page was needed
     };

    // Helper to parse Markdown table lines
     const parseMarkdownTable = (lines) => {
         let head = [];
         let body = [];
         let separatorFound = false;

         for (const line of lines) {
             // Split by |, remove leading/trailing whitespace, and filter out empty strings from split (first/last elements)
             const cells = line.split('|').map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
             if (cells.length > 0) {
                 // Check if this line is the separator (contains at least 3 hyphens in each cell, optional colons for alignment)
                 if (cells.every(cell => /^\s*:?-+:?\s*$/.test(cell))) {
                     separatorFound = true;
                 } else if (!separatorFound) {
                     // This is a header row
                     head.push(cells);
                 } else {
                     // This is a body row
                     body.push(cells);
                 }
             }
         }
          // If no explicit separator was found, treat the first line that looks like a header as header
         if (!separatorFound && head.length > 0) {
             body = head.slice(1); // The rest become body
             head = [head[0]]; // The first row is header
         } else if (!separatorFound && head.length === 0) {
             // If no separator and no lines looked like headers (e.g., only body lines),
             // treat all lines as body and have no header.
             body = lines.map(line => line.split('|').map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)).filter(row => row.length > 0);
             head = []; // No header
         }

         return { head, body };
     };


    const lines = analysisText.split('\n');
    let currentBlockLines = [];
    let currentBlockType = 'paragraph'; // Initial block type

    const processCurrentBlock = () => {
        if (currentBlockLines.length === 0) {
             // If the block is empty (e.g., just multiple blank lines),
             // just ensure y is advanced if not at the very start.
             // Add a small space for paragraph break, but not immediately at the top margin.
             if (y > margin + SPACE_AFTER_P * 0.5) { // Avoid adding space if very close to top margin
                 checkAndAddPage(SPACE_AFTER_P); // Check if the space itself fits
                 y += SPACE_AFTER_P; // Add space for empty block/paragraph separation
             }
             currentBlockType = 'paragraph'; // Reset type for the next block
             return; // Nothing to draw for an empty block
        }

        // Determine style and properties based on block type before processing lines
        let fontSize = SIZE_NORMAL;
        let fontStyle = STYLE_NORMAL;
        let spaceAfter = SPACE_AFTER_P; // Default space after paragraph
        let align = 'left';
        let currentIndent = 0;
        let linesToDraw = []; // Prepare array for text lines after splitting
        let blockContentHeight = 0; // Height needed *before* spaceAfter


        if (currentBlockType === 'heading') {
            const firstLine = currentBlockLines[0];
             // Determine heading level and remove markdown prefix
             let headingText = firstLine;
             if (firstLine.startsWith('#### ')) { fontSize = SIZE_H4; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H4; headingText = firstLine.substring(5).trim(); }
             else if (firstLine.startsWith('### ')) { fontSize = SIZE_H3; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H3; headingText = firstLine.substring(4).trim(); }
             else if (firstLine.startsWith('## ')) { fontSize = SIZE_H2; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H2; headingText = firstLine.substring(3).trim(); }
             else if (firstLine.startsWith('# ')) { fontSize = SIZE_H1; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H1; headingText = firstLine.substring(2).trim(); }
             else { // Should not happen if parsing is correct, but fallback
                 currentBlockType = 'paragraph'; fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_P; headingText = firstLine;
             }
             linesToDraw = doc.splitTextToSize(headingText, usableWidth - currentIndent); // Split heading if too long
             blockContentHeight = linesToDraw.length * (doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR);


        } else if (currentBlockType === 'list') {
             // List items are processed line by line within the list block drawing loop below
             fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_LIST; currentIndent = LIST_INDENT;
             // Calculate estimated height for the entire list block
             blockContentHeight = currentBlockLines.reduce((totalHeight, listItemLine) => {
                 const listItemContent = listItemLine.trim().substring(1).trim(); // Text after bullet
                 // Estimate height for this item
                 const estimatedLinesInItem = doc.splitTextToSize(listItemContent, usableWidth - currentIndent).length;
                 return totalHeight + estimatedLinesInItem * (doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR);
             }, 0);
        } else if (currentBlockType === 'quote') {
            // Quote text needs to be joined and then split
            const quoteText = currentBlockLines.join('\n');
            const cleanedQuoteText = quoteText.split('\n').map(line => line.startsWith('> ') ? line.substring(2) : line).join('\n'); // Remove '> '

            fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_QUOTE; currentIndent = LIST_INDENT + QUOTE_BAR_WIDTH + QUOTE_PADDING; // Adjust indent for bar + padding
            linesToDraw = doc.splitTextToSize(cleanedQuoteText, usableWidth - currentIndent);
             const lineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
             blockContentHeight = linesToDraw.length * lineHeight + QUOTE_PADDING * 2; // Add vertical padding


        } else if (currentBlockType === 'table') {
             // Table is handled differently by autoTable. Parsing happens here.
             fontSize = SIZE_SMALL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_TABLE;
             const tableData = parseMarkdownTable(currentBlockLines);

             // autoTable calculates height internally, we just need to ensure enough space for it + spaceAfter
             // We'll rely on checkAndAddPage and doc.autoTable's own page breaking
              blockContentHeight = 1; // Placeholder, autoTable manages height


        }
         else if (currentBlockType === 'horizontal_rule') {
             // Horizontal rule handling - Draw immediately, no linesToDraw
             spaceAfter = HORIZONTAL_RULE_MARGIN_Y; // Space after rule
             const spaceBefore = HORIZONTAL_RULE_MARGIN_Y; // Space before rule

             checkAndAddPage(spaceBefore + 1 + spaceAfter); // Check space for margin, line, margin

             y += spaceBefore; // Add space before the line
             doc.line(margin, y, pageWidth - margin, y); // Draw the line
             y += 1; // Move y past the line itself
             // spaceAfter is added below common drawing logic

             currentBlockLines = []; // Clear lines
             currentBlockType = 'paragraph'; // Reset type
             y += spaceAfter; // Add space after the rule
             return; // Done processing horizontal rule block
         }
        else { // paragraph or any other unrecognized block type
            fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_P;
             const paragraphText = currentBlockLines.join('\n');
             linesToDraw = doc.splitTextToSize(paragraphText, usableWidth - currentIndent);
             blockContentHeight = linesToDraw.length * (doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR);
        }

        // Set font size and style for drawing (except for list bullets which use SIZE_NORMAL)
        doc.setFontSize(fontSize);
        doc.setFont(FONT_NORMAL, fontStyle);
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]); // Default text color

        // Check if this block + its spaceAfter fits on the current page.
        // If not, add a new page.
         checkAndAddPage(blockContentHeight + spaceAfter); // Check based on calculated content height


        // --- Draw the Block Content ---
        if (currentBlockType === 'list') {
            currentBlockLines.forEach(listItemLine => {
                 // Ensure listItemLine starts with bullet format
                 if (!listItemLine.trim().match(/^[-*+] /)) {
                     // Fallback for unexpected line format within a list block
                     console.warn("Line in list block doesn't start with bullet:", listItemLine);
                     const linesInItem = doc.splitTextToSize(listItemLine, usableWidth - currentIndent);
                     const itemHeight = linesInItem.length * (doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR);
                     checkAndAddPage(itemHeight); // Check per list item
                     linesInItem.forEach(line => {
                         const currentLineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                         doc.text(line, margin + currentIndent, y, { align: align, maxWidth: usableWidth - currentIndent });
                         y += currentLineHeight;
                     });
                     return; // Process next list item line
                 }

                 const listItemContent = listItemLine.trim().substring(1).trim(); // Get text after bullet and space
                 const linesToDrawItem = doc.splitTextToSize(listItemContent, usableWidth - currentIndent);
                 const listItemHeight = linesToDrawItem.length * (doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR);

                 checkAndAddPage(listItemHeight); // Check if this list item fits

                 // Draw the bullet (using SIZE_NORMAL for consistent bullet appearance)
                 const bulletYPosition = y + doc.getTextDimensions('Tg', { fontSize: SIZE_NORMAL }).h * 0.8; // Align bullet vertically
                 doc.setFontSize(SIZE_NORMAL); // Use normal size for bullet
                 doc.text("•", margin + currentIndent - 4, bulletYPosition, { align: 'right' });
                 doc.setFontSize(fontSize); // Restore original font size for the text

                 // Draw the list item text
                 linesToDrawItem.forEach((line) => {
                     const currentLineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                     // checkAndAddPage(currentLineHeight); // autoTable handles internal page breaks for tables. For lists, item check is usually enough.
                     doc.text(line, margin + currentIndent, y, { align: align, maxWidth: usableWidth - currentIndent });
                     y += currentLineHeight;
                 });
            });

        } else if (currentBlockType === 'quote') {
             const startY = y; // Capture start Y for drawing the quote bar

             y += QUOTE_PADDING; // Add top padding

             // Draw the quote text lines
             linesToDraw.forEach((line) => {
                 const currentLineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                 doc.text(line, margin + currentIndent, y, { align: align, maxWidth: usableWidth - currentIndent });
                 y += currentLineHeight;
             });

             y += QUOTE_PADDING; // Add bottom padding

             // Draw the quote bar (starts at startY, ends at current y)
             if (y > startY) { // Only draw bar if text/padding was added
                 doc.setFillColor(COLORS.quoteBar[0], COLORS.quoteBar[1], COLORS.quoteBar[2]); // Soft gray color
                 doc.rect(margin + currentIndent - QUOTE_BAR_WIDTH - QUOTE_PADDING, startY, QUOTE_BAR_WIDTH, y - startY, 'F'); // 'y - startY' is the actual height including padding
             }

        } else if (currentBlockType === 'table') {
            const tableData = parseMarkdownTable(currentBlockLines);

            // Use autoTable to draw the table
            // It handles page breaks automatically
             doc.autoTable({
                 head: tableData.head,
                 body: tableData.body,
                 startY: y, // Start table at current y position
                 margin: { left: margin, right: margin },
                 theme: 'grid', // Add borders
                 headStyles: {
                     fillColor: COLORS.darkBlue, // Dark blue background for headers
                     textColor: COLORS.textLight, // Light text color
                     fontStyle: STYLE_BOLD,
                     fontSize: SIZE_SMALL
                 },
                 bodyStyles: {
                     textColor: COLORS.textDark,
                     fontSize: SIZE_SMALL
                 },
                 styles: {
                     cellPadding: 3, // Padding within cells
                     rowPageBreak: 'avoid', // Avoid breaking rows across pages
                     // overflow: 'linebreak' // Handle text overflow by breaking lines (default is 'ellipsize' or 'visible')
                 },
                 columnStyles: {
                     // You could define styles for specific columns here, e.g., 0: { cellWidth: 20 }
                 },
                 didDrawPage: function(data) {
                      // Draw footer on pages generated by autoTable
                      addFooter(doc.internal.getNumberOfPages());
                 }
             });

            // Update y position to be after the table
             y = doc.autoTable.previous.finalY;


        } else { // paragraph, heading (after removing markdown prefix) or any other block type
             // For headings, potentially change text color
             if (currentBlockType === 'heading') {
                  doc.setTextColor(COLORS.darkBlue[0], COLORS.darkBlue[1], COLORS.darkBlue[2]); // Dark blue for headings
             }

             linesToDraw.forEach((line) => {
                 const currentLineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                 doc.text(line, margin + currentIndent, y, { align: align, maxWidth: usableWidth - currentIndent });
                 y += currentLineHeight;
             });

             // Reset color after heading
             if (currentBlockType === 'heading') {
                  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
             }
        }

        // Add space AFTER the block content has been drawn (except for HR, which adds its own)
        if (currentBlockType !== 'horizontal_rule') {
             y += spaceAfter;
        }


        // Reset for the next block
        currentBlockLines = [];
        currentBlockType = 'paragraph';
    };


    // --- Main loop to process lines and accumulate blocks ---
    lines.forEach((line) => {
        const trimmedLine = line.trim();

        // Detect the start of a new block type. Process the current block before starting a new one.
        // A blank line indicates the end of the previous block.
        if (trimmedLine === '') {
             processCurrentBlock(); // Process the block accumulated so far
             currentBlockType = 'paragraph'; // The next block will be a paragraph unless markdown is detected
         } else if (trimmedLine.startsWith('#') && currentBlockLines.length === 0) {
             // Start of a heading block (#, ##, ###, ####). Process only if it's the first line of the *potential* block
             processCurrentBlock(); // Process previous block
             currentBlockLines.push(trimmedLine);
             currentBlockType = 'heading';
         } else if (trimmedLine.match(/^[-*+] /) && currentBlockLines.length === 0 && currentBlockType !== 'quote' && currentBlockType !== 'table' && !currentBlockType.startsWith('heading')) {
             // Start of a list item. Process only if it's the first line of the *potential* block
             // and not inside another block type.
             processCurrentBlock(); // Process previous block
             currentBlockLines.push(trimmedLine);
             currentBlockType = 'list';
          } else if (trimmedLine.startsWith('> ') && currentBlockLines.length === 0 && currentBlockType !== 'list' && currentBlockType !== 'table' && !currentBlockType.startsWith('heading')) {
             // Start of a quote line. Process only if it's the first line of the *potential* block
              // and not inside another block type.
              processCurrentBlock(); // Process previous block
             currentBlockLines.push(trimmedLine);
             currentBlockType = 'quote';
          } else if (trimmedLine.startsWith('|') && currentBlockLines.length === 0 && currentBlockType !== 'list' && currentBlockType !== 'quote' && !currentBlockType.startsWith('heading')) {
              // Start of a table line. Process only if it's the first line of the *potential* block
              // and not inside another block type.
              // A table block continues as long as lines start with '|'
              processCurrentBlock(); // Process previous block
              currentBlockLines.push(trimmedLine);
              currentBlockType = 'table';
          } else if (currentBlockType === 'table' && trimmedLine.startsWith('|')) {
              // Continuation of a table block
              currentBlockLines.push(trimmedLine);
          }
          else if (trimmedLine.match(/^-{3,}$/) && currentBlockLines.length === 0 && currentBlockType === 'paragraph') {
              // Horizontal rule '---' as a standalone line indicates a separator.
              // Ensure it's a paragraph type block currently and it's the first line.
              processCurrentBlock(); // Process previous block
              // No need to push the line itself, just set the type to trigger HR drawing
              currentBlockType = 'horizontal_rule';
              // Horizontal rule block is processed immediately within processCurrentBlock
          }
         else {
            // This line continues the current block type or is a paragraph line
            // (Handles multi-line paragraphs, multi-line list items, multi-line quotes)
             // If coming from a table block but the line doesn't start with '|', the table block ends
             if (currentBlockType === 'table') {
                 processCurrentBlock(); // Process the table accumulated so far
                 currentBlockLines.push(trimmedLine); // Push the current line as the start of a new paragraph block
                 currentBlockType = 'paragraph';
             } else {
                 currentBlockLines.push(trimmedLine);
             }
        }
    });

    // Process any remaining lines in the last block after the loop finishes
    processCurrentBlock();

    // Add footer to the very last page if there is any content drawn
    // Check if y is significantly past the initial margin, indicating content was added
     // This check is less reliable with autoTable as y is updated differently.
     // A better check is if any page was added beyond the first, or if the first page has content past the margin.
     // Use doc.internal.pageSize.getHeight() - margin to check against the *content end* of the page
     const hasContentOnLastPage = y > margin || (doc.internal.getNumberOfPages() > 1 && doc.autoTable.previous?.finalY > margin);

     if (hasContentOnLastPage || lines.length > 0) {
        addFooter(doc.internal.getNumberOfPages());
     }


    try {
        const pdfBlob = doc.output('blob');
        return pdfBlob;
    } catch (error) {
        console.error("Error al generar el PDF con jsPDF:", error);
        throw new Error("Error al crear el archivo PDF de salida. " + error.message);
    }
}


// --- Event Listener para el Input de Archivo (cuando se selecciona un archivo) ---
pdfFileInput.addEventListener('change', () => {
    if (pdfFileInput.files.length > 0) {
        selectedFile = pdfFileInput.files[0];
        fileNameDisplay.textContent = selectedFile.name;
        fileNameContainer.style.display = 'block'; // Mostrar nombre del archivo

        // Cambiar el estado del botón principal a "Listo para Analizar"
        mainActionButton.classList.remove('state-initial');
        mainActionButton.classList.remove('state-analyzing'); // Asegurarse de remover otros estados
        mainActionButton.classList.remove('state-error');
        mainActionButton.classList.add('state-file-selected');
        mainActionButton.querySelector('.button-text').textContent = 'Analizar Documento';
        mainActionButton.disabled = false; // Asegurarse de que esté habilitado

        // Ocultar mensajes de estado y resultados anteriores
        statusDiv.style.display = 'none';
        resultSection.style.display = 'none';

    } else {
        // Si se cancela la selección o se limpia
        selectedFile = null;
        fileNameDisplay.textContent = '';
        fileNameContainer.style.display = 'none';

        // Resetear el botón principal a su estado inicial
        mainActionButton.classList.remove('state-file-selected');
        mainActionButton.classList.remove('state-analyzing');
        mainActionButton.classList.remove('state-error');
        mainActionButton.classList.add('state-initial');
        mainActionButton.querySelector('.button-text').textContent = 'Cargar Proyecto de Ley (PDF)';
        mainActionButton.disabled = false; // Debería estar habilitado para permitir clic y abrir explorador

         // Ocultar mensajes de estado y resultados anteriores
        statusDiv.style.display = 'none';
        resultSection.style.display = 'none';
    }
});

// --- Event Listener para el Botón Principal (maneja Cargar y Analizar) ---
mainActionButton.addEventListener('click', async () => {
    if (!selectedFile) {
        // Si no hay archivo seleccionado, el botón actúa como disparador del input
        pdfFileInput.click(); // Abre la ventana de selección de archivo
        return; // Salir de la función click del botón
    }

    // Si hay un archivo seleccionado, el botón inicia el análisis
    // Validación de API Key antes de empezar el proceso de análisis
     if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "AQUI_PEGA_TU_GOOGLE_API_KEY") {
         showStatus("Error de Configuración: Por favor, reemplaza 'AQUI_PEGA_TU_GOOGLE_API_KEY' en script.js con tu clave de API. (¡Recuerda la advertencia de seguridad!)", 'error');
         mainActionButton.classList.remove('state-analyzing');
         mainActionButton.classList.remove('state-file-selected');
         mainActionButton.classList.add('state-error'); // Poner botón en estado de error
         mainActionButton.querySelector('.button-text').textContent = 'Error de Config';
         return; // Salir si la API key es el placeholder
     }

     // Check if required libraries are loaded before starting
     if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
          showStatus("Error: La librería jsPDF no se cargó correctamente. Revisa tu conexión y la etiqueta <script>.", 'error');
          mainActionButton.classList.remove('state-analyzing');
          mainActionButton.classList.remove('state-file-selected');
          mainActionButton.classList.add('state-error');
          mainActionButton.querySelector('.button-text').textContent = 'Error Libs';
          return; // Exit if libraries are not ready
     }
     // Check for autoTable plugin by trying to access it from a temporary jsPDF instance
     try { const tempDoc = new window.jspdf.jsPDF(); if (typeof tempDoc.autoTable !== 'function') { throw new Error('autoTable not found'); } }
     catch (e) {
          showStatus("Error: El plugin jspdf-autotable no se cargó correctamente. Revisa tu conexión y la etiqueta <script> para autotable.", 'error');
          mainActionButton.classList.remove('state-analyzing');
          mainActionButton.classList.remove('state-file-selected');
          mainActionButton.classList.add('state-error');
          mainActionButton.querySelector('.button-text').textContent = 'Error Libs';
          console.error("Error loading jspdf-autotable:", e);
          return; // Exit if autotable is not ready
     }


    // Iniciar el proceso de análisis
    mainActionButton.disabled = true;
    mainActionButton.classList.remove('state-file-selected');
    mainActionButton.classList.remove('state-error'); // Limpiar estado de error previo
    mainActionButton.classList.add('state-analyzing');
    mainActionButton.querySelector('.button-text').textContent = 'Analizando...'; // El spinner se mostrará via CSS

    resultSection.style.display = 'none'; // Ocultar resultados anteriores
    downloadLink.href = '#'; // Limpiar enlace de descarga
    downloadLink.removeAttribute('download');

    showStatus("Iniciando análisis...", 'processing');

    try {
        showStatus(`Leyendo el archivo PDF "${selectedFile.name}"...`, 'processing');
        const pdfText = await extractPdfText(selectedFile);

        if (!pdfText || pdfText.length < 100) {
             const msg = `El archivo PDF parece tener muy poco texto (${pdfText ? pdfText.length : 0} caracteres) o no se pudo extraer correctamente. Asegúrate de que sea un PDF de texto seleccionable y contenga suficiente contenido.`;
             throw new Error(msg);
        }

        showStatus(`PDF leído (${pdfText.length} caracteres). Enviando a El Guardián Legislativo para análisis...`, 'processing');
        console.log("Texto extraído (inicio):", pdfText.substring(0, 500) + "...");

        // Llama a la API usando las instrucciones y el texto extraído
        const analysisResult = await callGeminiAPI(ANALYSIS_INSTRUCTIONS, pdfText);

         // Validar que el resultado del análisis no esté vacío o sea solo espacios
         if (!analysisResult || analysisResult.trim().length < 50) {
             throw new Error("El análisis de la IA no produjo un resultado significativo. Inténtalo de nuevo o prueba con otro documento.");
         }

        showStatus("Análisis de El Guardián Legislativo completado. Generando reporte PDF...", 'processing');
        console.log("Resultado del análisis (inicio):", analysisResult.substring(0, 500) + "...");

        // Generar el blob PDF usando el resultado del análisis
        const pdfBlob = generatePdfWithFooter(analysisResult);

        // Crear URL para el blob y configurar el enlace de descarga
        const pdfUrl = URL.createObjectURL(pdfBlob);
        downloadLink.href = pdfUrl;
         // Crear nombre de archivo más seguro y limpio
        const cleanFileName = selectedFile.name
                                 .replace(/\.pdf$/i, '') // Remove .pdf extension
                                 .replace(/[^a-zA-Z0-9_\-]/g, '_') // Replace non-alphanumeric except _ and - with _
                                 .replace(/__+/g, '_') // Replace multiple underscores with single
                                 .replace(/^_|_$/g, '') // Remove leading/trailing underscores
                                 .substring(0, 50); // Limit length

        downloadLink.setAttribute('download', `reporte_guardian_${cleanFileName || 'documento'}.pdf`);

        resultSection.style.display = 'block'; // Mostrar la sección de resultados
        showStatus("¡Análisis completado! Reporte PDF listo para descargar.", 'success');

        // Botón regresa a estado de éxito o "cargar nuevo"
         mainActionButton.classList.remove('state-analyzing');
         mainActionButton.classList.add('state-success'); // Añadir estado visual de éxito si existe CSS
         mainActionButton.querySelector('.button-text').textContent = 'Descargar Reporte'; // O 'Cargar Nuevo PDF'
         mainActionButton.disabled = false; // Habilitar de nuevo

    } catch (error) {
        console.error("Error en el proceso principal de análisis:", error);
        // Mostrar mensaje de error y poner botón en estado de error
        let userMessage = error.message || 'Ocurrió un problema desconocido durante el análisis.';
        showStatus(userMessage, 'error');

        resultSection.style.display = 'none'; // Asegurarse de que no se muestre el enlace de descarga si hubo error
        downloadLink.href = '#';
        downloadLink.removeAttribute('download');
        // Liberar el Blob URL si se creó antes del error (aunque poco probable en este flujo)
         if (downloadLink.href.startsWith('blob:')) {
             URL.revokeObjectURL(downloadLink.href);
         }

        // Resetear el botón a un estado que indique error o permita reintentar/cargar nuevo
         mainActionButton.classList.remove('state-analyzing');
         mainActionButton.classList.remove('state-file-selected'); // Si estaba en este estado
         mainActionButton.classList.add('state-error');
         mainActionButton.querySelector('.button-text').textContent = 'Error'; // O 'Reintentar' / 'Cargar Nuevo'
         mainActionButton.disabled = false; // Habilitar para que el usuario pueda interactuar (ej. cargar otro archivo)

    } finally {
        // Este finally es útil para limpieza final, pero la gestión del botón
        // se hace mejor en try/catch para reflejar el resultado (éxito/error).
        // Asegurarse de que el spinner no se muestre si el proceso terminó.
         mainActionButton.classList.remove('state-analyzing'); // Doble seguridad
    }
});


// --- Inicialización: Ocultar secciones y configurar estado inicial del botón ---
document.addEventListener('DOMContentLoaded', () => {
    statusDiv.style.display = 'none';
    resultSection.style.display = 'none';
    fileNameContainer.style.display = 'none';

    // Configurar el estado inicial del botón
    mainActionButton.classList.add('state-initial');
    mainActionButton.querySelector('.button-text').textContent = 'Cargar Proyecto de Ley (PDF)';
    mainActionButton.disabled = false; // El botón siempre está habilitado para iniciar el proceso

    // Limpiar el input file si había algo cacheado por el navegador
    pdfFileInput.value = '';
    selectedFile = null;

     // Check for API Key placeholder on load and warn if found
     if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "AQUI_PEGA_TU_GOOGLE_API_KEY") {
         showStatus("Advertencia: La Google API Key no está configurada. Reemplaza 'AQUI_PEGA_TU_GOOGLE_API_KEY' en script.js para que el análisis funcione.", 'warning');
         mainActionButton.classList.add('state-error'); // Poner botón en estado visual de advertencia/error
         mainActionButton.querySelector('.button-text').textContent = 'Configurar API Key'; // Indicar acción necesaria
         // Keep button enabled so user can *try* clicking, which will show the error status again
     }

     // Simple initial check for libraries (might not catch async loading issues)
      setTimeout(() => {
          if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
              console.error("jsPDF not globally available after timeout.");
              showStatus("Error: La librería jsPDF no se cargó correctamente. Revisa tu conexión y la etiqueta <script>.", 'error');
               mainActionButton.classList.add('state-error');
               mainActionButton.querySelector('.button-text').textContent = 'Error jsPDF';
          } else {
              // Try to create a doc instance and check for autoTable
              try {
                  const tempDoc = new window.jspdf.jsPDF();
                  if (typeof tempDoc.autoTable !== 'function') {
                      console.error("jspdf-autotable not available after timeout.");
                      showStatus("Error: El plugin jspdf-autotable no se cargó correctamente. Revisa tu conexión y la etiqueta <script> para autotable.", 'error');
                       mainActionButton.classList.add('state-error');
                       mainActionButton.querySelector('.button-text').textContent = 'Error AutoTable';
                  } else {
                      console.log("jsPDF and autoTable loaded successfully.");
                       // If key is missing, keep the warning, otherwise clear it
                       if (GOOGLE_API_KEY && GOOGLE_API_KEY !== "AQUI_PEGA_TU_GOOGLE_API_KEY") {
                            statusDiv.style.display = 'none'; // Hide initial warning if key is set
                             mainActionButton.classList.remove('state-error');
                             mainActionButton.classList.add('state-initial');
                             mainActionButton.querySelector('.button-text').textContent = 'Cargar Proyecto de Ley (PDF)';
                       }
                  }
              } catch (e) {
                  console.error("Error during jsPDF/autoTable check:", e);
                   showStatus("Error al verificar librerías PDF. Revisa la consola.", 'error');
                    mainActionButton.classList.add('state-error');
                    mainActionButton.querySelector('.button-text').textContent = 'Error Libs';
              }
          }
      }, 500); // Give a little time for scripts to load
});
