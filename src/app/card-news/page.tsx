"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  Download,
  Save,
  Sparkles,
  Upload,
  Link2,
  Layers,
  Palette,
  AlignCenter,
  AlignLeft,
  Check,
  X,
  Instagram,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CardPage {
  id: string;
  type: "cover" | "content" | "cta";
  title: string;
  body: string;
  brand: string;
  bgColor: string;
  textColor: string;
  overlayOpacity: number;
  overlayColor: string;
  bgImage?: string;
  titleSize: number;
  bodySize: number;
  align: "left" | "center";
}

const defaultPages: CardPage[] = [
  {
    id: "1",
    type: "cover",
    title: "표지 제목을 입력하세요",
    body: "",
    brand: "SoloStack",
    bgColor: "#0f1117",
    textColor: "#ffffff",
    overlayOpacity: 40,
    overlayColor: "#000000",
    titleSize: 28,
    bodySize: 16,
    align: "center",
  },
  {
    id: "2",
    type: "content",
    title: "핵심 포인트 1",
    body: "여기에 본문 내용을 입력하세요.",
    brand: "SoloStack",
    bgColor: "#0f1117",
    textColor: "#ffffff",
    overlayOpacity: 50,
    overlayColor: "#000000",
    titleSize: 22,
    bodySize: 15,
    align: "left",
  },
  {
    id: "3",
    type: "cta",
    title: "지금 바로 시작하세요",
    body: "더 자세한 내용은 프로필 링크에서 확인하세요!",
    brand: "SoloStack",
    bgColor: "#1e3a5f",
    textColor: "#ffffff",
    overlayOpacity: 30,
    overlayColor: "#000000",
    titleSize: 24,
    bodySize: 16,
    align: "center",
  },
];

function parseCardnewsText(text: string): CardPage[] {
  if (!text.trim()) return defaultPages;

  const pages: CardPage[] = [];
  const sections = text.split(/【|】/).filter(Boolean);

  // 간단한 파싱: 【카드 N】 형태
  const cardBlocks = text.split(/(?=【카드\s*\d+)/i).filter((b) => b.trim());

  if (cardBlocks.length >= 2) {
    cardBlocks.forEach((block, idx) => {
      const lines = block
        .replace(/【카드\s*\d+[^\]]*】/i, "")
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const title = lines[0] || `카드 ${idx + 1}`;
      const body = lines.slice(1).join("\n") || "";

      pages.push({
        id: String(idx + 1),
        type: idx === 0 ? "cover" : idx === cardBlocks.length - 1 ? "cta" : "content",
        title: title.replace(/^훅\s*[-:]?\s*/i, "").slice(0, 40),
        body,
        brand: "SoloStack",
        bgColor: idx === 0 ? "#0f1117" : idx === cardBlocks.length - 1 ? "#1e3a5f" : "#161922",
        textColor: "#ffffff",
        overlayOpacity: 45,
        overlayColor: "#000000",
        titleSize: idx === 0 ? 26 : 20,
        bodySize: 15,
        align: idx === 0 || idx === cardBlocks.length - 1 ? "center" : "left",
      });
    });
  }

  return pages.length > 0 ? pages : defaultPages;
}

export default function CardNewsEditorPage() {
  const router = useRouter();
  const [pages, setPages] = useState<CardPage[]>(defaultPages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const current = pages[currentIndex];

  // 콘텐츠 워터폴에서 넘어온 데이터 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem("solostack_cardnews_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.text) {
          const parsed = parseCardnewsText(data.text);
          setPages(parsed);
        }
        // 한 번 쓰면 제거 (원하면 유지 가능)
        // localStorage.removeItem("solostack_cardnews_data");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateCurrent = useCallback(
    (patch: Partial<CardPage>) => {
      setPages((prev) =>
        prev.map((p, i) => (i === currentIndex ? { ...p, ...patch } : p))
      );
    },
    [currentIndex]
  );

  const addPage = () => {
    const newPage: CardPage = {
      id: String(Date.now()),
      type: "content",
      title: "새 카드 제목",
      body: "본문을 입력하세요.",
      brand: current?.brand || "SoloStack",
      bgColor: "#161922",
      textColor: "#ffffff",
      overlayOpacity: 40,
      overlayColor: "#000000",
      titleSize: 20,
      bodySize: 15,
      align: "left",
    };
    setPages((prev) => {
      const next = [...prev];
      next.splice(currentIndex + 1, 0, newPage);
      return next;
    });
    setCurrentIndex((i) => i + 1);
  };

  const deletePage = () => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleSave = () => {
    localStorage.setItem("solostack_cardnews_project", JSON.stringify(pages));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyCaption = () => {
    const caption = pages
      .map((p, i) => `${i + 1}. ${p.title}\n${p.body}`)
      .join("\n\n");
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0b0f] flex flex-col">
      {/* Top Toolbar */}
      <header className="h-12 border-b border-sidebar-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/content-waterfall")}
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            콘텐츠 워터폴
          </button>
          <span className="text-zinc-600">|</span>
          <span className="text-sm text-zinc-300 font-medium">카드뉴스 편집기</span>
          <span className="text-xs text-zinc-600">
            {currentIndex + 1} / {pages.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addPage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-sidebar-active hover:bg-zinc-700 rounded-md text-zinc-200 transition-colors"
          >
            <Plus size={13} />
            페이지 추가
          </button>
          <button
            onClick={deletePage}
            disabled={pages.length <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-sidebar-active hover:bg-zinc-700 disabled:opacity-40 rounded-md text-zinc-200 transition-colors"
          >
            <Trash2 size={13} />
            삭제
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-md text-white transition-colors"
          >
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "저장됨" : "저장"}
          </button>
          <button
            onClick={() => setShowPublish(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-md text-white transition-colors"
          >
            <Instagram size={13} />
            발행 미리보기
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Preview */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#08090c] p-6 relative">
          {/* Navigation */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-sidebar-active flex items-center justify-center text-zinc-300 disabled:opacity-30 hover:bg-zinc-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setCurrentIndex((i) => Math.min(pages.length - 1, i + 1))}
              disabled={currentIndex === pages.length - 1}
              className="w-10 h-10 rounded-full bg-sidebar-active flex items-center justify-center text-zinc-300 disabled:opacity-30 hover:bg-zinc-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Card Preview */}
          <div
            className="relative w-[320px] h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800"
            style={{ backgroundColor: current.bgColor }}
          >
            {/* Background Image */}
            {current.bgImage && (
              <img
                src={current.bgImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: current.overlayColor,
                opacity: current.overlayOpacity / 100,
              }}
            />
            {/* Content */}
            <div
              className={cn(
                "relative z-10 h-full flex flex-col p-6",
                current.align === "center" ? "items-center text-center justify-center" : "items-start text-left justify-end pb-10"
              )}
            >
              {current.brand && (
                <div
                  className="absolute top-4 left-0 right-0 text-center text-xs font-medium tracking-wide opacity-80"
                  style={{ color: current.textColor }}
                >
                  {current.brand}
                </div>
              )}
              <h2
                className="font-bold leading-tight mb-3"
                style={{
                  color: current.textColor,
                  fontSize: current.titleSize,
                }}
              >
                {current.title || "제목"}
              </h2>
              {current.body && (
                <p
                  className="leading-relaxed whitespace-pre-wrap opacity-90"
                  style={{
                    color: current.textColor,
                    fontSize: current.bodySize,
                  }}
                >
                  {current.body}
                </p>
              )}
            </div>
          </div>

          {/* Page Dots */}
          <div className="flex gap-1.5 mt-6">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === currentIndex ? "bg-blue-500" : "bg-zinc-700 hover:bg-zinc-500"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: Editor Panel */}
        <aside className="w-[360px] border-l border-sidebar-border bg-[#0f1117] overflow-y-auto shrink-0">
          <div className="p-4 space-y-5">
            {/* Type Badge */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded font-medium",
                  current.type === "cover" && "bg-blue-500/20 text-blue-400",
                  current.type === "content" && "bg-emerald-500/20 text-emerald-400",
                  current.type === "cta" && "bg-purple-500/20 text-purple-400"
                )}
              >
                {current.type === "cover" ? "표지" : current.type === "cta" ? "CTA" : "본문"}
              </span>
              <span className="text-xs text-zinc-500">페이지 {currentIndex + 1}</span>
            </div>

            {/* Brand */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
                <Type size={12} />
                브랜드 / 상단 텍스트
              </label>
              <input
                value={current.brand}
                onChange={(e) => updateCurrent({ brand: e.target.value })}
                className="w-full bg-[#0a0b0f] border border-sidebar-border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Title */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
                제목
              </label>
              <textarea
                value={current.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
                rows={2}
                className="w-full bg-[#0a0b0f] border border-sidebar-border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-zinc-600">크기</span>
                <input
                  type="range"
                  min={14}
                  max={36}
                  value={current.titleSize}
                  onChange={(e) => updateCurrent({ titleSize: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-[10px] text-zinc-500 w-6">{current.titleSize}</span>
              </div>
            </div>

            {/* Body */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
                본문
              </label>
              <textarea
                value={current.body}
                onChange={(e) => updateCurrent({ body: e.target.value })}
                rows={5}
                className="w-full bg-[#0a0b0f] border border-sidebar-border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-zinc-600">크기</span>
                <input
                  type="range"
                  min={12}
                  max={22}
                  value={current.bodySize}
                  onChange={(e) => updateCurrent({ bodySize: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-[10px] text-zinc-500 w-6">{current.bodySize}</span>
              </div>
            </div>

            {/* Align */}
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">정렬</label>
              <div className="flex gap-1">
                <button
                  onClick={() => updateCurrent({ align: "left" })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs transition-colors",
                    current.align === "left"
                      ? "bg-blue-600 text-white"
                      : "bg-sidebar-active text-zinc-400 hover:text-white"
                  )}
                >
                  <AlignLeft size={13} /> 왼쪽
                </button>
                <button
                  onClick={() => updateCurrent({ align: "center" })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs transition-colors",
                    current.align === "center"
                      ? "bg-blue-600 text-white"
                      : "bg-sidebar-active text-zinc-400 hover:text-white"
                  )}
                >
                  <AlignCenter size={13} /> 가운데
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">배경색</label>
                <input
                  type="color"
                  value={current.bgColor}
                  onChange={(e) => updateCurrent({ bgColor: e.target.value })}
                  className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">글자색</label>
                <input
                  type="color"
                  value={current.textColor}
                  onChange={(e) => updateCurrent({ textColor: e.target.value })}
                  className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
                <ImageIcon size={12} />
                배경 이미지 URL
              </label>
              <input
                value={current.bgImage || ""}
                onChange={(e) => updateCurrent({ bgImage: e.target.value || undefined })}
                placeholder="https://..."
                className="w-full bg-[#0a0b0f] border border-sidebar-border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50"
              />
              {current.bgImage && (
                <button
                  onClick={() => updateCurrent({ bgImage: undefined })}
                  className="mt-1 text-[10px] text-red-400 hover:text-red-300"
                >
                  이미지 제거
                </button>
              )}
            </div>

            {/* Overlay */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
                <Layers size={12} />
                오버레이 투명도 ({current.overlayOpacity}%)
              </label>
              <input
                type="range"
                min={0}
                max={90}
                value={current.overlayOpacity}
                onChange={(e) => updateCurrent({ overlayOpacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="h-24 border-t border-sidebar-border bg-[#0f1117] flex items-center gap-3 px-4 overflow-x-auto shrink-0">
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-14 h-20 rounded-lg border-2 overflow-hidden shrink-0 transition-all relative",
              i === currentIndex
                ? "border-blue-500 scale-105"
                : "border-zinc-700 hover:border-zinc-500"
            )}
            style={{ backgroundColor: page.bgColor }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-1">
              <span className="text-[8px] text-white/80 line-clamp-3 text-center leading-tight">
                {page.title.slice(0, 20)}
              </span>
            </div>
            <span className="absolute bottom-0.5 right-0.5 text-[8px] text-white/50 bg-black/40 px-1 rounded">
              {i + 1}
            </span>
          </button>
        ))}
        <button
          onClick={addPage}
          className="w-14 h-20 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Publish Modal */}
      {showPublish && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-sidebar-border rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-sidebar-border">
              <span className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Instagram size={16} className="text-pink-400" />
                인스타그램 발행 미리보기
              </span>
              <button
                onClick={() => setShowPublish(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-black rounded-xl p-3 flex gap-3">
                <div
                  className="w-32 h-48 rounded-lg overflow-hidden shrink-0 relative"
                  style={{ backgroundColor: pages[0]?.bgColor }}
                >
                  {pages[0]?.bgImage && (
                    <img src={pages[0].bgImage} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  )}
                  <div className="relative z-10 p-2 flex items-end h-full">
                    <span className="text-[10px] text-white font-medium line-clamp-3">
                      {pages[0]?.title}
                    </span>
                  </div>
                </div>
                <div className="flex-1 text-xs text-zinc-400 space-y-1 overflow-y-auto max-h-48">
                  {pages.map((p, i) => (
                    <div key={p.id}>
                      <span className="text-zinc-500">{i + 1}.</span> {p.title}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCopyCaption}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-sidebar-active hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "캡션 복사됨" : "캡션 전체 복사"}
              </button>
              <p className="text-[11px] text-zinc-600 text-center">
                실제 인스타 자동 발행은 추후 Meta API 연동 예정입니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
