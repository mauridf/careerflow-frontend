'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import { useDashboardViewsChart } from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';

interface ViewsChartProps {
  days?: number;
}

export function ViewsChart({ days = 30 }: ViewsChartProps) {
  const { data, isLoading } = useDashboardViewsChart(days);

  if (isLoading) return <LoadingState message="Carregando gráfico..." size="sm" />;

  const chartData = data?.data?.dataPoints || [];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[240px] text-secondary font-sans text-body-sm">
        Nenhum dado de visualização disponível.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: '#777587' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#777587' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #c7c4d8',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
        />
        <Bar
          dataKey="views"
          name="Visualizações"
          fill="#4f46e5"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
        <Bar
          dataKey="downloads"
          name="Downloads"
          fill="#6ee7b7"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
