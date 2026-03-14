const fs = require('fs');
const path = require('path');

const base = __dirname;

function fixFile(relPath, oldPattern, newPattern) {
  const fullPath = path.join(base, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(oldPattern)) {
    fs.writeFileSync(fullPath, content.replace(oldPattern, newPattern));
    console.log('Fixed:', relPath);
    return true;
  } else {
    console.log('SKIP (not found):', relPath);
    return false;
  }
}

let count = 0;

// 1. generate/summary
count += fixFile('app/api/generate/summary/route.ts',
  `    const supabase = await createClient();\n    const { data: { user } } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const { data: { user } } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 2. generate/diagram
count += fixFile('app/api/generate/diagram/route.ts',
  `    const supabase = await createClient();\n    const { data: { user } } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const { data: { user } } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 3. decks/merge
count += fixFile('app/api/decks/merge/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 4. exam-predictor
count += fixFile('app/api/exam-predictor/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 5. voice-doubt
count += fixFile('app/api/voice-doubt/route.ts',
  `    // Auth check\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 6. decks/[id]/cards
count += fixFile('app/api/decks/[id]/cards/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 7. user/ai-preferences (PUT handler)
count += fixFile('app/api/user/ai-preferences/route.ts',
  `export async function PUT(request: Request) {\n  try {\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `export async function PUT(request: Request) {\n  try {\n    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 8. user/profile (PUT handler)
count += fixFile('app/api/user/profile/route.ts',
  `export async function PUT(request: Request) {\n  try {\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `export async function PUT(request: Request) {\n  try {\n    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 9. cards/[id] (PUT handler)
count += fixFile('app/api/cards/[id]/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 10. decks/[id] (PUT handler)
count += fixFile('app/api/decks/[id]/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 11. quizzes/[id]/attempt (POST handler)
count += fixFile('app/api/quizzes/[id]/attempt/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 12. study/[deckId]/review (POST handler)
count += fixFile('app/api/study/[deckId]/review/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n      error: authError,\n    } = await supabase.auth.getUser();\n\n    if (authError || !user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

// 13. decks/smart-study (POST handler)
count += fixFile('app/api/decks/smart-study/route.ts',
  `    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n\n    const body = await request.json();`,
  `    const body = await request.json();\n\n    const supabase = await createClient();\n    const {\n      data: { user },\n    } = await supabase.auth.getUser();\n\n    if (!user) {\n      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }`
) ? 1 : 0;

console.log('\nTotal fixed:', count, '/ 13');
