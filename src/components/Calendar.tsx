import React from 'react';
import { dayJs } from '../utils';

interface CalendarProps {
  weekData: Array<{ date: string; morning: string | null; night: string | null }>;
}

export const Calendar: React.FC<CalendarProps> = ({ weekData }) => {
  const today = dayJs();
  const startOfWeek = today.startOf('week');

  const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const dayData = weekData.find((d) => d.date === day.format('YYYY-MM-DD'));
        return (
          <div key={day.format('YYYY-MM-DD')} className="border p-2 text-center">
            <div>{day.format('DD')}</div>
            <div>{dayData?.morning ? '早' : '-'}</div>
            <div>{dayData?.night ? '晚' : '-'}</div>
          </div>
        );
      })}
    </div>
  );
};
