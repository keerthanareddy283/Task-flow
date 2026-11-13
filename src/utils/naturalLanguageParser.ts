import { Priority } from '../types';

export interface ParsedTaskInput {
  cleanTitle: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string;
  tags: string[];
}

/**
 * Format date into YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const SHORT_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

export function parseNaturalLanguage(rawInput: string): ParsedTaskInput {
  let text = rawInput.trim();
  let priority: Priority = 'none';
  let dueDate: string | undefined;
  const tags: string[] = [];

  if (!text) {
    return { cleanTitle: '', priority, tags };
  }

  // 1. Extract priority (!high, !medium, !low, !urgent, etc.)
  const priorityRegex = /(?:^|\s)!([a-zA-Z0-9]+)\b/i;
  const priorityMatch = text.match(priorityRegex);
  if (priorityMatch) {
    const pTag = priorityMatch[1].toLowerCase();
    if (['high', 'h', 'urgent', 'p1'].includes(pTag)) {
      priority = 'high';
    } else if (['medium', 'med', 'm', 'p2'].includes(pTag)) {
      priority = 'medium';
    } else if (['low', 'l', 'p3'].includes(pTag)) {
      priority = 'low';
    }
    text = text.replace(priorityRegex, ' ');
  }

  // 2. Extract tags (#work, #errands, etc.)
  const tagRegex = /(?:^|\s)#([a-zA-Z0-9_-]+)/g;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(text)) !== null) {
    const cleanTag = tagMatch[1].toLowerCase();
    if (!tags.includes(cleanTag)) {
      tags.push(cleanTag);
    }
  }
  text = text.replace(tagRegex, ' ');

  // 3. Extract dates & relative date terms
  const today = new Date();

  // Pattern: "in X days"
  const inDaysRegex = /\b(?:in\s+)?(\d+)\s*days?\b/i;
  const inDaysMatch = text.match(inDaysRegex);
  if (inDaysMatch) {
    const daysToAdd = parseInt(inDaysMatch[1], 10);
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    dueDate = formatDateISO(targetDate);
    text = text.replace(inDaysRegex, ' ');
  }

  // Pattern: "today" / "tonight"
  if (!dueDate) {
    const todayRegex = /\b(today|tonight)\b/i;
    if (todayRegex.test(text)) {
      dueDate = formatDateISO(today);
      text = text.replace(todayRegex, ' ');
    }
  }

  // Pattern: "tomorrow" / "tmrw"
  if (!dueDate) {
    const tomorrowRegex = /\b(tomorrow|tmrw)\b/i;
    if (tomorrowRegex.test(text)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = formatDateISO(tomorrow);
      text = text.replace(tomorrowRegex, ' ');
    }
  }

  // Pattern: "next (day)" or simply "(day)"
  if (!dueDate) {
    const dayRegex = /\b(?:on\s+)?(?:next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i;
    const dayMatch = text.match(dayRegex);
    if (dayMatch) {
      const matchedWord = dayMatch[1].toLowerCase();
      let targetDayIndex = DAY_NAMES.indexOf(matchedWord);
      if (targetDayIndex === -1) {
        targetDayIndex = SHORT_DAYS.indexOf(matchedWord);
      }
      if (targetDayIndex !== -1) {
        const currentDayIndex = today.getDay();
        let daysAhead = targetDayIndex - currentDayIndex;
        if (daysAhead <= 0) {
          daysAhead += 7;
        }
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + daysAhead);
        dueDate = formatDateISO(targetDate);
        text = text.replace(dayRegex, ' ');
      }
    }
  }

  // Pattern: "Jan 15", "January 15th", "15 Jan"
  if (!dueDate) {
    const monthDayRegex = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/i;
    const mdMatch = text.match(monthDayRegex);
    if (mdMatch) {
      const monthKey = mdMatch[1].toLowerCase();
      const dayNum = parseInt(mdMatch[2], 10);
      const monthIndex = MONTHS[monthKey];
      if (monthIndex !== undefined && dayNum >= 1 && dayNum <= 31) {
        const year = today.getFullYear();
        const targetDate = new Date(year, monthIndex, dayNum);
        // If date has passed this year, maybe next year?
        if (targetDate.getTime() < today.setHours(0, 0, 0, 0) - 86400000) {
          targetDate.setFullYear(year + 1);
        }
        dueDate = formatDateISO(targetDate);
        text = text.replace(monthDayRegex, ' ');
      }
    }
  }

  // Clean trailing/double spaces and unnecessary words like "on", "at", "due"
  const cleanTitle = text
    .replace(/\s+/g, ' ')
    .replace(/\b(due|on)\s*$/i, '')
    .trim();

  return {
    cleanTitle,
    priority,
    dueDate,
    tags,
  };
}
