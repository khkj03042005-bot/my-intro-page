// 김현준 포트폴리오 웹 표준 & 통과 기준 검증 스크립트

document.addEventListener('DOMContentLoaded', () => {
  // Lucide 아이콘 초기화
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 시스템 기본 감축 모션(prefers-reduced-motion) 반영
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setMotionReduced(true);
  }
});

// Toast 알림 함수 (스크린 리더 배려)
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

// -------------------------------------------------------------------------
// 1. T01-C09 & T01-C19: 강점별 구체적 증명 근거 보기 (마우스 & 키보드 지원)
// -------------------------------------------------------------------------
const evidenceData = {
  bike: {
    title: '확인할 수 있는 증명 근거 상세: [60km 장거리 자전거 주행 기록]',
    content: `
      <div class="space-y-1.5">
        <p>🚴 <strong>자전거 완주 데이터:</strong> 총 주행 거리 60.4km / 주행 시간 3시간 45분 / 평균 시속 16.1km/h / 획득 고도 280m.</p>
        <p class="text-slate-300">※ 한여름 폭염 속에서도 15km 구간별 수분 섭취와 페이스 분배를 엄격히 지켜 당초 4시간 목표를 15분 앞당겨 100% 완주에 성공한 실제 로그입니다.</p>
      </div>
    `
  },
  walk: {
    title: '확인할 수 있는 증명 근거 상세: [4주 연속 저녁 30분 산책 일지]',
    content: `
      <div class="space-y-1.5">
        <p>🚶 <strong>산책 및 마인드셋 루틴 데이터:</strong> 연속 28일 실천 / 1일 평균 걸음 수 6,200보 / 저녁 사색 및 우선순위 기록표 28회 작성.</p>
        <p class="text-slate-300">※ 일정이 몰릴 때 스마트폰을 끄고 매일 30분씩 묵묵히 걸으며 다음 날 계획의 우선순위를 3단계로 정리하여 작업 마감 완수율을 35% 끌어올렸습니다.</p>
      </div>
    `
  },
  promise: {
    title: '확인할 수 있는 증명 근거 상세: [약속 준수율 100% & 지각 0회 기록표]',
    content: `
      <div class="space-y-1.5">
        <p>🤝 <strong>시간 엄수 데이터:</strong> 총 42회 공식 팀 회의 및 미팅 참석 / 지각 0회 / 평균 12분 조기 도착.</p>
        <p class="text-slate-300">※ 예상 이동 시간에 20분의 여유 버퍼를 두어 대중교통 변수에도 100% 대응했으며, 팀원들에게 '가장 신뢰할 수 있는 실행자'로 인정받았습니다.</p>
      </div>
    `
  }
};

function showEvidence(type) {
  const titleEl = document.getElementById('evidence-title');
  const bodyEl = document.getElementById('evidence-body');
  const section = document.getElementById('evidence-section');

  if (!evidenceData[type] || !titleEl || !bodyEl) return;

  titleEl.textContent = evidenceData[type].title;
  bodyEl.innerHTML = evidenceData[type].content;

  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  showToast('증명 근거 데이터가 연결되었습니다.');
}

// -------------------------------------------------------------------------
// 2. T01-C19 ~ T01-C21: 일일 실행 루틴 인터랙션 (마우스 & 키보드 체크)
// -------------------------------------------------------------------------
function updateRoutineProgress() {
  const container = document.getElementById('routine-items');
  const badge = document.getElementById('routine-rate-badge');
  if (!container || !badge) return;

  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  const total = checkboxes.length;
  let checkedCount = 0;

  checkboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  const rate = Math.round((checkedCount / total) * 100);
  badge.textContent = `${rate}% 달성 중`;

  if (rate === 100) {
    badge.className = 'px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300';
    showToast('모든 일일 루틴을 100% 완수했습니다!');
  } else {
    badge.className = 'px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sunsetOrange/20 border border-sunsetOrange/40 text-orange-300';
  }
}

function resetRoutine() {
  const container = document.getElementById('routine-items');
  if (!container) return;

  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => { cb.checked = true; });
  updateRoutineProgress();
}

// -------------------------------------------------------------------------
// 3. T01-C22: 큰 움직임 끄기 / 켜기 사용자 제어 토글
// -------------------------------------------------------------------------
let isReducedMotion = false;

function toggleMotion() {
  setMotionReduced(!isReducedMotion);
  if (isReducedMotion) {
    showToast('화면 움직임 효과를 껐습니다 (접근성 모드).');
  } else {
    showToast('화면 움직임 효과를 켰습니다.');
  }
}

function setMotionReduced(enable) {
  isReducedMotion = enable;
  const btn = document.getElementById('toggle-motion-btn');
  const btnText = document.getElementById('motion-btn-text');

  if (enable) {
    document.documentElement.classList.add('motion-reduced');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    if (btnText) btnText.textContent = '움직임 켜기';
  } else {
    document.documentElement.classList.remove('motion-reduced');
    if (btn) btn.setAttribute('aria-pressed', 'false');
    if (btnText) btnText.textContent = '움직임 끄기';
  }
}

// -------------------------------------------------------------------------
// 4. 이메일 복사 (개인정보 노출 방지 & 웹 소통 창구)
// -------------------------------------------------------------------------
function copyContactEmail() {
  const email = 'hyunjun.executor@gmail.com';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(() => {
      showToast(`이메일 주소가 복사되었습니다: ${email}`);
      const btnText = document.getElementById('email-btn-text');
      if (btnText) {
        btnText.textContent = '복사 완료! ✔';
        setTimeout(() => {
          btnText.textContent = '협업 이메일 주소 복사하기';
        }, 2000);
      }
    }).catch(() => {
      showToast(`이메일: ${email}`);
    });
  } else {
    showToast(`이메일: ${email}`);
  }
}
