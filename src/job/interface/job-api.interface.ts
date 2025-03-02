export interface JobApiAdapter {
  fetchJobs(): Promise<any[]>;
}
