// Random Number Game JavaScript

// generateRandomNumber 함수 구현 (PDF 요구사항)
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// DOM 요소들 가져오기
const rangeSlider = document.getElementById('js-range');
const rangeSpan = document.querySelector('#js-title span');
const guessForm = document.getElementById('js-guess');
const guessInput = document.getElementById('num');
const resultSpan = document.querySelector('#js-result span');

// 슬라이더 값 변경 시 범위 업데이트
rangeSlider.addEventListener('input', function() {
    const currentValue = this.value;
    rangeSpan.textContent = currentValue;
    
    // 입력 필드의 max 속성도 업데이트
    guessInput.max = currentValue;
});

// 폼 제출 이벤트 처리 (Play 버튼 클릭)
guessForm.addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 기본 제출 방지
    
    const userGuess = parseInt(guessInput.value);
    const maxRange = parseInt(rangeSlider.value);
    
    // 입력값 검증
    if (isNaN(userGuess) || userGuess < 0 || userGuess > maxRange) {
        resultSpan.textContent = `Please enter a valid number between 0 and ${maxRange}`;
        return;
    }
    
    // 랜덤 숫자 생성
    const randomNumber = generateRandomNumber(0, maxRange);
    
    // 결과 비교 및 출력
    if (userGuess === randomNumber) {
        resultSpan.innerHTML = `You choose: ${userGuess}, the machine choose: ${randomNumber}.<br><strong>You win!</strong>`;
    } else {
        resultSpan.innerHTML = `You choose: ${userGuess}, the machine choose: ${randomNumber}.<br><strong>You lost!</strong>`;
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 초기 범위 표시
    rangeSpan.textContent = rangeSlider.value;
    guessInput.max = rangeSlider.value;
});
