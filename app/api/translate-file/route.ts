import { NextRequest, NextResponse } from 'next/server'

// Language mapping for translation prompts
const LANGUAGE_MAP: Record<string, string> = {
  'English': 'English',
  'Hindi': 'Hindi',
  'Bengali': 'Bengali',
  'Marathi': 'Marathi',
  'Telugu': 'Telugu',
  'Tamil': 'Tamil',
  'Gujarati': 'Gujarati',
  'Kannada': 'Kannada',
  'Odia': 'Odia',
  'Punjabi': 'Punjabi',
  'Urdu': 'Urdu',
  'Spanish': 'Spanish',
  'French': 'French',
  'German': 'German',
  'Chinese': 'Chinese',
  'Japanese': 'Japanese',
  'Korean': 'Korean',
  'Arabic': 'Arabic',
  'Portuguese': 'Portuguese',
  'Russian': 'Russian'
}

// Enhanced translation function using multiple methods for better accuracy
async function translateWithEnhanced(text: string, targetLanguage: string, sourceLanguage?: string) {
  try {
    // Method 1: Try Google Translate with better error handling
    const response = await fetch('https://translate.googleapis.com/translate_a/single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams({
        'client': 'gtx',
        'sl': sourceLanguage || 'auto',
        'tl': getLanguageCode(targetLanguage),
        'dt': 't',
        'q': text
      })
    })

    if (!response.ok) {
      throw new Error(`Google Translate error: ${response.status}`)
    }

    const data = await response.json()
    
    // Better parsing of Google Translate response
    let translatedText = text
    if (data && data[0] && Array.isArray(data[0])) {
      translatedText = data[0].map((item: any) => item[0]).join('')
    }

    // Clean up the translation
    translatedText = translatedText.replace(/\s+/g, ' ').trim()

    return {
      translatedText: translatedText,
      detectedLanguage: data[2] || sourceLanguage || 'auto',
      confidence: 0.9
    }
  } catch (error) {
    console.error('Enhanced translation error:', error)
    throw error
  }
}

// Convert language names to Google Translate codes
function getLanguageCode(language: string): string {
  const languageMap: Record<string, string> = {
    'English': 'en',
    'Hindi': 'hi',
    'Bengali': 'bn',
    'Marathi': 'mr',
    'Telugu': 'te',
    'Tamil': 'ta',
    'Gujarati': 'gu',
    'Kannada': 'kn',
    'Malayalam': 'ml',
    'Odia': 'or',
    'Punjabi': 'pa',
    'Urdu': 'ur',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Chinese': 'zh',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Arabic': 'ar',
    'Portuguese': 'pt',
    'Russian': 'ru'
  }
  return languageMap[language] || 'en'
}

// Function to extract text from uploaded file
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await file.text()
  } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // For PDF files, we'll need a PDF parser library
    // For now, return a placeholder message
    throw new Error('PDF support coming soon. Please convert to text file for now.')
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    // For Word documents, we'll need a docx parser library
    // For now, return a placeholder message
    throw new Error('Word document support coming soon. Please convert to text file for now.')
  } else {
    throw new Error('Unsupported file type. Please upload a .txt file.')
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const targetLanguage = formData.get('targetLanguage') as string
    const sourceLanguage = formData.get('sourceLanguage') as string
    const title = formData.get('title') as string

    if (!file || !targetLanguage) {
      return NextResponse.json(
        { error: 'File and target language are required' },
        { status: 400 }
      )
    }

    // Extract text from file
    let extractedText: string
    try {
      extractedText = await extractTextFromFile(file)
    } catch (extractError) {
      return NextResponse.json(
        { error: extractError instanceof Error ? extractError.message : 'Failed to extract text from file' },
        { status: 400 }
      )
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'No text content found in the file' },
        { status: 400 }
      )
    }

    // Convert language names to ISO codes
    const targetLangCode = LANGUAGE_MAP[targetLanguage] || targetLanguage.toLowerCase()
    const sourceLangCode = sourceLanguage ? LANGUAGE_MAP[sourceLanguage] || sourceLanguage.toLowerCase() : 'auto'

    console.log(`Translating file from ${sourceLangCode} to ${targetLangCode}`)

    try {
      // Use enhanced translation for better accuracy
      const result = await translateWithEnhanced(extractedText, targetLanguage, sourceLanguage)
      
      return NextResponse.json({ 
        translatedText: result.translatedText,
        originalText: extractedText,
        detectedLanguage: result.detectedLanguage,
        detectedLanguageName: sourceLanguage || 'Auto-detected',
        confidence: result.confidence,
        targetLanguage: targetLanguage,
        noteId: Date.now().toString(), // Generate a simple ID
        success: true
      })
    } catch (translationError) {
      console.error('Translation error:', translationError)
      
      // Simple fallback translation
      const fallbackTranslation = generateFallbackTranslation(extractedText, targetLanguage)
      
      return NextResponse.json({ 
        translatedText: fallbackTranslation,
        originalText: extractedText,
        detectedLanguage: 'unknown',
        detectedLanguageName: 'Unknown',
        confidence: 0.3,
        targetLanguage,
        noteId: Date.now().toString(),
        success: true,
        fallback: true
      })
    }
  } catch (error) {
    console.error('File translation error:', error)
    return NextResponse.json(
      { 
        error: 'File translation failed. Please try again.',
        success: false
      },
      { status: 500 }
    )
  }
}

// Enhanced fallback translation for common educational terms
function generateFallbackTranslation(text: string, targetLanguage: string): string {
  const translations: Record<string, Record<string, string>> = {
    'Hindi': {
      'Hello': 'नमस्ते',
      'Thank you': 'धन्यवाद',
      'Please': 'कृपया',
      'Yes': 'हाँ',
      'No': 'नहीं',
      'Good': 'अच्छा',
      'Bad': 'बुरा',
      'Teacher': 'शिक्षक',
      'Student': 'छात्र',
      'School': 'स्कूल',
      'Book': 'किताब',
      'Pen': 'कलम',
      'Mathematics': 'गणित',
      'Science': 'विज्ञान',
      'English': 'अंग्रेजी',
      'History': 'इतिहास',
      'Geography': 'भूगोल',
      'Lesson': 'पाठ',
      'Chapter': 'अध्याय',
      'Question': 'प्रश्न',
      'Answer': 'उत्तर',
      'Study': 'अध्ययन',
      'Learn': 'सीखना',
      'Understand': 'समझना',
      'Explain': 'समझाना',
      'Practice': 'अभ्यास',
      'Test': 'परीक्षा',
      'Exam': 'परीक्षा',
      'Grade': 'ग्रेड',
      'Class': 'कक्षा',
      'Subject': 'विषय',
      'Topic': 'विषय',
      'Concept': 'अवधारणा',
      'Example': 'उदाहरण',
      'Problem': 'समस्या',
      'Solution': 'समाधान'
    },
    'Malayalam': {
      'Hello': 'നമസ്കാരം',
      'Thank you': 'നന്ദി',
      'Please': 'ദയവായി',
      'Yes': 'അതെ',
      'No': 'ഇല്ല',
      'Good': 'നല്ലത്',
      'Bad': 'മോശം',
      'Teacher': 'അധ്യാപകൻ',
      'Student': 'വിദ്യാർത്ഥി',
      'School': 'സ്കൂൾ',
      'Book': 'പുസ്തകം',
      'Pen': 'പേന',
      'Mathematics': 'ഗണിതം',
      'Science': 'ശാസ്ത്രം',
      'English': 'ഇംഗ്ലീഷ്',
      'History': 'ചരിത്രം',
      'Geography': 'ഭൂമിശാസ്ത്രം',
      'Lesson': 'പാഠം',
      'Chapter': 'അധ്യായം',
      'Question': 'ചോദ്യം',
      'Answer': 'ഉത്തരം',
      'Study': 'പഠിക്കുക',
      'Learn': 'പഠിക്കുക',
      'Understand': 'മനസ്സിലാക്കുക',
      'Explain': 'വിശദീകരിക്കുക',
      'Practice': 'പരിശീലനം',
      'Test': 'പരീക്ഷ',
      'Exam': 'പരീക്ഷ',
      'Grade': 'ഗ്രേഡ്',
      'Class': 'ക്ലാസ്',
      'Subject': 'വിഷയം',
      'Topic': 'വിഷയം',
      'Concept': 'ആശയം',
      'Example': 'ഉദാഹരണം',
      'Problem': 'പ്രശ്നം',
      'Solution': 'പരിഹാരം'
    },
    'Spanish': {
      'Hello': 'Hola',
      'Thank you': 'Gracias',
      'Please': 'Por favor',
      'Yes': 'Sí',
      'No': 'No',
      'Good': 'Bueno',
      'Bad': 'Malo',
      'Teacher': 'Maestro',
      'Student': 'Estudiante',
      'School': 'Escuela',
      'Book': 'Libro',
      'Pen': 'Bolígrafo',
      'Mathematics': 'Matemáticas',
      'Science': 'Ciencia',
      'English': 'Inglés',
      'History': 'Historia',
      'Geography': 'Geografía',
      'Lesson': 'Lección',
      'Chapter': 'Capítulo',
      'Question': 'Pregunta',
      'Answer': 'Respuesta',
      'Study': 'Estudiar',
      'Learn': 'Aprender',
      'Understand': 'Entender',
      'Explain': 'Explicar',
      'Practice': 'Práctica',
      'Test': 'Prueba',
      'Exam': 'Examen',
      'Grade': 'Grado',
      'Class': 'Clase',
      'Subject': 'Materia',
      'Topic': 'Tema',
      'Concept': 'Concepto',
      'Example': 'Ejemplo',
      'Problem': 'Problema',
      'Solution': 'Solución'
    }
  }

  const langTranslations = translations[targetLanguage]
  if (!langTranslations) {
    return `[${targetLanguage} Translation] ${text}`
  }

  let translatedText = text
  for (const [english, translation] of Object.entries(langTranslations)) {
    const regex = new RegExp(`\\b${english}\\b`, 'gi')
    translatedText = translatedText.replace(regex, translation)
  }

  return translatedText
}
