# @idealinsane/opencode-router-track

OpenRouter Free Models Router가 반환하는 모델 정보를 읽어 OpenCode TUI 사이드바에 표시하기 위한 실험적인 플러그인입니다.

## 설치

npmjs.org 공개 배포 후 다음 명령으로 설치할 수 있습니다. GitHub PAT는 필요하지 않습니다.

```sh
npm install @idealinsane/opencode-router-track
```

GitHub Packages(`npm.pkg.github.com`)에 있는 동명 패키지는 별도 레지스트리이며, 설치 시 GitHub 인증이 필요합니다. 이 저장소의 기본 배포 대상은 npmjs.org입니다.

## 동작

- 서버 진입점: `dist/index.js` (기본 export). `http.response` 훅에서 무료 모델 요청의 SSE 또는 JSON 응답에 포함된 모델 정보를 읽습니다.
- TUI 진입점: `dist/tui.jsx` (기본 export). 사이드바의 `Free Models Router` 영역에 마지막으로 수집한 모델 정보를 표시합니다.
- 로컬 상태: `$HOME/.local/share/opencode/plugins/opencode-router-track/resolved.json`.

서버 및 TUI 진입점은 사용하는 OpenCode 버전의 플러그인 로더에 각각 등록해야 합니다. 단순히 npm으로 설치하는 것만으로 활성화되지는 않습니다.

## 호환성과 제한

- 개발 의존성은 `@opencode/plugin@2.1.2`입니다. V2 플러그인 API를 사용하며, 다른 버전에서의 동작을 보장하지 않습니다.
- 응답에 모델 정보가 없으면 선택된 모델을 알아낼 수 없습니다. 표시값은 응답 또는 메시지 메타데이터에서 읽은 값이며, 별도로 검증한 제공자 정보가 아닙니다.
- 상태 파일은 세션별로 분리되지 않습니다. 여러 세션에서는 이전 요청의 값이 표시될 수 있습니다.
- 빌드 검증과 실제 OpenCode에서의 실행 검증은 별개입니다. 이 저장소에는 아직 자동화된 OpenCode 통합 테스트가 없습니다.

## 소스에서 빌드

```sh
git clone https://github.com/idealinsane/opencode-router-track.git
cd opencode-router-track
npm ci
npm run build
npm pack --dry-run
```

산출물은 `dist/`에 생성됩니다. 저장소에는 빌드 산출물을 커밋하지 않습니다.

## 라이선스

MIT (`package.json`의 라이선스 선언).
