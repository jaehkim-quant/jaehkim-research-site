export interface Tool {
  id: string;
  title: string;
  description: string;
  type: "템플릿" | "체크리스트" | "스니펫";
  link?: string;
}

export const toolsMock: Tool[] = [
  {
    id: "1",
    title: "백테스트 설정 체크리스트",
    description: "룩어헤드, 서바이버십, 리밸런싱, 슬리피지·수수료 점검 항목",
    type: "체크리스트",
  },
  {
    id: "2",
    title: "Assumptions 표 템플릿",
    description: "데이터 범위, 유니버스, 리밸런싱, 비용, 슬리피지, 실행 가정 정리",
    type: "템플릿",
  },
  {
    id: "3",
    title: "성과 지표 표준 (CAGR 금지)",
    description: "MDD, Sharpe, Sortino, Calmar, 턴오버 보고 규칙",
    type: "스니펫",
  },
  {
    id: "4",
    title: "워크포워드 검증 프로토콜",
    description: "아웃오브샘플 분할, 레짐·스트레스 테스트 절차",
    type: "템플릿",
  },
];
