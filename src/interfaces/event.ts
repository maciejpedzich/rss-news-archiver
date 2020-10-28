export default interface CalendarEvent {
  name: string;
  color: string;
  start: Date;
  end?: Date;
  timed: boolean;
}
