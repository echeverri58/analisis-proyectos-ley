// WARNING: HARDCODING API KEYS IN FRONTEND JAVASCRIPT IS INSECURE.
// This is for demonstration/testing purposes ONLY.
// For a production application, API calls should be made from a secure backend server.
// ¡¡¡REEMPLAZA "AQUI_PEGA_TU_GOOGLE_API_KEY" con tu Google API Key!!!
const GOOGLE_API_KEY = "AIzaSyBevIeR9-tElTMw2oKLuJABGpGG0-3iT54";

// Define las instrucciones COMPLETAS para LegisGuardAI, basadas en el prompt mejorado.
// Estas instrucciones guiarán a la IA en el análisis del PDF.
const ANALYSIS_INSTRUCTIONS = `
Tú eres **LegisGuardAI**, un asistente experto altamente especializado en el análisis crítico del ordenamiento jurídico colombiano. Posees un profundo conocimiento de la Constitución Política de Colombia, las leyes fundamentales (como la Ley 99 de 1993), los tratados internacionales de derechos humanos ratificados por Colombia, y la jurisprudencia relevante.

Tu tarea es examinar el **proyecto de ley** (o documento normativo) proporcionado en el texto marcado, **artículo por artículo**. Debes identificar, analizar y reportar cualquier **disposición, redacción, cláusula o "mico"** que represente un riesgo o conflicto con los principios y normas del ordenamiento jurídico colombiano, prestando especial atención a:

1.  **Intereses del Pueblo/Derechos Colectivos:** Disposiciones que vayan en contra del bienestar general, el interés público o los derechos colectivos reconocidos en la Constitución (ej. derecho a un ambiente sano, derechos de las comunidades étnicas, derecho a la participación).
2.  **Privatización de Recursos Naturales:** Cláusulas que permitan, faciliten o fomenten la privatización, concesión o entrega a particulares de recursos naturales renovables y no renovables (agua, bosques, biodiversidad, subsuelo, etc.) de manera contraria a lo establecido en la Constitución Política (ej. control del Estado sobre los recursos) y leyes específicas como la Ley 99 de 1993.
3.  **Impacto Ambiental Negativo:** Normas que afecten negativamente el medio ambiente, la biodiversidad, los ecosistemas, o que vulneren principios constitucionales ambientales (ej. artículo 79, 80, 81 Constitución) o internacionales ratificados.
4.  **Violación de Derechos Humanos:** Disposiciones que vulneren derechos humanos fundamentales o los estándares establecidos en tratados internacionales ratificados por Colombia (ej. Pacto Internacional de Derechos Civiles y Políticos, Pacto de San José, Convenio 169 de la OIT, etc.).
5.  **Ambigüedad y Discrecionalidad:** Lenguaje excesivamente ambiguo, genérico, impreciso o que otorgue una discrecionalidad desmedida a entidades o funcionarios, de forma que pueda debilitar garantías constitucionales, permitir interpretaciones arbitrarias o facilitar abusos.

**Formato de Salida (Markdown):**

Genera tu respuesta final en **texto Markdown** siguiendo estrictamente esta estructura para que sea fácil de visualizar y entender en un reporte PDF. Utiliza encabezados Markdown (#, ##, ###), listas (-), negritas (**) y citas (>) según el formato especificado.

# Análisis Legislativo por LegisGuardAI

## Resumen General del Proyecto de Ley

[Aquí va una síntesis clara y concisa del objetivo principal del proyecto de ley y su contexto dentro del marco normativo colombiano.]

## Identificación de Riesgos Artículo por Artículo

Aquí se presenta una tabla resumen de los artículos donde se detectaron riesgos, seguida del análisis detallado de cada uno.

### Tabla Resumen de Artículos con Riesgos

| Artículo | Tipo(s) de Riesgo Detectado         | Grado de Severidad | Breve Descripción Inicial del Riesgo |
|----------|--------------------------------------|--------------------|--------------------------------------|
| [Número] | [Ej: Privatización, Ambiental]       | [Alto/Medio/Bajo]  | [Síntesis muy corta del problema]    |
| ...      | ...                                  | ...                | ...                                  |
*(Incluir solo artículos con riesgos. Si no hay riesgos detectados significativos, indicar algo como "No se detectaron riesgos significativos bajo los criterios de LegisGuardAI en el análisis superficial" o similar en la conclusión.)*

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
const pdfFileInput = document.getElementById('pdfFile');
const analyzeButton = document.getElementById('analyzeButton');
const statusDiv = document.getElementById('status');
const resultSection = document.getElementById('resultSection');
const downloadLink = document.getElementById('downloadLink');
const fileNameSpan = document.getElementById('file-name'); // Nuevo: para mostrar el nombre del archivo


// Acceder a jsPDF y pdfjsLib (asegúrate de que estén cargadas)
const { jsPDF } = window.jspdf;
// Asumiendo que pdfjsLib ya está disponible en window por la importación del HTML

// --- Función para mostrar mensajes de estado ---
function showStatus(message, type = 'info') {
    statusDiv.className = 'status-section'; // Reinicia las clases
    statusDiv.classList.add(`status-${type}`); // Añade la clase específica del tipo
    statusDiv.innerHTML = message;
    statusDiv.style.display = 'block';
}

// --- Función para leer texto del PDF usando PDF.js ---
// (Mantenemos la lógica anterior que intenta mejorar la extracción de texto)
async function extractPdfText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const typedArray = new Uint8Array(event.target.result);
                // Asegúrate de que GlobalWorkerOptions.workerSrc esté configurado ANTES de getDocument
                 if (!window.pdfjsLib || !window.pdfjsLib.GlobalWorkerOptions || !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                      console.warn("pdfjsLib workerSrc no configurado. Configurando por defecto.");
                     // Esta ruta debe apuntar al archivo pdf.worker.js o pdf.worker.min.js
                     // Si usas CDN, la del mjs es: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs
                     // Si usas una versión no-mjs, la extensión es .js
                     window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
                 }

                const loadingTask = window.pdfjsLib.getDocument({ data: typedArray });
                const pdf = await loadingTask.promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();

                    // Intenta reconstruir el texto de forma más legible
                     let lastY = -1;
                     let lastItem = null; // Para rastrear el último item y estimar espacios horizontales
                     let pageText = '';

                     // Ordenar items por posición Y y luego X para mejor reconstrucción del texto
                     const sortedItems = textContent.items.sort((a, b) => {
                         if (a.transform[5] !== b.transform[5]) {
                              return b.transform[5] - a.transform[5]; // Ordenar por Y descendente (arriba a abajo)
                         }
                         return a.transform[4] - b.transform[4]; // Luego por X ascendente (izquierda a derecha)
                     });


                     sortedItems.forEach(item => {
                         // Añadir salto de línea si hay un gran salto vertical (nueva línea o párrafo)
                         // La posición Y está en item.transform[5]. Los valores más altos están más arriba.
                         // Un salto significativo en Y (hacia abajo) sugiere una nueva línea/párrafo.
                         const yPosition = item.transform[5];
                         if (lastY !== -1 && (lastY - yPosition) > (item.height * 1.5 || 10)) { // Usar altura de línea aproximada como referencia
                              pageText += '\n';
                         }
                         // Añadir espacio si no es el primer item y hay una distancia horizontal considerable
                         // La posición X está en item.transform[4].
                         const xPosition = item.transform[4];
                         if (lastItem !== null) {
                             const lastX = lastItem.transform[4];
                             const lastItemWidth = lastItem.width;
                              // Si el item actual no está inmediatamente después del último item (considerando su ancho), añadir un espacio.
                              // Un pequeño margen de tolerancia (ej. 1 unidad) puede ser necesario.
                             if (xPosition > (lastX + lastItemWidth + 1)) {
                                  pageText += ' ';
                             }
                         }


                         pageText += item.str;

                         lastY = yPosition;
                         lastItem = item;
                     });
                    fullText += pageText + '\n\n'; // Añadir saltos entre páginas

                }
                // Limpiar espacios extras y asegurar formato básico
                 fullText = fullText.replace(/[ \t]+/g, ' '); // Reducir múltiples espacios a uno
                 fullText = fullText.replace(/\n\s*\n/g, '\n\n'); // Reducir múltiples saltos de línea a dos
                 fullText = fullText.trim(); // Eliminar espacios/saltos al inicio/fin


                resolve(fullText);
            } catch (error) {
                console.error("Error al leer PDF con pdf.js:", error);
                reject(`Error al procesar el archivo PDF: ${error.message || error}. Asegúrate de que sea un PDF de texto seleccionable.`);
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
// (Mantenemos la lógica anterior, incluyendo manejo de errores y estructura del prompt)
async function callGeminiAPI(prompt, pdfText) {
    // Validación básica de la API Key
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "AQUI_PEGA_TU_GOOGLE_API_KEY") {
        throw new Error("Error de configuración: La Google API Key no ha sido definida en script.js. ¡Es inseguro en frontend!");
    }

    const model = 'gemini-1.5-flash-001'; // Modelo recomendado para análisis rápido y económico
    // Si el análisis es muy complejo o el documento muy largo, podrías considerar 'gemini-1.5-pro-001'
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`;

    // Construye el contenido que se enviará a la IA, incluyendo las instrucciones y el texto del documento.
    // Es crucial que la IA reciba primero las instrucciones sobre su rol, tarea y formato.
    // Luego se le pasa el texto del documento para que lo procese según esas instrucciones.
    const contentToSend = `
${prompt}

---

**Texto del Proyecto de Ley (para Análisis):**
--- INICIO DEL DOCUMENTO ---
${pdfText}
--- FIN DEL DOCUMENTO ---

**Tarea Final:**
Analiza el "Texto del Proyecto de Ley" anterior siguiendo estrictamente todas las "Instrucciones para LegisGuardAI" y genera el reporte completo en el formato Markdown solicitado. Asegúrate de incluir todas las secciones requeridas en el formato de salida Markdown.
    `;


    const requestBody = {
        contents: [{
            parts: [{
                text: contentToSend
            }]
        }],
        generationConfig: {
            temperature: 0.1, // Temperatura baja para un análisis más preciso y menos creativo (bueno para análisis legal)
            maxOutputTokens: 4096, // Cantidad máxima de texto que la IA debe generar. Ajusta si tus reportes son muy largos.
        },
         safetySettings: [ // Configuración de seguridad para permitir contenido potencialmente delicado (legal, político)
             {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE" // O BLOCK_LOW_AND_ABOVE si quieres ser más estricto
             },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
             },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
             },
             {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
             },
             // Considera ajustar estos umbrales dependiendo de la naturaleza de los documentos y tu tolerancia.
             // BLOCK_NONE puede ser necesario para análisis sin censura, pero úsalo con precaución.
         ]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            let errorData;
            // Intenta parsear el error body, pero maneja fallos en el parsing
            try { errorData = await response.json(); } catch (e) { console.error("Failed to parse error body:", e); throw new Error(`Error de red o API (${response.status}): ${response.statusText}`); }
            console.error("Error API response body:", errorData);
            const apiErrorMessage = errorData.error?.message || JSON.stringify(errorData.error);

            // Mejor manejo de errores comunes de la API
            if (response.status === 400) {
                 if (apiErrorMessage.toLowerCase().includes("api key not valid")) {
                     throw new Error("Error de API: La clave proporcionada no es válida. Verifica la constante GOOGLE_API_KEY en script.js.");
                 }
                  if (apiErrorMessage.toLowerCase().includes("invalid value at 'contents[0].parts[0].text.length'")) {
                      throw new Error(`Error de API: El texto del documento es demasiado largo para el modelo ${model}. Intenta con un documento más corto o un modelo diferente.`);
                  }
                 throw new Error(`Error de solicitud inválida a la API (${response.status}): ${apiErrorMessage}`);
            }
             if (response.status === 429 || apiErrorMessage.toLowerCase().includes("quota") || apiErrorMessage.toLowerCase().includes("rate limit")) {
                 throw new Error("Error de API: Has excedido tu cuota de uso o la tasa límite. Inténtalo de nuevo más tarde o verifica tu consola de Google Cloud.");
             }
             if (response.status >= 500) {
                  throw new Error(`Error del servidor API (${response.status}): ${apiErrorMessage}. El servicio de Google Gemini puede no estar disponible temporalmente.`);
             }

            throw new Error(`Error inesperado de la API (${response.status}): ${apiErrorMessage}`);
        }

        const data = await response.json();
        console.log("API Success Response:", data);

        // Verifica si la respuesta contiene contenido y no fue bloqueada
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.promptFeedback?.blockReason) {
             const blockReason = data.promptFeedback.blockReason;
             const safetyRatings = data.promptFeedback.safetyRatings ? JSON.stringify(data.promptFeedback.safetyRatings) : 'N/A';
             console.warn(`Contenido bloqueado por la API. Razón: ${blockReason}. Safety Ratings: ${safetyRatings}`);
             throw new Error(`La solicitud fue bloqueada por la API por razones de seguridad (${blockReason}). Safety Ratings: ${safetyRatings}`);
        }
         else if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
             // Manejar otros finish reasons (ej: MAX_TOKENS, RECITATION)
             const finishReason = data.candidates[0].finishReason;
             console.warn(`API call finished with reason: ${finishReason}. Output might be incomplete or stopped early.`);
             let userMessage = `El análisis no pudo completarse completamente (${finishReason}).`;
             if (finishReason === 'MAX_TOKENS') userMessage += " El resultado excede el límite máximo de tokens.";
             if (finishReason === 'RECITATION') userMessage += " Potencial recitación de material entrenado.";

             // Devolver el texto parcial si existe, pero con una advertencia
             if (data.candidates[0].content?.parts?.[0]?.text) {
                  console.warn("Devolviendo texto parcial debido a finishReason:", finishReason);
                  showStatus(`${userMessage} Mostrando resultado parcial.`, 'warning'); // Muestra advertencia persistente
                  return data.candidates[0].content.parts[0].text; // Devuelve texto parcial
             } else {
                 throw new Error(userMessage + " No se generó texto de salida.");
             }

         }
        else {
            console.warn("Respuesta inesperada de la API:", data);
            throw new Error("La API devolvió una respuesta válida pero en un formato inesperado o vacío.");
        }

    } catch (error) {
        console.error("Error detallado al llamar a la API de Gemini:", error);
        // Mejora los mensajes de error para el usuario basándose en los errores capturados
        let userMessage = `Error en el análisis: ${error.message || 'Ocurrió un problema desconocido.'}`;

         // Intenta ser más amigable si el error es un objeto o tiene detalles extra
         if (error.error && error.error.message) {
              userMessage = `Error de API: ${error.error.message}`;
         } else if (typeof error === 'string') {
              userMessage = `Error: ${error}`;
         }


        showStatus(userMessage, 'error'); // Muestra el mensaje de error en el UI
        throw error; // Re-lanza el error para que el bloque catch del event listener lo maneje también
    }
}


// --- Función para generar PDF con jsPDF ---
// (Mantenemos la lógica anterior, que ya maneja el formato Markdown básico)
function generatePdfWithFooter(analysisText, footerText = "Reporte LegisGuardAI - Análisis Legislativo") {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF library not loaded.");
        throw new Error("La librería jsPDF no está cargada correctamente.");
    }

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    const margin = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    const footerStartY = pageHeight - margin + 5;
    const contentEndY = pageHeight - margin - 5; // Espacio antes del footer

    const FONT_NORMAL = "helvetica"; // Tipo de fuente por defecto
    const STYLE_NORMAL = "normal";
    const STYLE_BOLD = "bold";
    // Ajustes de tamaño y espaciado para mejor presentación en PDF
    const SIZE_H1 = 18; // Título principal del reporte
    const SIZE_H2 = 15;
    const SIZE_H3 = 13;
    const SIZE_NORMAL = 11;
    const SIZE_SMALL = 9; // Para referencias legales o notas pequeñas
    const SIZE_FOOTER = 8;
    const SPACE_AFTER_H1 = 10;
    const SPACE_AFTER_H2 = 8;
    const SPACE_AFTER_H3 = 6;
    const SPACE_AFTER_P = 4;
    const LINE_SPACING_FACTOR = 1.4; // Espacio entre líneas
    const LIST_INDENT = 8; // Indentación para listas y citas
    const QUOTE_BAR_WIDTH = 2; // Ancho de la barra de cita


    let currentPage = 1;
    let y = margin; // Posición Y actual en la página

    const addFooter = (pageNumber) => {
        const previousSize = doc.getFontSize();
        const previousStyle = doc.getFont().fontStyle;
        const previousColor = doc.getTextColor();

        doc.setFontSize(SIZE_FOOTER);
        doc.setFont(FONT_NORMAL, STYLE_NORMAL);
        doc.setTextColor(100); // Gris

        // Texto del footer centrado
        doc.text(footerText, pageWidth / 2, footerStartY, { align: 'center' });

        // Número de página a la derecha
        doc.text(`Página ${pageNumber}`, pageWidth - margin, footerStartY, { align: 'right' });

        // Restaurar estilos de fuente y color
        doc.setFontSize(previousSize);
        doc.setFont(FONT_NORMAL, previousStyle);
        doc.setTextColor(previousColor);
    };

    const checkAndAddPage = (requiredHeight) => {
        // Comprobar si el contenido requerido cabe antes del área del footer
        if (y + requiredHeight > contentEndY) {
            addFooter(currentPage); // Añadir footer a la página actual
            doc.addPage(); // Añadir una nueva página
            currentPage++; // Incrementar contador de página
            y = margin; // Resetear posición Y al margen superior
             // Opcional: Añadir encabezado repetido en cada página si aplica
            return true; // Se añadió una página
        }
        return false; // No se añadió una página
    };

     // Procesa el texto línea por línea para mejor manejo de bloques
     const lines = analysisText.split('\n');
     let currentBlockLines = [];
     let currentBlockType = 'paragraph'; // 'paragraph', 'heading', 'list', 'quote', 'table' (aunque tablas son difíciles)

     const processCurrentBlock = () => {
          if (currentBlockLines.length === 0) {
              currentBlockType = 'paragraph'; // Resetear si el bloque estaba vacío
              return;
          }

         const blockText = currentBlockLines.join('\n').trim();
         if (blockText.length === 0) {
              currentBlockLines = []; // Limpiar si quedó vacío después del join/trim
              currentBlockType = 'paragraph';
              return;
         }


         let fontSize = SIZE_NORMAL;
         let fontStyle = STYLE_NORMAL;
         let spaceAfter = SPACE_AFTER_P;
         let align = 'left';
         let currentIndent = 0;

         // Determinar estilo y formato según el tipo de bloque
         if (currentBlockType === 'heading') {
              const firstLine = currentBlockLines[0];
              if (firstLine.startsWith('# ')) { fontSize = SIZE_H1; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H1; currentBlockLines[0] = firstLine.substring(2).trim(); }
              else if (firstLine.startsWith('## ')) { fontSize = SIZE_H2; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H2; currentBlockLines[0] = firstLine.substring(3).trim(); }
              else if (firstLine.startsWith('### ')) { fontSize = SIZE_H3; fontStyle = STYLE_BOLD; spaceAfter = SPACE_AFTER_H3; currentBlockLines[0] = firstLine.substring(4).trim(); }
              else { // No es un encabezado Markdown válido, tratar como párrafo
                  currentBlockType = 'paragraph';
                  fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_P;
              }
         } else if (currentBlockType === 'list') {
             fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_P; currentIndent = LIST_INDENT;
             // Las viñetas (-) se manejan dibujando un punto y luego el texto con indentación
         } else if (currentBlockType === 'quote') {
             fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_P; currentIndent = LIST_INDENT + QUOTE_BAR_WIDTH + 2; // Indentar más para la barra
             // La barra de cita se dibuja por separado
         } else if (currentBlockType === 'table') {
              // Procesamiento de tablas es complejo en jsPDF plano.
              // Idealmente, se usaría un plugin como autotable.
              // Por ahora, lo dibujaremos como texto pre-formateado, que puede no alinearse bien.
              fontSize = SIZE_SMALL; // Usar fuente más pequeña para intentar que quepa
              fontStyle = STYLE_NORMAL;
              spaceAfter = SPACE_AFTER_P;
               // Podríamos intentar usar una fuente monoespaciada si estuviera disponible/cargada
         } else { // paragraph
             fontSize = SIZE_NORMAL; fontStyle = STYLE_NORMAL; spaceAfter = SPACE_AFTER_P;
             // Intenta detectar negritas inline (simple)
              if (blockText.match(/\*\*/)) fontStyle = STYLE_NORMAL; // jsPDF no mezcla estilos easily
              if (blockText.match(/__/)) fontStyle = STYLE_NORMAL; // jsPDF no mezcla estilos easily
         }


         doc.setFontSize(fontSize);
         doc.setFont(FONT_NORMAL, fontStyle);


         // Para listas, dibujamos la viñeta y luego el texto
         if (currentBlockType === 'list') {
             currentBlockLines.forEach(listItemLine => {
                  checkAndAddPage(doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR);
                  // Dibujar viñeta (punto)
                  doc.setFontSize(SIZE_NORMAL); // Tamaño de viñeta puede ser ligeramente diferente
                  doc.text("•", margin + currentIndent - 4, y + doc.getTextDimensions('Tg', { fontSize: fontSize }).h * 0.8, { align: 'right' }); // Ajustar posición de la viñeta
                  doc.setFontSize(fontSize); // Volver al tamaño del texto de lista

                  const linesToDraw = doc.splitTextToSize(listItemLine.trim().substring(2).trim(), usableWidth - currentIndent); // Ignorar el '- ' inicial
                   linesToDraw.forEach((line, lineIndex) => {
                       const lineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                       checkAndAddPage(lineHeight);
                       doc.text(line, margin + currentIndent, y, { align: align, maxWidth: usableWidth - currentIndent });
                       y += lineHeight;
                   });
                   // y += SPACE_AFTER_P / 2; // Pequeño espacio entre items de lista
             });
              y += spaceAfter; // Espacio después de la lista completa

         } else if (currentBlockType === 'quote') {
              const quoteText = currentBlockLines.join('\n'); // Unir líneas de la cita para splitTextToSize
              const linesToDraw = doc.splitTextToSize(quoteText, usableWidth - currentIndent); // Ajustar ancho usable por indentación
              const lineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
              const blockHeight = linesToDraw.length * lineHeight;


              checkAndAddPage(blockHeight + spaceAfter);

              const startY = y; // Guardar Y inicial para dibujar la barra al lado
              linesToDraw.forEach((line, lineIndex) => {
                   const currentLineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                   doc.text(line, margin + currentIndent, y, { align: align, maxWidth: usableWidth - currentIndent });
                   y += currentLineHeight;
              });

              // Dibujar la barra de cita al lado izquierdo del bloque
              doc.setFillColor(var(--color-border)); // Color gris suave para la barra
              doc.rect(margin + currentIndent - QUOTE_BAR_WIDTH - 2, startY, QUOTE_BAR_WIDTH, blockHeight, 'F'); // Dibujar rectángulo (barra)

              y += spaceAfter; // Espacio después de la cita

         } else { // paragraph, heading, table (texto plano)
              const blockTextJoined = currentBlockLines.join('\n'); // Unir líneas para splitTextToSize (manejar saltos de línea internos)
              const linesToDraw = doc.splitTextToSize(blockTextJoined, usableWidth); // Usar ancho completo para párrafos/encabezados

              const lineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
              const blockHeight = linesToDraw.length * lineHeight;

              // Espacio antes del bloque si no es el primer elemento en la página
              const spaceBefore = (y > margin) ? (currentBlockType === 'heading' ? (index > 0 ? SPACE_AFTER_H1 * 0.7 : 0) : SPACE_AFTER_P) : 0;

              checkAndAddPage(blockHeight + spaceBefore + spaceAfter);
               if (y > margin) { y += spaceBefore; }


              linesToDraw.forEach((line, lineIndex) => {
                   const currentLineHeight = doc.getTextDimensions('Tg', { fontSize: fontSize }).h * LINE_SPACING_FACTOR;
                   doc.text(line, margin, y, { align: align, maxWidth: usableWidth });
                   y += currentLineHeight;
              });
              y += spaceAfter;
         }

         currentBlockLines = []; // Limpiar después de procesar
         currentBlockType = 'paragraph'; // Resetear tipo por defecto
     };


     lines.forEach((line, index) => {
         const trimmedLine = line.trim();
         const nextLine = lines[index + 1] ? lines[index + 1].trim() : '';

         // Detectar tipo de bloque
         if (trimmedLine.startsWith('#')) {
             processCurrentBlock(); // Procesa el bloque anterior si existe
             currentBlockLines.push(trimmedLine);
             currentBlockType = 'heading';
             processCurrentBlock(); // Procesa el encabezado inmediatamente
         } else if (trimmedLine.match(/^[-*+] /) && currentBlockType !== 'quote') { // Inicio o continuación de lista (ignorar si es parte de una cita)
             if (currentBlockType !== 'list') {
                  processCurrentBlock(); // Procesa el bloque anterior si no era lista
                  currentBlockType = 'list';
             }
             currentBlockLines.push(trimmedLine);
         } else if (trimmedLine.startsWith('> ')) { // Inicio o continuación de cita
              if (currentBlockType !== 'quote') {
                   processCurrentBlock(); // Procesa el bloque anterior si no era cita
                   currentBlockType = 'quote';
              }
             currentBlockLines.push(trimmedLine.substring(2)); // Almacenar sin el '>'
         } else if (trimmedLine.startsWith('|') && nextLine.startsWith('|') || (currentBlockType === 'table' && trimmedLine.startsWith('|'))) {
              // Detección básica de tabla: línea que empieza con | y la siguiente también (o ya estamos en una tabla)
             if (currentBlockType !== 'table') {
                 processCurrentBlock(); // Procesa el bloque anterior
                 currentBlockType = 'table';
                 fontSize = SIZE_SMALL; // Reducir tamaño para tablas
             }
             currentBlockLines.push(trimmedLine);
         }
         else if (trimmedLine === '') { // Línea vacía
             processCurrentBlock(); // Una línea vacía suele terminar el bloque anterior
             currentBlockType = 'paragraph'; // El siguiente bloque será párrafo por defecto
         } else { // Párrafo normal o texto continuo
              if (currentBlockType === 'heading') { // Si estábamos en un encabezado pero la línea no sigue el formato, es texto normal
                  processCurrentBlock(); // Procesar el encabezado
                  currentBlockLines.push(trimmedLine);
                  currentBlockType = 'paragraph';
              } else if (currentBlockType === 'list' && !trimmedLine.match(/^[-*+] /)) {
                  // Si estábamos en lista pero la línea no empieza con viñeta, puede ser continuación de un item o fin de lista.
                  // Simplificación: si no empieza con viñeta, termina la lista y empieza un párrafo.
                   processCurrentBlock(); // Procesa la lista
                   currentBlockLines.push(trimmedLine);
                   currentBlockType = 'paragraph';
              } else if (currentBlockType === 'quote' && !trimmedLine.startsWith('> ')) {
                   // Si estábamos en cita pero la línea no empieza con '>', termina la cita y empieza un párrafo.
                   processCurrentBlock(); // Procesa la cita
                   currentBlockLines.push(trimmedLine);
                   currentBlockType = 'paragraph';
              } else {
                  // Continuación del bloque actual (párrafo, o texto dentro de lista/cita que ya maneja su formato)
                  currentBlockLines.push(trimmedLine);
              }
         }
     });

     // Procesar cualquier bloque pendiente al final
     processCurrentBlock();


    // Añadir footer a la última página si hay contenido
    // Asegurarse de que haya al menos una página si el documento no estaba vacío
    if (currentPage > 0 && (y > margin || lines.length > 0)) {
        addFooter(currentPage);
    }

    try {
        const pdfBlob = doc.output('blob');
        return pdfBlob;
    } catch (error) {
        console.error("Error al generar el PDF con jsPDF:", error);
        throw new Error("Error al crear el archivo PDF de salida.");
    }
}


// --- Event Listener para el botón ---
analyzeButton.addEventListener('click', async () => {
    const file = pdfFileInput.files[0];

    // Validación básica del archivo
    if (!file) {
        showStatus("Por favor, selecciona un archivo PDF.", 'error');
        // pdfFileInput.focus(); // No funciona bien con display: none
        return;
    }

    // Validar que la API Key no sea el placeholder (añadido por seguridad mínima)
    if (GOOGLE_API_KEY === "AQUI_PEGA_TU_GOOGLE_API_KEY") {
         showStatus("Error de Configuración: Por favor, reemplaza 'AQUI_PEGA_TU_GOOGLE_API_KEY' en script.js con tu clave de API. (¡Recuerda la advertencia de seguridad!)", 'error');
         return;
    }


    // Deshabilitar botón y ocultar resultados anteriores
    analyzeButton.disabled = true;
    resultSection.style.display = 'none';
    downloadLink.href = '#'; // Resetear enlace
    downloadLink.removeAttribute('download'); // Resetear atributo download

    showStatus("Iniciando análisis...", 'processing');

    try {
        showStatus(`Leyendo el archivo PDF "${file.name}"...`, 'processing');
        const pdfText = await extractPdfText(file);

        if (!pdfText || pdfText.length < 100) { // Umbral más alto para texto útil (ajustable)
             if (pdfText && pdfText.length > 0) {
                 throw new Error(`El archivo PDF parece tener muy poco texto (${pdfText.length} caracteres). Asegúrate de que sea un PDF de texto seleccionable y contenga el proyecto de ley.`);
             } else {
                  throw new Error("No se pudo extraer texto útil del archivo PDF. Asegúrate de que sea un PDF de texto seleccionable y no una imagen escaneada.");
             }
        }

        showStatus(`PDF leído (${pdfText.length} caracteres). Enviando a LegisGuardAI para análisis...`, 'processing');
        console.log("Texto extraído (inicio):", pdfText.substring(0, 500) + "..."); // Log más extenso

        // Llama a la API usando las constantes definidas arriba
        const analysisResult = await callGeminiAPI(ANALYSIS_INSTRUCTIONS, pdfText);

        showStatus("Análisis de LegisGuardAI completado. Generando reporte PDF...", 'processing');
        console.log("Resultado del análisis (inicio):", analysisResult.substring(0, 500) + "...");

        // Generar el blob PDF usando el resultado del análisis
        const pdfBlob = generatePdfWithFooter(analysisResult);

        // Crear URL para el blob y configurar el enlace de descarga
        const pdfUrl = URL.createObjectURL(pdfBlob);
        downloadLink.href = pdfUrl;
        // Generar un nombre de archivo más amigable
        const cleanFileName = file.name.replace('.pdf', '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50); // Limpiar nombre
        downloadLink.setAttribute('download', `reporte_legisguardai_${cleanFileName || 'documento'}.pdf`);


        resultSection.style.display = 'block'; // Mostrar la sección de resultados
        showStatus("¡Análisis completado! Reporte PDF listo para descargar.", 'success');

    } catch (error) {
        console.error("Error en el proceso principal de análisis:", error);
        // Mostrar un mensaje de error claro al usuario
        let userMessage = error.message || 'Ocurrió un problema desconocido durante el análisis.';

        // Asegurarse de que ciertos errores técnicos no se muestren directamente si son demasiado crípticos,
        // aunque callGeminiAPI ya hace un buen trabajo mejorando los mensajes.
         if (userMessage.includes("Failed to parse error body") || userMessage.includes("API Success Response")) {
              userMessage = "Ocurrió un error inesperado al procesar la respuesta de la API. Consulta la consola para detalles técnicos.";
         }


        showStatus(userMessage, 'error');
        resultSection.style.display = 'none'; // Asegurarse de que la sección de resultados esté oculta en caso de error
        downloadLink.href = '#'; // Limpiar el enlace de descarga
        downloadLink.removeAttribute('download');
        // Mantener el mensaje de error visible hasta una nueva acción
    } finally {
        analyzeButton.disabled = false; // Habilitar el botón de nuevo
    }
});


// --- Manejo de la selección de archivo para mostrar el nombre ---
pdfFileInput.addEventListener('change', () => {
    if (pdfFileInput.files.length > 0) {
        fileNameSpan.textContent = pdfFileInput.files[0].name;
         // Ocultar estado y resultados anteriores al seleccionar un nuevo archivo
         statusDiv.style.display = 'none';
         resultSection.style.display = 'none';
         analyzeButton.disabled = false; // Asegurarse de que el botón esté habilitado si había un error previo
    } else {
        fileNameSpan.textContent = 'Ningún archivo seleccionado';
    }
});


// --- Inicialización: Ocultar secciones al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    statusDiv.style.display = 'none';
    resultSection.style.display = 'none';
    // Puedes añadir un mensaje de bienvenida si quieres, pero la sección intro ya lo hace.
});
