import React, { useState } from 'react';

function Calendar({ categories, actualExpenses, setActualExpenses, estimatedExpenses, setEstimatedExpenses }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [actualModalOpen, setActualModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [actualInput, setActualInput] = useState('');
  const [categoryInputs, setCategoryInputs] = useState({});

  const openActualModal = (date) => {
    const dateKey = date.toDateString();
    setSelectedDate(date);
    setActualInput(actualExpenses[dateKey] || '');
    setActualModalOpen(true);
  };

  const openEstimatedModal = (date) => {
    const dateKey = date.toDateString();
    setSelectedDate(date);
    const existing = estimatedExpenses[dateKey] || {};
    const inputs = {};
    categories.forEach(cat => {
      inputs[cat.name] = existing[cat.name] || 0;
    });
    setCategoryInputs(inputs);
    setCategoryModalOpen(true);
  };

  const handleSaveActualAmount = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toDateString();
      const numAmount = parseFloat(actualInput) || 0;
      setActualExpenses(prev => ({ ...prev, [dateKey]: numAmount }));
    }
    setActualModalOpen(false);
    setSelectedDate(null);
    setActualInput('');
  };

  const handleCancelActual = () => {
    setActualModalOpen(false);
    setSelectedDate(null);
    setActualInput('');
  };

  const handleSaveCategoryAmounts = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toDateString();
      setEstimatedExpenses(prev => ({ ...prev, [dateKey]: { ...categoryInputs } }));
    }
    setCategoryModalOpen(false);
    setSelectedDate(null);
    setCategoryInputs({});
  };

  const handleCancelCategory = () => {
    setCategoryModalOpen(false);
    setSelectedDate(null);
    setCategoryInputs({});
  };

  const handleWeekClick = (weekIndex) => {
    setSelectedWeek(weekIndex);
    setWeekModalOpen(true);
  };

  const handleCloseWeekModal = () => {
    setWeekModalOpen(false);
    setSelectedWeek(null);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];
    // 시작 빈 셀
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-start-${i}`} className="calendar-day empty"></div>);
    }
    // 날짜 셀
    for (let date = 1; date <= lastDate; date++) {
      const dateObj = new Date(year, month, date);
      const dateKey = dateObj.toDateString();
      const actualAmount = actualExpenses[dateKey] || 0;
      const dayEstimated = estimatedExpenses[dateKey] || {};
      const estimatedAmount = Object.values(dayEstimated).reduce((a,b)=>a+b,0);
      days.push(
        <div
          key={date}
          className="calendar-day"
          onClick={() => openActualModal(dateObj)}
        >
          <div>{date}</div>
          <div className="expense-amount">{actualAmount.toLocaleString()}원</div>
        </div>
      );
    }
    // 끝 빈 셀 (총 42개로 고정)
    const totalCells = 42;
    const remainingCells = totalCells - firstDay - lastDate;
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    // 주 단위로 그룹화하고 버튼 추가
    const weeks = [];
    for (let i = 0; i < 6; i++) {
      const week = [];
      const weekDays = days.slice(i * 7, (i + 1) * 7);
      const hasDates = weekDays.some(day => !day.props.className.includes('empty'));

      // 주 설정 버튼 (날짜가 있는 주만 표시)
      if (hasDates) {
        week.push(
          <button
            key={`week-btn-${i}`}
            className="week-setting-btn"
            onClick={() => handleWeekClick(i)}
          >
            ➡️
          </button>
        );
      } else {
        week.push(<div key={`week-btn-${i}`} className="calendar-day empty"></div>);
      }

      // 해당 주의 7일
      week.push(...weekDays);
      weeks.push(week);
    }

    return weeks.flat();
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="month-nav" onClick={prevMonth}>&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button className="month-nav" onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day empty"></div> {/* 빈 헤더 */}
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="calendar-day header">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      {/* actual expense modal */}
      {actualModalOpen && selectedDate && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedDate.toLocaleDateString()} 소비 금액</h3>
            <input
              type="number"
              value={actualInput}
              onChange={(e) => setActualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveActualAmount();
                }
              }}
              placeholder="금액 입력 (원)"
            />
            <div className="modal-buttons">
              <button onClick={handleCancelActual}>취소</button>
              <button onClick={handleSaveActualAmount}>저장</button>
            </div>
          </div>
        </div>
      )}
      {/* estimated expense modal */}
      {categoryModalOpen && selectedDate && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedDate.toLocaleDateString()} 예상 소비</h3>
            <div className="category-inputs">
              {categories.map(cat => (
                <label key={cat.name}>
                  {cat.emoji} {cat.name}
                  <input
                    type="number"
                    value={categoryInputs[cat.name] || ""}
                    placeholder="금액 입력 (원)"
                    onChange={e => setCategoryInputs(prev => ({ ...prev, [cat.name]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
            <div className="modal-buttons">
              <button onClick={handleCancelCategory}>취소</button>
              <button onClick={handleSaveCategoryAmounts}>저장</button>
            </div>
          </div>
        </div>
      )}
      {/* week selection modal */}
      {weekModalOpen && selectedWeek !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>예상 소비</h3>
            <div className="week-days">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const weekStartDate = 1 + selectedWeek * 7 - firstDayOfMonth;
                const date = weekStartDate + dayIndex;
                const dateObj = new Date(year, month, date);
                const dateKey = dateObj.toDateString();
                const dayEstimated = estimatedExpenses[dateKey] || {};
                const estimatedAmount = Object.values(dayEstimated).reduce((a,b) => a + parseFloat(b || 0), 0);
                const isValid = date >= 1 && date <= new Date(year, month + 1, 0).getDate();
                return (
                  <div key={dayIndex} className="week-day-container">
                    <button
                      className={`week-day-btn ${!isValid ? 'disabled' : ''}`}
                      disabled={!isValid}
                      onClick={() => {
                        if (isValid) {
                          openEstimatedModal(dateObj);
                          handleCloseWeekModal();
                        }
                      }}
                    >
                      {['일', '월', '화', '수', '목', '금', '토'][dayIndex]} 
                    </button>
                    {isValid && (
                      <div className="week-day-amount">{(estimatedAmount || 0).toLocaleString()}원</div>
                    )}
                  </div>
                );
              })}
            </div>
            {(() => {
              let weekEstimatedTotal = 0;
              let weekActualTotal = 0;
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const weekStartDate = 1 + selectedWeek * 7 - firstDayOfMonth;
                const date = weekStartDate + dayIndex;
                const dateObj = new Date(year, month, date);
                const dateKey = dateObj.toDateString();
                const isValid = date >= 1 && date <= new Date(year, month + 1, 0).getDate();
                if (isValid) {
                  const dayEstimated = estimatedExpenses[dateKey] || {};
                  const estimatedAmount = Object.values(dayEstimated).reduce((a,b) => a + parseFloat(b || 0), 0);
                  const actualAmount = actualExpenses[dateKey] || 0;
                  weekEstimatedTotal += estimatedAmount;
                  weekActualTotal += actualAmount;
                }
              }
              return (
                <div className="week-summary">
                  <div className="week-summary-item">
                    <span>소비 예상 금액 총합</span>
                    <span className="week-summary-amount">{weekEstimatedTotal.toLocaleString()}원</span>
                  </div>
                  <div className="week-summary-item">
                    <span>소비 금액 총합</span>
                    <span className="week-summary-amount">{weekActualTotal.toLocaleString()}원</span>
                  </div>
                </div>
              );
            })()}
            <div className="modal-buttons modal-buttons-right">
              <button onClick={handleCloseWeekModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;