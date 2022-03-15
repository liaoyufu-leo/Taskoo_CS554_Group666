import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { GraphicComponent, GraphicComponentOption } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Box, SxProps } from '@mui/material';

interface ChartProps {
	option: Option;
	height?: string;
	width?: string;
	sx?: SxProps;
}
export type Option = echarts.ComposeOption<GraphicComponentOption>;

const Chart: React.FC<ChartProps> = ({ option, sx, height = '100%', width = '100%' }) => {
	const chartRef = useRef<HTMLDivElement>(null);

	let chart: echarts.ECharts;
	useEffect(() => {
		if (!chart) {
			chart = echarts.init(chartRef.current!);
			chartRef.current?.addEventListener('resize', resize);
		}
		chart.setOption(option);

		return () => {
			chartRef.current?.removeEventListener('resize', resize);
			echarts.dispose(chart);
		};
	}, [option]);

	const resize = () => chart?.resize;

	return <Box sx={{ ...sx, width, height }} ref={chartRef}></Box>;
};

echarts.use([GraphicComponent, CanvasRenderer]);

export default Chart;
