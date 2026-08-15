"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Waves,
  Youtube,
  Instagram,
  FileText,
  Code2,
  Megaphone,
  Users,
  Presentation,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Target,
  Image as ImageIcon,
  BarChart3,
  Link2,
  Phone,
  Database,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  children?: { name: string; href: string; icon: React.ReactNode }[];
}

const menuItems: MenuItem[] = [
  {
    name: "전사 대시보드",
    href: "/",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "기획팀",
    href: "/planning",
    icon: <ClipboardList size={18} />,
  },
  {
    name: "콘텐츠 워터폴",
    href: "/content-waterfall",
    icon: <Waves size={18} />,
  },
  {
    name: "유튜브팀",
    href: "/youtube",
    icon: <Youtube size={18} />,
  },
  {
    name: "인스타그램팀",
    href: "/instagram",
    icon: <Instagram size={18} />,
  },
  {
    name: "블로그팀",
    href: "/blog",
    icon: <FileText size={18} />,
  },
  {
    name: "개발팀",
    href: "/dev",
    icon: <Code2 size={18} />,
  },
  {
    name: "마케팅팀",
    icon: <Megaphone size={18} />,
    children: [
      { name: "메타광고", href: "/marketing/meta", icon: <Target size={16} /> },
      { name: "구글애드", href: "/marketing/google", icon: <BarChart3 size={16} /> },
      { name: "이미지 소재 생성기", href: "/marketing/image-gen", icon: <ImageIcon size={16} /> },
      { name: "UTM 관리", href: "/marketing/utm", icon: <Link2 size={16} /> },
    ],
  },
  {
    name: "CRM팀",
    icon: <Users size={18} />,
    children: [
      { name: "전화상담 코파일럿", href: "/crm/call-copilot", icon: <Phone size={16} /> },
      { name: "상담고객 DB", href: "/crm/customers", icon: <Database size={16} /> },
    ],
  },
  {
    name: "PPT팀",
    href: "/ppt",
    icon: <Presentation size={18} />,
  },
  {
    name: "세일즈팀",
    href: "/sales",
    icon: <ShoppingCart size={18} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["마케팅팀", "CRM팀"]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">SoloStack</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = item.href === pathname;
            const hasChildren = !!item.children;
            const isOpen = openMenus.includes(item.name);
            const isChildActive = hasChildren && item.children!.some((c) => c.href === pathname);

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        isChildActive
                          ? "text-zinc-100 bg-sidebar-hover"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-sidebar-hover"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isOpen && (
                      <ul className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border space-y-0.5">
                        {item.children!.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                                  childActive
                                    ? "bg-sidebar-active text-white"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-sidebar-hover"
                                )}
                              >
                                {child.icon}
                                <span>{child.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-active text-white"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-sidebar-hover"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-zinc-600 text-center">
          SoloStack v0.1 · 1인기업 허브
        </div>
      </div>
    </aside>
  );
}
