const calendarDates = document.getElementById('calendarDates');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date(); // 현재 날짜 (년, 월, 일)

function renderCalendar() {
    calendarDates.innerHTML = ''; // 기존 날짜 초기화
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0부터 11까지 (1월은 0, 12월은 11)

    // 현재 월의 첫째 날과 마지막 날 계산
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // 다음 달의 0번째 날 = 이번 달의 마지막 날

    // 달력 헤더 업데이트
    currentMonthYear.textContent = `${year}년 ${month + 1}월`;

    // 이전 달의 날짜 채우기 (공백)
    const firstDayIndex = firstDayOfMonth.getDay(); // 0(일요일)부터 6(토요일)

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('other-month');
        // 이전 달의 날짜를 계산하여 표시할 수도 있지만, 여기서는 간단히 빈칸으로 처리합니다.
        // const prevMonthDate = new Date(year, month, 0 - i);
        // emptyDiv.textContent = prevMonthDate.getDate();
        calendarDates.appendChild(emptyDiv);
    }

    // 현재 달의 날짜 채우기
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = i;

        // 오늘 날짜 표시
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dateDiv.classList.add('today');
        }

        calendarDates.appendChild(dateDiv);
    }

    // 다음 달의 날짜 채우기 (나머지 공백)
    // 현재 달의 날짜와 이전 달의 공백을 합친 후 7로 나눈 나머지를 계산하여 다음 달 공백을 채웁니다.
    const totalCells = firstDayIndex + lastDayOfMonth.getDate();
    const remainingCells = 42 - totalCells; // 6주 (6 * 7 = 42) 기준으로 남은 셀 계산

    for (let i = 0; i < remainingCells; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('other-month');
        // 다음 달의 날짜를 계산하여 표시할 수도 있지만, 여기서는 간단히 빈칸으로 처리합니다.
        // const nextMonthDate = new Date(year, month + 1, i + 1);
        // emptyDiv.textContent = nextMonthDate.getDate();
        calendarDates.appendChild(emptyDiv);
    }
}

// 이전 달로 이동
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

// 다음 달로 이동
nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// 페이지 로드 시 캘린더 렌더링
renderCalendar();