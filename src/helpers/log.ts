export const log = (msg: any, ...values: any[]): void => {
  /* eslint no-console: 0 */
  console.info(
    `%c  DEFAULT-DASHBOARD \n%c  ${msg}   `,
    'color: orange; font-weight: bold; background: black',
    'font-weight: bold;',
    ...values,
  );
};
