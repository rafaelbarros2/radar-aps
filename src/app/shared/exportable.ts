export interface Exportable {
  getExportData(): { headers: string[]; rows: (string | number)[][]; filename?: string };
  getViewState?(): any;
}

