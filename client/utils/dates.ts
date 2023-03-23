import moment from "moment";

export const formatEventDate = (date: string | number): string =>
  moment(+date).format("ddd, MMM DD [AT] HH:mm").toLocaleUpperCase();

export const formatDate = (date: string | number): string =>
  moment(+date).format("DD/MM/yyyy [at] HH:mm");

export const fromNow = (date: string | number): string =>
  moment(+date).fromNow();

export const daysDiff = (from: string | number, to: string | number): number =>
  moment(+to).diff(moment(+from), "days");
