import { create } from 'zustand';

export const useLockerStore = create(set => ({
  points: 0,
  hydration: 0,
  triviaScore: 0,
  jerseyOpened: false,
  scheduleViewed: false,
  allComplete: false,
  // Actions
  addPoints: (amount) => set(state => ({ points: state.points + amount })),
  setHydration: (level) => set({ hydration: level }),
  setTriviaScore: (score) => set({ triviaScore: score }),
  setJerseyOpened: () => set({ jerseyOpened: true }),
  setScheduleViewed: () => set({ scheduleViewed: true }),
  checkAllComplete: () => set(state => ({
    allComplete: state.hydration > 0 && state.triviaScore > 0 && state.jerseyOpened && state.scheduleViewed
  })),
})); 