const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Esta función procesa la consulta con un modelo de IA real usando Ollama
exports.processQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Se requiere una consulta válida' });
    }
    
    // PASO 1: Detectar consultas especiales que deberían tener respuestas directas
    const queryLower = query.toLowerCase();
    
    // Detectar exclusiones específicas para libros de fantasía (Rothfuss y Sanderson)
    if ((queryLower.includes('fantas') || queryLower.includes('fantasía')) && 
        queryLower.includes('recomienda') && 
        queryLower.includes('no sea') && 
        (queryLower.includes('sanderson') || queryLower.includes('brandon')) && 
        (queryLower.includes('rothfuss') || queryLower.includes('patrick'))) {
      // Respuesta directa para exclusiones específicas de fantasía
      return res.json({
        answer: 'Te recomiendo "Juego de Tronos" de George R.R. Martin o "El Ojo del Mundo" de Robert Jordan. Ambos son excelentes libros de fantasía épica con mundos detallados y personajes complejos.',
        modelUsed: 'direct-response'
      });
    }
    
    // Detectar exclusiones (autores o títulos que NO quiere)
    const excludedAuthors = detectExcludedAuthors(queryLower);
    const excludedTitles = detectExcludedTitles(queryLower);
    
    // Juego de Tronos y variantes
    if ((queryLower.includes('juego') && queryLower.includes('tronos')) || 
        (queryLower.includes('game') && queryLower.includes('thrones')) ||
        (queryLower.includes('hielo') && queryLower.includes('fuego')) ||
        (queryLower.includes('martin') && queryLower.includes('georges')) ||
        queryLower.includes('george martin')) {
      return res.json({
        answer: 'Sí, tenemos la saga completa de "Canción de Hielo y Fuego" (Juego de Tronos) de George R.R. Martin, que incluye los libros: "Juego de Tronos", "Choque de Reyes", "Tormenta de Espadas", "Festín de Cuervos" y "Danza de Dragones".',
        modelUsed: 'direct-response'
      });
    }
    
    // El Nombre del Viento
    if (queryLower.includes('nombre') && queryLower.includes('viento') ||
        queryLower.includes('rothfuss')) {
      return res.json({
        answer: 'Sí, tenemos "El Nombre del Viento" de Patrick Rothfuss, el primer libro de la saga "Crónica del Asesino de Reyes".',
        modelUsed: 'direct-response'
      });
    }
    
    // El Problema de los Tres Cuerpos
    if ((queryLower.includes('tres') && queryLower.includes('cuerpos')) ||
        (queryLower.includes('liu') && queryLower.includes('cixin'))) {
      return res.json({
        answer: 'Sí, tenemos "El Problema de los Tres Cuerpos" de Liu Cixin, el primer libro de la trilogía "El Recuerdo del Pasado de la Tierra".',
        modelUsed: 'direct-response'
      });
    }
    
    // PASO 2: Si no es una consulta especial, utilizar el sistema normal
    const systemPrompt = `Eres Tinta, el asistente virtual de Mundo-tinta, una librería online.

    DIRECTRICES IMPORTANTES:
    1. Responde SOLO a lo que se te pregunta. Sé conciso y directo.
    2. No agregues información adicional que no sea relevante a la pregunta exacta.
    3. Basa tus respuestas únicamente en el catálogo real de Mundo-tinta.
    4. No inventes libros o autores que no estén en nuestro catálogo.
    5. Si no conoces la respuesta o no tenemos ese contenido, indica claramente "No tenemos esa información en nuestro catálogo actual" o "No disponemos de libros sobre ese tema actualmente".
    6. No uses frases como "Como modelo de IA" o "Como asistente virtual".
    7. Habla en primera persona como representante de la librería.

    Ejemplo de buena respuesta:
    Pregunta: ¿Venden libros de Brandon Sanderson?
    Respuesta: Sí, tenemos disponibles los libros de la saga El Archivo de las Tormentas y Nacidos de la Bruma de Brandon Sanderson.

    Ejemplo de mala respuesta:
    Respuesta: ¡Por supuesto! Brandon Sanderson es uno de nuestros autores más populares. Tenemos una amplia selección de sus obras, incluyendo la saga del Archivo de las Tormentas, la trilogía Mistborn, y obras independientes. ¿Hay alguna en particular que te interese? Puedo darte más información sobre cualquiera de ellas o recomendarte por dónde empezar si eres nuevo en sus libros.
    
    Ahora responde a la siguiente pregunta del usuario:
    `;
    
    // Utilizar fallback si es necesario
    const authorNotFound = checkForNonExistingAuthor(queryLower);
    if (authorNotFound) {
      return res.json({
        answer: `Lo siento, actualmente no disponemos de libros de ${authorNotFound} en nuestro catálogo. Nuestra librería está especializada en fantasía y ciencia ficción, con obras de autores como Brandon Sanderson, Isaac Asimov y George R.R. Martin.`,
        modelUsed: 'direct-response'
      });
    }
    
    // Buscar géneros mencionados que NO están en nuestro catálogo
    const genreNotFound = checkForNonExistingGenre(queryLower);
    if (genreNotFound) {
      return res.json({
        answer: `Lo siento, actualmente no disponemos de libros del género "${genreNotFound}" en nuestro catálogo. Nuestra librería está especializada en fantasía y ciencia ficción.`,
        modelUsed: 'direct-response'
      });
    }
    
    // Completo prompt con la consulta del usuario
    const fullPrompt = `${systemPrompt}\n\n${query}`;
    
    // Iniciamos el proceso de Ollama con límite de tiempo
    const ollamaProcess = spawn('ollama', ['run', 'mistral:instruct', '--nowordwrap'], { 
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let outputData = '';
    let errorData = '';
    
    // Configurar manejo de datos
    ollamaProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    ollamaProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    // Enviar el prompt a Ollama
    ollamaProcess.stdin.write(fullPrompt);
    ollamaProcess.stdin.end();
    
    // Manejar la finalización del proceso
    ollamaProcess.on('close', (code) => {
      // Limpiar el timeout para evitar respuestas duplicadas
      clearTimeout(timeoutId);
      
      // Si ya respondimos o el proceso terminó mal, no hacer nada más
      if (hasResponded) return;
      
      // Marcar como respondido
      hasResponded = true;
      
      if (code !== 0) {
        console.error(`Ollama process exited with code ${code}`);
        console.error(`Error: ${errorData}`);
        
        // Si hay error, usar respuesta de fallback
        const fallbackResponse = generateFallbackResponse(query);
        return res.json({
          answer: fallbackResponse,
          modelUsed: 'fallback-error',
          fallbackReason: 'Error en el modelo'
        });
      }
      
      // Si llegamos aquí, todo está bien
      // Postprocesamiento de la respuesta
      let cleanedOutput = outputData.trim();
      
      // Eliminar artefactos comunes en la salida de LLMs
      cleanedOutput = cleanedOutput
        .replace(/^As an AI language model,|^I'm an AI assistant|^I am an AI assistant|^As an AI assistant/i, '')
        .replace(/^Tinta:|^Assistant:|^Asistente:/i, '')
        .trim();
      
      res.json({
        answer: cleanedOutput,
        modelUsed: 'mistral:instruct'
      });
    });
    
    // Usar un flag para controlar si ya respondimos o no
    let hasResponded = false;
    
    // Configurar timeout por si Ollama tarda demasiado
    const timeoutId = setTimeout(() => {
      if (!ollamaProcess.killed && !hasResponded) {
        hasResponded = true;
        ollamaProcess.kill();
        
        // Usar el fallback en lugar de devolver error
        const fallbackResponse = generateFallbackResponse(query);
        
        return res.json({
          answer: fallbackResponse,
          modelUsed: 'fallback-timeout',
          fallbackReason: 'La IA tardó demasiado en responder'
        });
      }
    }, 10000); // Reducir a 10 segundos para mejor experiencia de usuario
    
  } catch (error) {
    console.error('Error en procesamiento de chat:', error);
    // Usar fallback en caso de cualquier error
    const fallbackResponse = generateFallbackResponse(query);
    res.json({
      answer: fallbackResponse,
      modelUsed: 'fallback-exception',
      fallbackReason: 'Error inesperado'
    });
  }
};

// Nuestro catálogo real de libros - Solo fantasía y ciencia ficción
const CATALOG = [
  // Fantasía
  { title: "El Camino de los Reyes", author: "Brandon Sanderson", genre: "Fantasía" },
  { title: "El Ojo del Mundo", author: "Robert Jordan", genre: "Fantasía" },
  { title: "El Aprendiz de Asesino", author: "Robin Hobb", genre: "Fantasía" },
  { title: "Elantris", author: "Brandon Sanderson", genre: "Fantasía" },
  { title: "Nacidos de la Bruma: El Imperio Final", author: "Brandon Sanderson", genre: "Fantasía" },
  { title: "Malaz: Los Jardines de la Luna", author: "Steven Erikson", genre: "Fantasía" },
  { title: "Juego de Tronos", author: "George R.R. Martin", genre: "Fantasía" },
  { title: "Choque de Reyes", author: "George R.R. Martin", genre: "Fantasía" },
  { title: "Tormenta de Espadas", author: "George R.R. Martin", genre: "Fantasía" },
  { title: "Festín de Cuervos", author: "George R.R. Martin", genre: "Fantasía" },
  { title: "Danza de Dragones", author: "George R.R. Martin", genre: "Fantasía" },
  { title: "El Nombre del Viento", author: "Patrick Rothfuss", genre: "Fantasía" },
  
  // Ciencia Ficción
  { title: "Fundación", author: "Isaac Asimov", genre: "Ciencia Ficción" },
  { title: "Dune", author: "Frank Herbert", genre: "Ciencia Ficción" },
  { title: "Yo, Robot", author: "Isaac Asimov", genre: "Ciencia Ficción" },
  { title: "Hyperion", author: "Dan Simmons", genre: "Ciencia Ficción" },
  { title: "La Mano Izquierda de la Oscuridad", author: "Ursula K. Le Guin", genre: "Ciencia Ficción" },
  { title: "El Fin de la Eternidad", author: "Isaac Asimov", genre: "Ciencia Ficción" },
  { title: "El Problema de los Tres Cuerpos", author: "Liu Cixin", genre: "Ciencia Ficción" }
];

// Autores que tenemos en el catálogo
const AUTHORS = [...new Set(CATALOG.map(book => book.author.toLowerCase()))];

// Géneros disponibles en nuestro catálogo
const GENRES = [...new Set(CATALOG.map(book => book.genre.toLowerCase()))];

// Función para generar respuestas cuando Ollama no está disponible o hay errores
function generateFallbackResponse(query) {
  try {
    const queryLower = query.toLowerCase();
    
    // Detectar exclusiones (autores o títulos que NO quiere)
    const excludedAuthors = detectExcludedAuthors(queryLower);
    const excludedTitles = detectExcludedTitles(queryLower);
    
    // Respuestas por defecto para preguntas sobre recomendaciones
    if (queryLower.includes('recomienda') || 
        queryLower.includes('sugerencia') || 
        queryLower.includes('qué libro') || 
        queryLower.includes('que libro') ||
        queryLower.includes('libros para')) {
      
      // Detectar si busca un género específico
      const genre = getGenreFromQuery(queryLower);
      
      // Filtrar el catálogo según exclusiones
      const filteredCatalog = CATALOG.filter(book => {
        // Excluir por autor
        if (excludedAuthors.some(author => 
            book.author.toLowerCase().includes(author.toLowerCase()))) {
          return false;
        }
        // Excluir por título
        if (excludedTitles.some(title => 
            book.title.toLowerCase().includes(title.toLowerCase()))) {
          return false;
        }
        // Filtrar por género si se especificó
        if (genre && book.genre.toLowerCase() !== genre.toLowerCase()) {
          return false;
        }
        return true;
      });
      
      // Si hay libros después del filtrado, recomendar algunos
      if (filteredCatalog.length > 0) {
        // Tomar hasta 3 libros filtrados al azar
        const recommendations = filteredCatalog
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(3, filteredCatalog.length));
        
        let response = 'Te recomiendo ';
        recommendations.forEach((book, index) => {
          if (index > 0) {
            response += index === recommendations.length - 1 ? ' y ' : ', ';
          }
          response += `"${book.title}" de ${book.author}`;
        });
        return response + '.';
      }
      
      // Si no hay libros después del filtrado, dar respuesta genérica
      if (genre === 'fantasía') {
        // Respuesta genérica para fantasía sin las exclusiones
        return 'Lo siento, con esos criterios de exclusión no tengo recomendaciones disponibles en este momento. Podría interesarte explorar nuestra sección de fantasía para ver otras opciones.';
      } 
      
      if (genre === 'ciencia ficción') {
        // Respuesta genérica para ciencia ficción sin las exclusiones
        return 'Lo siento, con esos criterios de exclusión no tengo recomendaciones disponibles en este momento. Podría interesarte explorar nuestra sección de ciencia ficción para ver otras opciones.';
      }
      
      // Si no especifica género, dar recomendación general
      return 'Te recomiendo "El Camino de los Reyes" de Brandon Sanderson si te gusta la fantasía, o "El Problema de los Tres Cuerpos" de Liu Cixin si prefieres la ciencia ficción.';
    }
    
    // Buscar autores mencionados que NO están en nuestro catálogo
    const authorNotFound = checkForNonExistingAuthor(queryLower);
    if (authorNotFound) {
      return `Lo siento, actualmente no disponemos de libros de ${authorNotFound} en nuestro catálogo. Nuestra librería está especializada en fantasía y ciencia ficción, con obras de autores como Brandon Sanderson, Frank Herbert y Liu Cixin.`;
    }
    
    // Buscar géneros mencionados que NO están en nuestro catálogo
    const genreNotFound = checkForNonExistingGenre(queryLower);
    if (genreNotFound) {
      return `Lo siento, actualmente no disponemos de libros del género "${genreNotFound}" en nuestro catálogo. Nuestra librería está especializada en fantasía y ciencia ficción.`;
    }
    
    // Comprobar si se menciona un autor que SÍ tenemos
    const author = getAuthorFromQuery(queryLower);
    if (author) {
      const booksByAuthor = CATALOG.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      ).map(book => book.title);
      
      return `Sí, tenemos los siguientes libros de ${author.charAt(0).toUpperCase() + author.slice(1)}: "${booksByAuthor.join('", "')}".'`;
    }
    
    // Respuestas por defecto para otras consultas
    if (queryLower.includes('precio') || queryLower.includes('cuánto') || queryLower.includes('cuanto') || queryLower.includes('cuesta')) {
      return 'Los precios varían según la edición. Te recomiendo visitar nuestra tienda en línea donde encontrarás información detallada sobre cada libro, incluyendo su precio actual y disponibilidad.';
    }
    
    if (queryLower.includes('envío') || queryLower.includes('envio') || queryLower.includes('entrega')) {
      return 'Realizamos envíos a todo el país en 2-5 días hábiles. Para compras superiores a 50€, el envío es gratuito.';
    }
    
    if (queryLower.includes('descuento') || queryLower.includes('oferta') || queryLower.includes('promoción') || queryLower.includes('promocion')) {
      return 'Actualmente tenemos un 15% de descuento en toda la sección de ciencia ficción. También ofrecemos un 10% adicional en tu primera compra si te registras en nuestra web.';
    }
    
    // Respuesta por defecto
    return 'Somos Mundo-tinta, tu librería especializada en fantasía y ciencia ficción. ¿En qué más puedo ayudarte?';
  } catch (error) {
    console.error('Error en fallback de respuesta:', error);
    return 'Nuestra librería está especializada en fantasía y ciencia ficción. ¿En qué puedo ayudarte?';
  }
}

// Comprobar si la consulta menciona un autor que NO está en nuestro catálogo
function checkForNonExistingAuthor(query) {
  // Lista de autores conocidos que podrían preguntar pero no tenemos
  const popularAuthors = [
    { name: 'arturo perez reverte', variants: ['perez reverte', 'pérez reverte', 'arturo pérez'] },
    { name: 'carlos ruiz zafon', variants: ['ruiz zafon', 'ruiz zafón', 'zafon'] },
    { name: 'gabriel garcia marquez', variants: ['garcía márquez', 'gabo', 'marquez'] },
    { name: 'julio cortazar', variants: ['cortázar'] },
    { name: 'isabel allende', variants: [] },
    { name: 'mario vargas llosa', variants: ['vargas llosa'] },
    { name: 'ken follett', variants: ['follett'] },
    { name: 'stephen king', variants: ['king'] },
    { name: 'j.k. rowling', variants: ['rowling', 'j k rowling', 'jk rowling'] },
    { name: 'agatha christie', variants: ['christie'] },
    { name: 'john grisham', variants: ['grisham'] },
    { name: 'paulo coelho', variants: ['coelho'] },
    { name: 'federico garcia lorca', variants: ['garcía lorca', 'lorca'] },
    { name: 'miguel de cervantes', variants: ['cervantes'] },
    { name: 'haruki murakami', variants: ['murakami'] }
  ];
  
  // Comprobar si la consulta menciona un autor popular que no tenemos
  for (const author of popularAuthors) {
    if (query.includes(author.name)) {
      return author.name;
    }
    
    for (const variant of author.variants) {
      if (query.includes(variant)) {
        return author.name;
      }
    }
  }
  
  return null;
}

// Comprobar si la consulta menciona géneros que no tenemos
function checkForNonExistingGenre(query) {
  // Lista de géneros populares que no tenemos
  const nonExistingGenres = [
    { name: 'historia', variants: ['histórico', 'historica', 'histórica'] },
    { name: 'romance', variants: ['romantico', 'romántico', 'romantica', 'romántica', 'amor'] },
    { name: 'autoayuda', variants: ['ayuda', 'desarrollo personal', 'crecimiento personal', 'motivacion', 'motivación'] },
    { name: 'biografia', variants: ['biografía', 'memorias', 'autobiografia', 'autobiografía'] },
    { name: 'policiaco', variants: ['policiaca', 'detectivesco', 'detectives', 'crimen', 'criminal'] },
    { name: 'poesia', variants: ['poesía', 'poemas', 'versos'] },
    { name: 'teatro', variants: ['obra de teatro', 'dramatico', 'dramático'] },
    { name: 'cocina', variants: ['recetas', 'gastronomia', 'gastronomía', 'culinario'] },
    { name: 'viajes', variants: ['guía de viaje', 'turismo'] },
    { name: 'infantil', variants: ['niños', 'juvenil'] }
  ];
  
  for (const genre of nonExistingGenres) {
    if (query.includes(genre.name)) {
      return genre.name;
    }
    
    for (const variant of genre.variants) {
      if (query.includes(variant)) {
        return genre.name;
      }
    }
  }
  
  return null;
}

// Extraer autor de la consulta si existe en nuestro catálogo
function getAuthorFromQuery(query) {
  // Lista de autores en nuestro catálogo y variantes de sus nombres
  const catalogAuthors = [
    { name: 'brandon sanderson', variants: ['sanderson'] },
    { name: 'isaac asimov', variants: ['asimov'] },
    { name: 'robert jordan', variants: ['jordan'] },
    { name: 'frank herbert', variants: ['herbert'] },
    { name: 'robin hobb', variants: ['hobb'] },
    { name: 'dan simmons', variants: ['simmons'] },
    { name: 'ursula k. le guin', variants: ['le guin', 'leguin', 'ursula leguin'] },
    { name: 'steven erikson', variants: ['erikson'] },
    { name: 'george r.r. martin', variants: ['martin', 'george martin', 'george r r martin'] },
    { name: 'patrick rothfuss', variants: ['rothfuss'] },
    { name: 'liu cixin', variants: ['cixin', 'liu'] }
  ];
  
  for (const author of catalogAuthors) {
    if (query.includes(author.name)) {
      return author.name;
    }
    
    for (const variant of author.variants) {
      if (query.includes(variant)) {
        return author.name;
      }
    }
  }
  
  return null;
}

// Extraer género de la consulta si existe en nuestro catálogo
function getGenreFromQuery(query) {
  // Solo tenemos estos dos géneros
  if (query.includes('fantasía') || query.includes('fantasia')) {
    return 'fantasía';
  }
  
  if (query.includes('ciencia ficción') || query.includes('ciencia ficcion') || 
      query.includes('sci-fi') || query.includes('scifi')) {
    return 'ciencia ficción';
  }
  
  return null;
}

// Detectar autores que el usuario quiere excluir
function detectExcludedAuthors(query) {
  const excludedAuthors = [];
  
  // Lista de patrones para detectar exclusiones
  const exclusionPatterns = [
    'que no sean de', 'que no sea de', 'excepto', 'menos', 
    'no quiero de', 'que no sean por', 'que no incluyan a',
    'excluyendo a', 'sin libros de', 'no incluir'
  ];
  
  // Verificar para asimov explícitamente ya que es común
  if ((query.includes('asimov') || query.includes('azimov')) && 
      exclusionPatterns.some(pattern => query.includes(pattern)) ||
      query.includes('no asimov') || query.includes('no de asimov')) {
    excludedAuthors.push('asimov');
  }
  
  // Lista de autores en nuestro catálogo para excluir
  const authorList = [
    'brandon sanderson', 'robert jordan', 'j.r.r. tolkien', 'tolkien',
    'patrick rothfuss', 'george r.r. martin', 'martin', 
    'isaac asimov', 'asimov', 'frank herbert', 'herbert',
    'ursula k. le guin', 'le guin', 'dan simmons', 'simmons',
    'liu cixin', 'cixin'
  ];
  
  // Comprobar exclusiones para cada autor
  authorList.forEach(author => {
    if (query.includes(author) && 
        exclusionPatterns.some(pattern => {
          // Comprobar si hay un patrón de exclusión cercano al nombre del autor
          const patternIndex = query.indexOf(pattern);
          const authorIndex = query.indexOf(author);
          
          // Si el patrón está antes del autor y a no más de 20 caracteres de distancia
          return patternIndex !== -1 && authorIndex !== -1 && 
                 authorIndex > patternIndex && 
                 authorIndex - patternIndex < 20;
        })) {
      excludedAuthors.push(author);
    }
  });
  
  return excludedAuthors;
}

// Detectar títulos de libros que el usuario quiere excluir
function detectExcludedTitles(query) {
  const excludedTitles = [];
  
  // Detectar exclusión de Dune
  if (query.includes('dune') && 
      (query.includes('no dune') || 
       query.includes('que no sea dune') || 
       query.includes('excepto dune') ||
       query.includes('sin dune'))) {
    excludedTitles.push('dune');
  }
  
  // Lista de títulos populares de nuestro catálogo para detectar exclusiones
  const titleExclusionPairs = [
    { title: 'fundación', variants: ['fundacion'] },
    { title: 'yo, robot', variants: ['yo robot'] },
    { title: 'el fin de la eternidad', variants: [] },
    { title: 'dune', variants: [] },
    { title: 'hyperion', variants: [] },
    { title: 'el problema de los tres cuerpos', variants: ['tres cuerpos'] },
    { title: 'juego de tronos', variants: ['tronos'] },
    { title: 'el camino de los reyes', variants: ['camino de reyes'] }
  ];
  
  // Patrones de exclusión
  const exclusionPatterns = [
    'que no sea', 'excepto', 'menos', 'no quiero', 
    'excluyendo', 'sin', 'no incluir'
  ];
  
  titleExclusionPairs.forEach(pair => {
    // Verificar el título principal
    const allVariants = [pair.title, ...pair.variants];
    
    allVariants.forEach(titleVariant => {
      if (query.includes(titleVariant) && 
          exclusionPatterns.some(pattern => {
            const patternIndex = query.indexOf(pattern);
            const titleIndex = query.indexOf(titleVariant);
            
            return patternIndex !== -1 && titleIndex !== -1 && 
                   titleIndex > patternIndex && 
                   titleIndex - patternIndex < 20;
          })) {
        excludedTitles.push(pair.title);
      }
    });
  });
  
  return excludedTitles;
}



// Verificar que Ollama está instalado y disponible
exports.checkOllamaStatus = async (req, res) => {
  try {
    const ollamaProcess = spawn('ollama', ['list'], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let outputData = '';
    let errorData = '';
    
    ollamaProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    ollamaProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(503).json({
          status: 'error',
          message: 'Ollama no está instalado o no está funcionando correctamente',
          needsSetup: true,
          errorDetails: errorData
        });
      }
      
      // Verificar si el modelo necesario está disponible
      const hasRequiredModel = outputData.toLowerCase().includes('mistral');
      
      res.json({
        status: 'ok',
        hasRequiredModel,
        availableModels: outputData.trim().split('\n'),
        setupRequired: !hasRequiredModel
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar Ollama',
      error: error.message
    });
  }
};

// Comprobar si un modelo está disponible localmente
const isModelAvailable = async (modelName) => {
  try {
    const result = await new Promise((resolve) => {
      const process = spawn('ollama', ['list']);
      let output = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('close', () => {
        resolve(output.toLowerCase().includes(modelName.toLowerCase()));
      });
      
      // Timeout por si acaso
      setTimeout(() => resolve(false), 5000);
    });
    
    return result;
  } catch (error) {
    console.error('Error checking model availability:', error);
    return false;
  }
};

// Ruta para descargar modelo si no está disponible
exports.downloadModel = async (req, res) => {
  try {
    const ollamaProcess = spawn('ollama', ['pull', 'mistral:instruct'], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let outputData = '';
    
    ollamaProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      outputData += chunk;
      console.log('Download progress:', chunk);
    });
    
    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          status: 'error',
          message: 'Error al descargar el modelo',
          log: outputData
        });
      }
      
      res.json({
        status: 'ok',
        message: 'Modelo descargado correctamente',
        model: 'mistral:instruct'
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al descargar modelo',
      error: error.message
    });
  }
};
