# Client Root Metadata Spec

## Metadata

- Jira: DCMCL-36
- Route: app-wide
- Owner: `apps/client`
- Status: Implemented

## Purpose

- 검색 결과와 링크 공유 미리보기에 동치미의 이름과 서비스 설명을 일관되게 제공합니다.
- 운영 origin과 기본 canonical URL을 고정합니다.
- 기존 PWA manifest, Apple Web App, favicon 메타데이터를 유지합니다.

## Contract

- production origin: `https://app.dongchiimi.com`
- title: `동치미`
- description: `우리 동네 마트 오늘 할인 정보, 마트 가기 전에 먼저 확인하세요.`
- canonical path: `/`
- Open Graph:
  - type: `website`
  - locale: `ko_KR`
  - site name: `동치미`
  - image: `/images/og-image.png` (`3200 x 1600`, PNG)
- Twitter Card:
  - card: `summary_large_image`
  - title, description, image는 Open Graph와 같은 값을 사용합니다.
- robots는 기본적으로 indexing과 link following을 허용합니다.

## Ownership

- `src/app/layout.tsx`: root metadata 값, production origin, Next.js metadata export와 viewport
- `public/images/og-image.png`: 정적 공유 이미지
- `src/app/metadata.test.ts`: metadata 계약과 기존 PWA metadata 회귀 검증

## Out Of Scope

- route별 title, description, canonical 재정의
- 마트 또는 상품별 동적 Open Graph 이미지
- sitemap과 robots route 생성
- 외부 검색엔진 또는 공유 플랫폼 등록

## Verification

- `pnpm --filter client lint`
- `pnpm --filter client typecheck`
- `pnpm --filter client test`
- `pnpm --filter client build`
- production HTML head의 canonical, Open Graph, Twitter meta 태그 확인
