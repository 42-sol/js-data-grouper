export const testEmployees = [
  { id: 1, parent_id: null, name: 'Isabel', job_start: '2020-01-01', company: 'Instagram' },
  { id: 2, parent_id: 1, name: 'John', job_start: '2020-01-01', company: 'Instagram' },
  { id: 3, parent_id: 2, name: 'Bill', job_start: '2020-02-01', company: 'Meta' },
  { id: 4, parent_id: null, name: 'Paula', job_start: '2020-03-01', company: 'IBM' },
];

export const testCompanies = [
  { id: 1, parent_id: null, name: 'Meta' },
  { id: 2, parent_id: 1, name: 'Instagram' },
  { id: 3, parent_id: null, name: 'IBM' },
  { id: 4, parent_id: null, name: 'IBM' },
];

/**
 *  Meta
 *    Instagram
 *      Isabel
 *        John
 *          Bill
 */
