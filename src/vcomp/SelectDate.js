import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";

const DatePickerContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 150px;
  font-size: 16px;
  cursor: pointer;
`;

const CalendarIcon = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  &:after {
    content: "📅";
    font-size: 20px;
  }
`;

const CalendarDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  color: #000000;
`;

const SelectDate = ({ onChange, isCalendarOpen, setIsCalendarOpen }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date);
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const formatDate = (date) => {
    const options = { month: "2-digit", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <DatePickerContainer>
      <DateInput
        type="text"
        value={formatDate(selectedDate)}
        onClick={toggleCalendar}
        readOnly
      />
      <CalendarIcon onClick={toggleCalendar} />
      {isCalendarOpen && (
        <CalendarDropdown>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </CalendarDropdown>
      )}
    </DatePickerContainer>
  );
};

export default SelectDate;