export interface PrevineIndicator {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface PrevineKPI {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
}

export interface PrevineChartData {
  labels: string[];
  datasets: ChartDataset[];
}