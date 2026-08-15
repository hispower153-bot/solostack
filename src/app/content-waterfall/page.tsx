"use client";

import { useState, useMemo } from "react";
import {
  Waves,
  Link2,
  FileText,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Youtube,
  Type,
  Clock,
  Hash,
  Target,
  RefreshCw,
} from "lucide-react";

type OutputType = "blog" | "cardnews" | "shorts";
type InputMode = "text" | "youtube";

interface GenerationResult {
  blog: string;
  cardnews: string;
  shorts: string;
  meta: {
    titleSuggestions: string[];
    keywords: string[];
    estimatedTime: string;
  };
}

// ===================== 상세 생성 로직 (시뮬레이션) =====================
// 실제로는 이 함수를 OpenAI / Claude API 호출로 교체하면 됩니다.
function generateContentWaterfall(rawInput: string, mode: InputMode): GenerationResult {
  const clean = rawInput.trim().replace(/\s+/g, " ");
  const sentences = clean
    .split(/[.!?。\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);

  const firstSentence = sentences[0] || clean.slice(0, 40);
  const coreTopic = firstSentence.slice(0, 28).replace(/["']/g, "");
  const wordCount = clean.length;

  // 키워드 추출 시뮬레이션
  const keywords = extractKeywords(clean);

  // ===== 1. 블로그 SEO 글 =====
  const blogTitle = generateBlogTitle(coreTopic, keywords);
  const blog = `# ${blogTitle}

## 왜 이 내용이 중요한가요?

${firstSentence}.

많은 사람들이 이 주제를 놓치고 있습니다. 오늘은 실제로 바로 적용할 수 있는 핵심만 정리해 드리겠습니다.

## 핵심 포인트 3가지

### 1. ${generatePoint(1, coreTopic)}
${generateExplanation(1)}

### 2. ${generatePoint(2, coreTopic)}
${generateExplanation(2)}

### 3. ${generatePoint(3, coreTopic)}
${generateExplanation(3)}

## 실전에서 바로 써먹는 방법

1. 오늘 당장 시도할 수 있는 작은 액션부터 시작하세요.
2. 결과를 기록하고 반복하세요.
3. 효과가 검증되면 규모를 키우세요.

## 마무리

${coreTopic}에 대해 오늘 정리한 내용을 바탕으로, 이번 주 안에 한 번이라도 실행해 보시기 바랍니다.

궁금한 점이 있으시면 댓글로 남겨주세요.

---
**추천 키워드**: ${keywords.join(" · ")}
**예상 읽기 시간**: ${Math.max(3, Math.ceil(wordCount / 400))}분
`;

  // ===== 2. 카드뉴스 (네이버/인스타용) =====
  const cardnews = `【카드 1 - 훅】
${generateHook(coreTopic)}

【카드 2 - 문제】
많은 사람들이 여기서 막힙니다.
${firstSentence.slice(0, 50)}...

【카드 3 - 핵심】
핵심은 이겁니다.
→ ${generatePoint(1, coreTopic)}

【카드 4 - 방법】
실제로 이렇게 하세요.
1. ${generatePoint(2, coreTopic)}
2. ${generatePoint(3, coreTopic)}

【카드 5 - CTA】
지금 바로 시작해보세요.
더 자세한 내용은 프로필 링크 / 본문에서!

#${keywords[0] || "인사이트"} #${keywords[1] || "성장"} #${keywords[2] || "팁"}`;

  // ===== 3. 숏폼 / 릴스 대본 =====
  const shorts = `🎬 숏폼·릴스 대본 (35~45초)

[0~3초] 훅 (강하게)
"${generateHook(coreTopic)}"

[3~12초] 문제 제기
이거 놓치면 계속 제자리입니다.
${firstSentence.slice(0, 45)}...

[12~28초] 핵심 해결책
실제로 효과 있는 방법은 이거예요.
① ${generatePoint(1, coreTopic)}
② ${generatePoint(2, coreTopic)}

[28~40초] 증거 + CTA
제 경험상 이거 적용하고 확 달라졌습니다.
더 자세히 알고 싶으면 프로필 링크 확인하세요!

---
추천 해시태그: #${keywords.slice(0, 5).join(" #")}`;

  return {
    blog,
    cardnews,
    shorts,
    meta: {
      titleSuggestions: [
        blogTitle,
        `${coreTopic} 제대로 하는 법 (초보 필독)`,
        `이 방법 모르면 ${coreTopic} 손해입니다`,
        `${coreTopic} 실전 가이드 | 바로 적용 가능`,
      ],
      keywords,
      estimatedTime: wordCount > 800 ? "40~70초" : "25~45초",
    },
  };
}

// ---------- 헬퍼 함수들 ----------
function extractKeywords(text: string): string[] {
  const stop = new Set([
    "이것", "그것", "저것", "이런", "그런", "저런", "그리고", "하지만",
    "그런데", "그래서", "오늘", "정말", "너무", "매우", "아주", "그냥",
    "사람", "사람들", "우리", "제가", "저는", "나는", "너가", "이것도",
  ]);
  const words = text
    .replace(/[^\uac00-\ud7a3a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !stop.has(w));

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

function generateBlogTitle(topic: string, keywords: string[]): string {
  const templates = [
    `${topic} 제대로 하는 법 | 초보도 바로 적용`,
    `${topic}, 이렇게 하면 결과가 달라집니다`,
    `아직도 ${topic} 어렵게 하세요? 핵심만 정리했습니다`,
    `${keywords[0] || topic} 실전 가이드 (2026)`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateHook(topic: string): string {
  const hooks = [
    `${topic} 이거 모르고 하면 시간 낭비입니다.`,
    `99%가 모르는 ${topic}의 핵심`,
    `${topic}, 이렇게 바꾸면 결과가 완전히 달라집니다.`,
    `이거 하나 알면 ${topic}이 쉬워집니다.`,
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
}

function generatePoint(n: number, topic: string): string {
  const points = [
    `${topic}의 본질을 먼저 파악하기`,
    `작은 단위로 쪼개서 실행하기`,
    `피드백을 빠르게 받아서 수정하기`,
    `남들이 안 하는 디테일 챙기기`,
    `결과 중심으로 사고하기`,
  ];
  return points[(n - 1) % points.length];
}

function generateExplanation(n: number): string {
  const exps = [
    "대부분의 사람들이 여기서 실패합니다. 큰 그림만 보고 디테일을 놓치기 때문입니다.",
    "한 번에 다 하려고 하지 마세요. 작은 성공을 쌓는 게 훨씬 빠릅니다.",
    "혼자 고민하지 말고 데이터를 보세요. 숫자와 반응이 답을 알려줍니다.",
  ];
  return exps[(n - 1) % exps.length];
}

// ===================== 컴포넌트 =====================
export default function ContentWaterfallPage() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [input, setInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [activeTab, setActiveTab] = useState<OutputType>("blog");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<OutputType[]>([
    "blog",
    "cardnews",
    "shorts",
  ]);

  const charCount = useMemo(() => input.length, [input]);

  const handleGenerate = async () => {
    const source = inputMode === "text" ? input : youtubeUrl;
    if (!source.trim()) return;

    setIsProcessing(true);
    setResult(null);
    setProcessingStep("Claude에게 요청 중...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputMode === "text" ? input : `유튜브 링크: ${youtubeUrl}`,
          outputs: selectedOutputs,
          mode: inputMode,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.fallback) {
        // API 실패 시 로컬 시뮬레이션으로 폴백
        setProcessingStep("로컬 엔진으로 전환 중...");
        await new Promise((r) => setTimeout(r, 600));
        const generated = generateContentWaterfall(
          inputMode === "text" ? input : `유튜브 영상 내용: ${youtubeUrl}`,
          inputMode
        );
        setResult(generated);
      } else {
        setResult({
          blog: data.blog || "",
          cardnews: data.cardnews || "",
          shorts: data.shorts || "",
          meta: {
            titleSuggestions: data.meta?.titleSuggestions || [],
            keywords: data.meta?.keywords || [],
            estimatedTime: data.meta?.estimatedTime || "완료",
          },
        });
      }
    } catch (err) {
      // 네트워크 오류 등 → 시뮬레이션 폴백
      setProcessingStep("오프라인 모드로 생성 중...");
      await new Promise((r) => setTimeout(r, 800));
      const generated = generateContentWaterfall(
        inputMode === "text" ? input : `유튜브 영상 내용: ${youtubeUrl}`,
        inputMode
      );
      setResult(generated);
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleOutput = (type: OutputType) => {
    setSelectedOutputs((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const tabs = [
    { id: "blog" as const, label: "블로그 SEO 글", icon: <FileText size={14} />, desc: "네이버·구글 SEO 최적화" },
    { id: "cardnews" as const, label: "카드뉴스", icon: <Sparkles size={14} />, desc: "표지 + 본문 + CTA" },
    { id: "shorts" as const, label: "숏폼/릴스 대본", icon: <Waves size={14} />, desc: "30~45초 구조" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
            <Waves className="w-6 h-6 text-blue-400" />
            콘텐츠 워터폴
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            원본 대본 하나 → 블로그 · 카드뉴스 · 숏폼까지 한 번에 생성
          </p>
        </div>
        {result && (
          <button
            onClick={() => {
              setResult(null);
              setInput("");
              setYoutubeUrl("");
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw size={13} />
            초기화
          </button>
        )}
      </div>

      {/* ========== STEP 1: 원본 입력 ========== */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-medium">
            1
          </span>
          <span className="text-sm font-medium text-zinc-200">원본 대본</span>
        </div>

        <div className="p-5 space-y-4">
          {/* 입력 모드 탭 */}
          <div className="flex gap-1 p-1 bg-[#0a0b0f] rounded-lg w-fit">
            <button
              onClick={() => setInputMode("text")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                inputMode === "text"
                  ? "bg-sidebar-active text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Type size={13} />
              텍스트 붙여넣기
            </button>
            <button
              onClick={() => setInputMode("youtube")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                inputMode === "youtube"
                  ? "bg-sidebar-active text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Youtube size={13} />
              유튜브 링크
            </button>
          </div>

          {inputMode === "text" ? (
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="여기에 유튜브 대본이나 원본 텍스트를 붙여넣으세요.&#10;&#10;이 대본을 근거로 블로그 SEO 글 · 카드뉴스 · 숏폼 대본이 만들어집니다."
                className="w-full h-44 bg-[#0a0b0f] border border-sidebar-border rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-none leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-zinc-600">
                <span>{charCount.toLocaleString()}자</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtu.be/ 또는 https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#0a0b0f] border border-sidebar-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                <Clock size={12} />
                현재는 링크만 받고, 실제 자막 추출은 추후 YouTube API 연동 예정입니다.
              </p>
            </div>
          )}

          {/* 생성 대상 선택 */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs text-zinc-500">생성 대상:</span>
            {tabs.map((tab) => (
              <label key={tab.id} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOutputs.includes(tab.id)}
                  onChange={() => toggleOutput(tab.id)}
                  className="w-3.5 h-3.5 rounded border-zinc-600 bg-transparent text-blue-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-zinc-400">{tab.label}</span>
              </label>
            ))}
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleGenerate}
              disabled={
                isProcessing ||
                (inputMode === "text" ? !input.trim() : !youtubeUrl.trim()) ||
                selectedOutputs.length === 0
              }
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {processingStep || "생성 중..."}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  전부 생성
                </>
              )}
            </button>

            <button
              onClick={() => {
                setInput("");
                setYoutubeUrl("");
                setResult(null);
              }}
              className="px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 border border-sidebar-border rounded-lg hover:bg-sidebar-hover transition-colors"
            >
              비우기
            </button>

            {!isProcessing && (
              <span className="text-xs text-zinc-600">
                생성은 선택된 채널을 동시에 처리합니다
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========== STEP 2: 결과 ========== */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span className="text-sm font-medium text-zinc-200">채널별 결과</span>
          </div>
          {result && (
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Hash size={12} />
                {result.meta.keywords.slice(0, 3).join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {result.meta.estimatedTime}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-sidebar-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />
                )}
              </button>
            ))}
          </div>

          {/* 결과 영역 */}
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center min-h-[280px] gap-3">
              <Loader2 size={28} className="animate-spin text-blue-400" />
              <p className="text-sm text-zinc-400">{processingStep}</p>
              <p className="text-xs text-zinc-600">잠시만 기다려 주세요...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* 제목 제안 (블로그일 때만) */}
              {activeTab === "blog" && result.meta.titleSuggestions.length > 0 && (
                <div className="bg-[#0a0b0f] border border-sidebar-border rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
                    <Target size={12} />
                    제목 제안
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.meta.titleSuggestions.map((title, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopy(title, `title-${i}`)}
                        className="text-xs px-2.5 py-1 rounded-md bg-sidebar-active text-zinc-300 hover:text-white transition-colors"
                      >
                        {copied === `title-${i}` ? "복사됨 ✓" : title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 본문 */}
              <div className="relative">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 bg-[#0a0b0f] border border-sidebar-border rounded-lg p-5 min-h-[260px] max-h-[480px] overflow-y-auto leading-relaxed font-sans">
                  {result[activeTab]}
                </pre>
                <button
                  onClick={() => handleCopy(result[activeTab], activeTab)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-sidebar-active hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
                >
                  {copied === activeTab ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      복사
                    </>
                  )}
                </button>
              </div>

              {/* 카드뉴스 → 편집기로 보내기 */}
              {activeTab === "cardnews" && result.cardnews && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        "solostack_cardnews_data",
                        JSON.stringify({ text: result.cardnews, ts: Date.now() })
                      );
                      window.location.href = "/card-news";
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Check size={16} />
                    확인 — 카드뉴스로 보내기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[280px] text-zinc-600 text-sm gap-2">
              <FileText size={36} className="opacity-30" />
              <p>대본을 넣고 「전부 생성」을 누르세요</p>
              <p className="text-xs text-zinc-700">원본 하나만 넣으면 세 가지 포맷이 동시에 만들어집니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
