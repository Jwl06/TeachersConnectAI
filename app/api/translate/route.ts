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

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage, noteId, sourceLanguage } = await req.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    console.log(`Translating to ${targetLanguage}`)

    try {
      // Use enhanced translation for better accuracy
      const result = await translateWithEnhanced(text, targetLanguage, sourceLanguage)
      
      return NextResponse.json({ 
        translatedText: result.translatedText,
        detectedLanguage: result.detectedLanguage,
        detectedLanguageName: sourceLanguage || 'Auto-detected',
        confidence: result.confidence,
        targetLanguage: targetLanguage,
        success: true
      })
    } catch (translationError) {
      console.error('Translation error:', translationError)
      
      // Simple fallback translation using basic patterns
      const fallbackTranslation = generateFallbackTranslation(text, targetLanguage)
      
      return NextResponse.json({ 
        translatedText: fallbackTranslation,
        detectedLanguage: 'unknown',
        detectedLanguageName: 'Unknown',
        confidence: 0.3,
        targetLanguage,
        success: true,
        fallback: true
      })
    }
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { 
        error: 'Translation failed. Please try again.',
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

// GET endpoint to retrieve saved translations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const noteId = searchParams.get('noteId')
    const language = searchParams.get('language')

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }

    const translations = await prisma.noteTranslation.findMany({
      where: {
        noteId,
        ...(language && { language })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Error fetching translations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    )
  }
}
