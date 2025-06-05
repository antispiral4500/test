document.addEventListener('DOMContentLoaded', () => {
    const monthYearDisplay = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    // 메모 관련 DOM 요소
    const memoDateDisplay = document.getElementById('memoDateDisplay');
    const memoInput = document.getElementById('memoInput');
    const saveMemoBtn = document.getElementById('saveMemo');
    const deleteMemoBtn = document.getElementById('deleteMemo');

    // D-Day 관련 DOM 요소
    const ddayInput = document.getElementById('ddayInput');
    const setDdayBtn = document.getElementById('setDday');
    const clearDdayBtn = document.getElementById('clearDday');
    const ddayDisplay = document.getElementById('ddayDisplay');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null; // 사용자가 현재 선택한 Date 객체 (메모용)

    // D-Day 저장 변수 (Date 객체)
    let ddayDate = null;

    // --- 로컬 스토리지에서 데이터 불러오기 ---
    let dailyMemos = JSON.parse(localStorage.getItem('dailyMemos')) || {};
    const savedDday = localStorage.getItem('dday');
    if (savedDday) {
        ddayDate = new Date(savedDday);
        ddayInput.value = savedDday.substring(0, 10); // input type="date"에 형식 맞게 넣어주기
    }

    // 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- 달력 렌더링 함수 ---
    function renderCalendar() {
        calendarGrid.innerHTML = '';

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        monthYearDisplay.textContent = `${currentYear}년 ${currentMonth + 1}월`;

        // 빈 칸 채우기
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // 날짜 채우기
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            const fullDate = new Date(currentYear, currentMonth, day);
            const formattedDate = formatDate(fullDate);

            // 날짜 숫자 표시
            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.classList.add('day-number');
            dayNumberSpan.textContent = day;
            dayDiv.appendChild(dayNumberSpan);

            // 오늘 날짜 표시
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            fullDate.setHours(0, 0, 0, 0);

            if (fullDate.getTime() === today.getTime()) {
                dayDiv.classList.add('today');
            }

            // 선택된 날짜 표시 (메모용)
            if (selectedDate && formattedDate === formatDate(selectedDate)) {
                dayDiv.classList.add('selected');
            }

            // D-Day 마크 표시
            if (ddayDate && formattedDate === formatDate(ddayDate)) {
                const ddayMark = document.createElement('span');
                ddayMark.classList.add('dday-mark');
                ddayMark.textContent = 'D';
                dayDiv.appendChild(ddayMark);
            }

            // 메모가 있는 날짜 표시 및 미리보기
            if (dailyMemos[formattedDate]) {
                dayDiv.classList.add('has-memo');
                const memoPreview = document.createElement('p');
                memoPreview.classList.add('memo-preview');
                memoPreview.textContent = dailyMemos[formattedDate];
                dayDiv.appendChild(memoPreview);
            }

            // 날짜 클릭 이벤트 리스너 (메모 기능 활성화)
            dayDiv.addEventListener('click', () => {
                const previouslySelected = document.querySelector('.calendar-grid .selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                dayDiv.classList.add('selected');
                selectedDate = new Date(fullDate);
                displayMemoForSelectedDate(formattedDate);
            });

            calendarGrid.appendChild(dayDiv);
        }

        // 달력 렌더링 후 D-Day 정보 및 메모 섹션 상태 업데이트
        updateDdayDisplay();
        if (selectedDate) {
            displayMemoForSelectedDate(formatDate(selectedDate));
        } else {
            memoDateDisplay.textContent = '날짜를 선택하세요';
            memoInput.value = '';
            memoInput.disabled = true;
            saveMemoBtn.disabled = true;
            deleteMemoBtn.disabled = true;
        }
    }

    // --- D-Day 표시 업데이트 함수 ---
    function updateDdayDisplay() {
        if (ddayDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            ddayDate.setHours(0, 0, 0, 0);

            const timeDiff = ddayDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초를 일로 변환

            if (daysDiff === 0) {
                ddayDisplay.textContent = '오늘은 D-Day 입니다!';
                ddayDisplay.style.color = '#28a745'; // 초록색
            } else if (daysDiff > 0) {
                ddayDisplay.textContent = `D-${daysDiff}`;
                ddayDisplay.style.color = '#e74c3c'; // 빨간색
            } else {
                ddayDisplay.textContent = `D+${Math.abs(daysDiff)}`;
                ddayDisplay.style.color = '#3498db'; // 파란색
            }
        } else {
            ddayDisplay.textContent = 'D-Day가 설정되지 않았습니다.';
            ddayDisplay.style.color = '#7f8c8d'; // 회색
        }
    }

    // --- 메모 관련 기능 ---
    function displayMemoForSelectedDate(dateString) {
        memoDateDisplay.textContent = `${dateString.substring(0, 4)}년 ${dateString.substring(5, 7)}월 ${dateString.substring(8, 10)}일`;
        memoInput.value = dailyMemos[dateString] || '';
        memoInput.disabled = false;
        saveMemoBtn.disabled = false;
        deleteMemoBtn.disabled = false;
    }

    saveMemoBtn.addEventListener('click', () => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            const memoText = memoInput.value.trim();

            if (memoText) {
                dailyMemos[formattedDate] = memoText;
            } else {
                delete dailyMemos[formattedDate];
            }
            localStorage.setItem('dailyMemos', JSON.stringify(dailyMemos));
            renderCalendar();
        } else {
            alert('메모를 저장할 날짜를 먼저 선택해주세요.');
        }
    });

    deleteMemoBtn.addEventListener('click', () => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            if (confirm(`${formattedDate}의 메모를 정말 삭제하시겠습니까?`)) {
                delete dailyMemos[formattedDate];
                localStorage.setItem('dailyMemos', JSON.stringify(dailyMemos));
                memoInput.value = '';
                renderCalendar();
            }
        } else {
            alert('삭제할 메모의 날짜를 먼저 선택해주세요.');
        }
    });

    // --- D-Day 관련 기능 ---
    setDdayBtn.addEventListener('click', () => {
        const selectedDateValue = ddayInput.value;
        if (selectedDateValue) {
            ddayDate = new Date(selectedDateValue);
            localStorage.setItem('dday', selectedDateValue); // 로컬 스토리지에 저장
            renderCalendar(); // 달력과 D-Day 표시 업데이트
        } else {
            alert('D-Day로 설정할 날짜를 입력해주세요.');
        }
    });

    clearDdayBtn.addEventListener('click', () => {
        if (confirm('D-Day를 초기화하시겠습니까?')) {
            ddayDate = null; // D-Day 초기화
            localStorage.removeItem('dday'); // 로컬 스토리지에서 삭제
            ddayInput.value = ''; // 입력 필드 비우기
            renderCalendar(); // 달력과 D-Day 표시 업데이트
        }
    });

    // --- 캘린더 이동 버튼 ---
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        selectedDate = null; // 달 변경 시 선택된 날짜 초기화
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        selectedDate = null; // 달 변경 시 선택된 날짜 초기화
        renderCalendar();
    });

    // 초기 렌더링
    renderCalendar();
});