import { useState } from 'react';

export type Division = 'LMU' | 'CDS' | 'FULU' | 'EMS' | 'PLANNING' | 'ADMIN';

export interface Ticket {
  number: number;
  division: Division;
  status: 'waiting' | 'serving' | 'done';
}

export const divisions: Division[] = [
  'LMU',
  'CDS',
  'FULU',
  'EMS',
  'PLANNING',
  'ADMIN',
];

export const useQueue = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [counter, setCounter] = useState(1);

  const addTicket = (division: Division) => {
    setTickets((prev) => [
      ...prev,
      { number: counter, division, status: 'waiting' },
    ]);
    setCounter((prev) => (prev >= 20 ? 1 : prev + 1));
  };

  const callNext = (division: Division) => {
    setTickets((prev) => {
      const waiting = prev.find(
        (t) => t.division === division && t.status === 'waiting'
      );
      if (!waiting) return prev;

      return prev.map((t) =>
        t.number === waiting.number ? { ...t, status: 'serving' } : t
      );
    });
  };

  const completeTicket = (number: number) => {
    setTickets((prev) =>
      prev.map((t) => (t.number === number ? { ...t, status: 'done' } : t))
    );
  };

  return { tickets, addTicket, callNext, completeTicket };
};
