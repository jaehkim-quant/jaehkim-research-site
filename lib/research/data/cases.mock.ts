import type { CaseStudy } from "../types";

export const casesMock: CaseStudy[] = [
  {
    id: "1",
    title: "펀드 X 포트폴리오 리스크 리뷰",
    slug: "fund-x-risk-review",
    problem: "다양한 전략을 운영 중이나 레짐 변화 시 동시 드로다운 발생.",
    approach: "레짐별 상관관계 분석 후, 스트레스 구간에서 상관이 급등하는 페어 식별. 헤징 포지션 도입.",
    result: "최대 드로다운 12% → 8% 개선. Calmar 비율 0.8 → 1.1.",
    learnings: "레짐 스위치 타이밍이 전략 간보다 더 중요함.",
    next: "실시간 레짐 모니터링 대시보드 구축 예정.",
    date: "2024-01",
  },
  {
    id: "2",
    title: "개인 투자자 A 자산배분 자문",
    slug: "individual-a-asset-allocation",
    problem: "고령화 대비 안정적 수익이 필요하나, 인플레이션 헤지도 고려.",
    approach: "목표 수익률·MDD 제약 하에 시뮬레이션. TIPS, 골드, 모멘텀 ETF 조합 제안.",
    result: "연 4% 목표, MDD 8% 이내 달성. 클라이언트 만족.",
    learnings: "단순 재테크 조언보다 '제약 조건 명시'가 신뢰 형성에 효과적.",
    next: "분기별 리뷰 프로세스 정착.",
    date: "2023-12",
  },
  {
    id: "3",
    title: "알고 트레이딩 시스템 검증",
    slug: "algo-system-validation",
    problem: "백테스트 성과와 실거래 차이가 큼. 원인 파악 필요.",
    approach: "워크포워드 아웃오브샘플 분할, 슬리피지·레이턴시 시뮬레이션, 서바이버십 바이어스 점검.",
    result: "슬리피지 가정 2배로 상향, 일부 시그널 룩어헤드 발견. 수정 후 실거래 적합.",
    learnings: "비용 가정을 보수적으로 잡아야 실전 격차를 줄일 수 있음.",
    next: "실거래 모니터링 대시보드 연동.",
    date: "2023-11",
  },
];
