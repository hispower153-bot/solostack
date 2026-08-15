import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Vercel 등에서 충분한 시간 확보

type OutputType = "blog" | "cardnews" | "shorts";

interface GenerateRequest {
  input: string;
  outputs: OutputType[];
  mode?: "text" | "youtube";
}

const SYSTEM_PROMPT = `당신은 1인기업가를 위한 콘텐츠 변환 전문가입니다.
사용자가 제공한 원본 대본/텍스트를 바탕으로 요청된 포맷의 콘텐츠를 한국어로 작성하세요.
각 포맷은 실용적이고 바로 사용할 수 있는 수준으로 작성하세요.
불필요한 서론이나 설명 없이 결과물만 출력하세요.`;

function buildUserPrompt(input: string, outputs: OutputType[]): string {
  const parts: string[] = [];

  parts.push(`원본 내용:\n"""\n${input.slice(0, 8000)}\n"""\n`);

  if (outputs.includes("blog")) {
    parts.push(`
### 블로그 SEO 글 요구사항
- 매력적인 SEO 제목 (H1)
- 서론 → 핵심 포인트 3개 (H2/H3) → 실전 적용법 → 마무리
- 자연스러운 키워드 포함
- 읽기 쉬운 문단 구성
- 마지막에 추천 키워드 3~5개
`);
  }

  if (outputs.includes("cardnews")) {
    parts.push(`
### 카드뉴스 문안 요구사항
- 총 5장 구성
- 카드 1: 강력한 훅 (한 문장)
- 카드 2: 문제 제기
- 카드 3: 핵심 인사이트
- 카드 4: 구체적 방법/해결책
- 카드 5: CTA (행동 유도)
- 각 카드는 짧고 임팩트 있게
- 마지막에 해시태그 3~5개
`);
  }

  if (outputs.includes("shorts")) {
    parts.push(`
### 숏폼/릴스 대본 요구사항
- 35~45초 분량
- [0~3초] 훅
- [3~12초] 문제 제기
- [12~28초] 핵심 해결책 (1~2가지)
- [28~40초] 증거/경험 + CTA
- 구어체, 말하기 자연스럽게
- 추천 해시태그 포함
`);
  }

  parts.push(`
위 요구사항에 맞춰 결과를 아래 JSON 형식으로만 출력하세요. 다른 텍스트는 절대 넣지 마세요.
{
  "blog": "...",
  "cardnews": "...",
  "shorts": "...",
  "titleSuggestions": ["제목1", "제목2", "제목3", "제목4"],
  "keywords": ["키워드1", "키워드2", "키워드3"]
}
요청하지 않은 필드는 빈 문자열("")로 두세요.
`);

  return parts.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { input, outputs } = body;

    if (!input?.trim()) {
      return NextResponse.json({ error: "입력 내용이 없습니다." }, { status: 400 });
    }

    if (!outputs || outputs.length === 0) {
      return NextResponse.json({ error: "생성할 채널을 선택해주세요." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다.", fallback: true },
        { status: 503 }
      );
    }

    const userPrompt = buildUserPrompt(input, outputs);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 4096,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return NextResponse.json(
        { error: `Claude API 오류 (${response.status})`, fallback: true },
        { status: 502 }
      );
    }

    const data = await response.json();
    const textContent = data.content?.find((c: any) => c.type === "text")?.text || "";

    // JSON 파싱 시도
    let parsed: any = null;
    try {
      // 코드블록이 있으면 제거
      const cleaned = textContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // 파싱 실패 시 텍스트 그대로 사용
      parsed = {
        blog: outputs.includes("blog") ? textContent : "",
        cardnews: outputs.includes("cardnews") ? textContent : "",
        shorts: outputs.includes("shorts") ? textContent : "",
        titleSuggestions: [],
        keywords: [],
      };
    }

    return NextResponse.json({
      blog: parsed.blog || "",
      cardnews: parsed.cardnews || "",
      shorts: parsed.shorts || "",
      meta: {
        titleSuggestions: parsed.titleSuggestions || [],
        keywords: parsed.keywords || [],
        estimatedTime: "실제 생성 완료",
      },
      source: "claude",
    });
  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: error.message || "서버 오류", fallback: true },
      { status: 500 }
    );
  }
}
