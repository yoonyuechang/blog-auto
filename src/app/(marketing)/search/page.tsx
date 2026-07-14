import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "글 검색 | DevPulse",
  description: "DevPulse에서 다양한 IT/개발 관련 아티클을 검색해보세요. 카테고리, 기술, 키워드별로 찾아볼 수 있습니다.",
  openGraph: { title: "글 검색 | DevPulse", description: "DevPulse IT 아티클 검색", type: "website" },
};

export default function SearchPage() {
  return <SearchPageClient />;
}
