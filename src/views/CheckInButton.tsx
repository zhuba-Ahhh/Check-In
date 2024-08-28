import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  getLocalStorage,
  setLocalStorage,
  dayJs,
  newDate,
  secondsToHMS,
  GetThisWeekTime,
} from '../utils';
import { CheckInType, dayData, CheckInButtonProps } from '../types';
import { copyToClipboard } from 'zhuba-tools';
import { ErrorBoundary } from '../components/ErrorBoundary';
// import { Calendar } from '../components/Calendar';

const STORAGE_KEYS = {
  MORNING: 'morning',
  NIGHT: 'night',
  WEEK_DATA: 'weekData',
};

const DATE_FORMAT = 'MM-DD HH-mm';

const initialState = {
  type: 'morning' as CheckInType,
  morning: null as string | null,
  night: null as string | null,
  weekData: [] as Array<dayData>,
  duration: null as string | null,
};

type Action =
  | { type: 'SET_TYPE'; payload: CheckInType }
  | { type: 'SET_MORNING'; payload: string | null }
  | { type: 'SET_NIGHT'; payload: string | null }
  | { type: 'SET_WEEK_DATA'; payload: Array<dayData> }
  | { type: 'SET_DURATION'; payload: string | null };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_MORNING':
      return { ...state, morning: action.payload };
    case 'SET_NIGHT':
      return { ...state, night: action.payload };
    case 'SET_WEEK_DATA':
      return { ...state, weekData: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    default:
      return state;
  }
};

const useWeekData = (setExportData: React.Dispatch<React.SetStateAction<object>>) => {
  const getWeekData = useCallback((): Array<dayData> => {
    const weekData = getLocalStorage(STORAGE_KEYS.WEEK_DATA);
    try {
      if (weekData) {
        const weekDataObject = JSON.parse(weekData);
        setExportData?.(weekDataObject);
        return weekDataObject;
      }
    } catch (error) {
      console.error('Error parsing week data:', error);
    }
    return [];
  }, [setExportData]);

  return { getWeekData };
};

export const CheckInButton = ({ addToast, openModal, setExportData }: CheckInButtonProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getWeekData } = useWeekData(setExportData);

  const updateWeekData = useCallback(
    (now: Date) => {
      const stringNow = String(now);
      const dateKey = dayJs(now).format('YYYY-MM-DD');
      dispatch({
        type: 'SET_WEEK_DATA',
        payload: state.weekData.map((item) => {
          if (item.date === dateKey) {
            return { ...item, [state.type]: stringNow };
          }
          return item;
        }),
      });
      setLocalStorage(STORAGE_KEYS.WEEK_DATA, JSON.stringify(state.weekData));
    },
    [state.type, state.weekData]
  );

  const handleCheckIn = useCallback(() => {
    const now = newDate();
    setLocalStorage(state.type, String(now));
    if (state.type === 'morning') {
      dispatch({ type: 'SET_MORNING', payload: dayJs(now).format(DATE_FORMAT) });
      dispatch({ type: 'SET_TYPE', payload: 'night' });
    } else {
      dispatch({ type: 'SET_NIGHT', payload: dayJs(now).format(DATE_FORMAT) });
    }
    updateWeekData(now);
  }, [state.type, updateWeekData]);

  useEffect(() => {
    const morningDate = getLocalStorage(STORAGE_KEYS.MORNING);
    const nightDate = getLocalStorage(STORAGE_KEYS.NIGHT);
    const weekData = getWeekData();
    if (weekData.length > 0) {
      dispatch({ type: 'SET_WEEK_DATA', payload: weekData });
    }

    if (morningDate) {
      const dayJSmorningDate = dayJs(morningDate);
      if (dayJSmorningDate.format('dd') === dayJs().format('dd')) {
        dispatch({ type: 'SET_TYPE', payload: 'night' });
      }
      dispatch({ type: 'SET_MORNING', payload: dayJSmorningDate.format(DATE_FORMAT) });
    }

    nightDate && dispatch({ type: 'SET_NIGHT', payload: dayJs(nightDate).format(DATE_FORMAT) });
  }, [getWeekData]);

  const { weeklyDuration, residualDuration } = useMemo(() => {
    let totalSeconds = 0;
    const currentWeek = dayJs().week();
    state.weekData.forEach((data) => {
      const { date, morning, night } = data;
      if (morning && night && dayJs(date).week() === currentWeek) {
        const diffSeconds = dayJs(night).diff(dayJs(morning), 'second');
        if (diffSeconds > 0) totalSeconds += diffSeconds;
      }
    });

    if (totalSeconds > 0) {
      const weeklyDuration = secondsToHMS(totalSeconds);
      const residualSeconds = GetThisWeekTime() - totalSeconds;
      const residualDuration = secondsToHMS(Math.max(residualSeconds, 0));
      return { weeklyDuration, residualDuration };
    }
    return { weeklyDuration: null, residualDuration: null };
  }, [state.weekData]);

  useEffect(() => {
    let timerId: number | undefined = void 0;
    if (state.morning && state.night) {
      const morningTime = dayJs(getLocalStorage(STORAGE_KEYS.MORNING));
      const updateDuration = () => {
        const now = newDate();
        const currentTime = dayJs(now);
        const diffSeconds = currentTime.diff(morningTime, 'second');
        dispatch({ type: 'SET_DURATION', payload: secondsToHMS(diffSeconds) });
        setLocalStorage(STORAGE_KEYS.NIGHT, String(now));
        updateWeekData(now);
      };

      updateDuration();
      timerId = setInterval(updateDuration, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [state.morning, state.night, updateWeekData]);

  const exportData = useCallback(() => {
    const weekData = getWeekData();
    copyToClipboard(JSON.stringify(weekData));
    addToast({ text: '复制成功' });
  }, [getWeekData, addToast]);

  const importData = useCallback(() => {
    const weekData = getWeekData();
    setExportData(weekData);
    openModal();
  }, [getWeekData, openModal, setExportData]);

  return (
    <ErrorBoundary>
      <div>
        <button
          className={state.type === 'morning' ? 'btn mr-6 btn-outline' : 'btn mr-6 btn-accent'}
          onClick={handleCheckIn}
        >
          <h2 className="text-lg font-bold">
            {state.type === 'morning' ? '早上打卡' : '晚上打卡'}
          </h2>
        </button>
        <button className="mr-6 btn btn-outline btn-info" onClick={exportData}>
          <h2 className="text-lg font-bold">导出数据</h2>
        </button>
        <button className="btn btn-outline btn-secondary" onClick={importData}>
          <h2 className="text-lg font-bold">导入数据</h2>
        </button>
      </div>
      <div className="card w-90 shadow-xl bg-teal-100 mt-6">
        <div className="card-body p-6">
          <h2 className="text-lg font-semibold">上次早上打卡时间: {state.morning}</h2>
          <h2 className="text-lg font-semibold">上次晚上打卡时间: {state.night}</h2>
          <h2 className="text-lg font-semibold">今天已经工作时长: {state.duration}</h2>
          <h2 className="text-lg font-semibold">本周已经工作时长: {weeklyDuration}</h2>
          <h2 className="text-lg font-semibold">本周剩余工作时长: {residualDuration}</h2>
        </div>
      </div>
      {/* <Calendar weekData={state.weekData} /> */}
    </ErrorBoundary>
  );
};
