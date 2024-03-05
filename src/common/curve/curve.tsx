import React, { useEffect, useRef, useMemo, useState } from 'react'
import * as echarts from 'echarts/core'
import {
	TitleComponent,
	TitleComponentOption,
	TooltipComponent,
	TooltipComponentOption,
	GridComponent,
	GraphicComponent,
	GridComponentOption,
	DataZoomComponent,
	DataZoomComponentOption,
	LegendComponent,
	ToolboxComponent,
} from 'echarts/components'
import { LineChart, LineSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsType } from 'echarts/core'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
import { Point, Vector2 } from './types'
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer,
	GraphicComponent,
	DataZoomComponent,
	LegendComponent,
	ToolboxComponent,
])
type EChartsOption = echarts.ComposeOption<
	| TitleComponentOption
	| TooltipComponentOption
	| DataZoomComponentOption
	| GridComponentOption
	| LineSeriesOption
>

interface CurveProps {
	data: Vector2[]
	symbolSize?: number
	title?: string
}
//console.log()

global['test1'] = () => {
	EditorEventMgr.Instance.emitEvent('ResetMaxAndMin', (cb) => cb(50, -50))
}
global['test2'] = () => {
	EditorEventMgr.Instance.addEventListener('DispatchNodeChange', (e) => {
		//console.log(e)
	})
}
global['test3'] = () => {
	EditorEventMgr.Instance.emitEvent('ReRenderCurve', (cb) =>
		cb([
			{ x: -50, y: 0.2 },
			{ x: -30, y: 0.4 },
			{ x: -60, y: 0.6 },
		]),
	)
}
const Curve: React.FC<CurveProps> = ({ data: data1, symbolSize = 10, title }) => {
	// 容器
	let data = []
	data1.forEach((item) => {
		data.push([item.x, item.y])
	})
	const container = useRef<HTMLDivElement>(null!)
	// Echarts实例
	const myChart = useRef<EChartsType>(null!)
	// tooltip内的按钮
	const buttonRef = useRef<HTMLButtonElement>(null!)
	// 用于生成新节点
	const zr = useRef<any>(null!)
	// 用于分辨是删除节点还是其他原因引起的reRenderECharts
	const isDelete = useRef<boolean>(false)

	const tooltipIsShow = useRef<boolean>(false)

	const option: EChartsOption = useMemo(() => {
		return {
			// 关闭动画
			animation: false,
			// 标题
			// title: {
			// 	text: title,
			// },
			// 提示框
			tooltip: {
				triggerOn: 'none',
				enterable: true,
				appendToBody: true,
				formatter: (params: any) => {
					let result = `
                    X:${params.data[0].toFixed(2)}<br>Y:${params.data[1].toFixed(
						2,
					)}<br><button id="m4m644-delete-button" ref={buttonRef}>click</button>
                    `
					return result
				},
			},
			// 网格
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				top: '3%',
				containLabel: true,
			},
			xAxis: {
				// 控制x坐标最小值
				min: function (value) {
					let min = 0
					data.forEach((item) => {
						min = Math.min(item[0], min)
					})
					return min
				},
				// 控制x坐标最大值
				max: function (value) {
					let max = 0
					data.forEach((item) => {
						max = Math.max(item[0], max)
					})
					return max
				},
				type: 'value',
				// alignTicks:true,
				// // axisLine: { onZero: false },
				// splitNumber: 10,
				data: data.map((item: number[]) => {
					return item[0]
				}),
			},
			yAxis: {
				min: -1,
				max: 1,
				type: 'value',
				// axisLine: { onZero: false },
				splitNumber: 10,
			},
			series: [
				{
					id: 'a',
					type: 'line',
					smooth: true,
					symbolSize: symbolSize,
					data,
					cursor: 'pointer',
				},
			],
		}
	}, [data, symbolSize])

	const dispatchNodeChange = (pos: Vector2[]) => {
		EditorEventMgr.Instance.emitEvent('DispatchNodeChange', (cb) => cb(pos))
	}

	// 添加新节点
	const addPoints = () => {
		zr.current.on('dblclick', (params: any) => {
			// 获取点击位置的像素坐标
			let pointInPixel = [params.offsetX, params.offsetY]
			// 将像素坐标转为网格坐标
			let pointInGrid = myChart.current.convertFromPixel('grid', pointInPixel)
			// 此if下为点击空白时触发的逻辑，如果需要点击元素触发则写在else中
			if (!params.target) {
				data.push(pointInGrid)
				data.sort((a, b) => {
					return a[0] - b[0]
				})
				reRenderEcharts()
				let res: Vector2[] = []
				data.forEach((item) => {
					res.push({ x: item[0], y: item[1] })
				})
				dispatchNodeChange(res)
				// console.log('添加新点')
			} else {
				//console.log(2)
			}
			addDraggingPoint()
		})
	}

	// 添加隐藏点用于控制拖拽与其他事件
	const addDraggingPoint = () => {
		console.log(data.length)
		myChart.current.setOption({
			graphic: data.map((item, dataIndex) => {
				if (dataIndex > 0 && dataIndex < data.length - 1) {
					return {
						id: 'g' + dataIndex,
						type: 'circle',
						position: myChart.current.convertToPixel('grid', item),
						// $action:'replace',
						shape: {
							cx: 0,
							cy: 0,
							r: symbolSize / 2,
						},
						style: {
							fill: 'red',
						},
						invisible: false,
						draggable: true,
						ondrag: function () {
							draggingPointHandler(dataIndex, [(this as any).x, (this as any).y])
							console.log(1111111111111111)
							// a.run(dataIndex, [(this as any).x, (this as any).y])
						},
						onclick: () => {
							showTooltipHandler(dataIndex)
							buttonRef.current = document.querySelector(
								'#m4m644-delete-button',
							) as HTMLButtonElement
							buttonRef.current.disabled = false
							buttonRef.current.addEventListener('click', () => {
								deletePointHandler(dataIndex)
								buttonRef.current.disabled = true
							})
						},
						onmouseout: () => {
							hideTooltipHandler()
						},
						z: 100,
					}
				}
			}),
		})
	}
	// 移除graphic节点
	const removeGraphicPoint = () => {
		myChart.current.setOption({
			graphic: data.map((item, dataIndex) => {
				if (dataIndex > 0 && dataIndex < data.length - 1)
					return {
						type: 'circle',
						$action: 'remove',
					}
				if (isDelete.current) {
					if (dataIndex > 0 && dataIndex < data.length)
						return {
							type: 'circle',
							$action: 'remove',
						}
				} else {
					if (dataIndex > 0 && dataIndex < data.length - 1)
						return {
							type: 'circle',
							$action: 'remove',
						}
				}
			}),
		})
	}

	// 拖拽事件处理函数 拖拽的节流会引起卡顿错位，若要进行节流在发送信息的时候节流
	const draggingPointHandler = (dataIndex: number, pos: number[]) => {
		data[dataIndex] = myChart.current.convertFromPixel('grid', pos)
		if (dataIndex !== 0 && data[dataIndex][0] < data[dataIndex - 1][0]) {
			data[dataIndex][0] = data[dataIndex - 1][0]
		}
		if (dataIndex !== data.length - 1 && data[dataIndex][0] > data[dataIndex + 1][0]) {
			data[dataIndex][0] = data[dataIndex + 1][0]
		}
		// 上下边界控制
		if (data[dataIndex][1] > 1) {
			data[dataIndex][1] = 1
		}
		if (data[dataIndex][1] < -1) {
			data[dataIndex][1] = -1
		}
		reRenderEcharts()
		addDraggingPoint()
		let res = []
		data.forEach((item) => {
			res.push({ x: item[0], y: item[1] })
		})
		dispatchNodeChange(res)
		// console.log('正在拖拽')
		// dispatchNodeChange(data[dataIndex])
	}
	// 显示tooltip
	const showTooltipHandler = (dataIndex: number) => {
		tooltipIsShow.current = true
		myChart.current.dispatchAction({
			type: 'showTip',
			seriesIndex: 0,
			dataIndex,
		})
	}
	// 隐藏tooltip
	const hideTooltipHandler = () => {
		tooltipIsShow.current = false
		myChart.current.dispatchAction({
			type: 'hideTip',
		})
	}
	// 删除节点
	const deletePointHandler = (dataIndex: number) => {
		dispatchNodeChange(data[dataIndex])
		isDelete.current = true
		data.splice(dataIndex, 1)
		removeGraphicPoint()
		addDraggingPoint()
		reRenderEcharts()
		//console.log('删除节点')
	}

	// 数据更改后Echarts重新渲染
	const reRenderEcharts = () => {
		myChart.current.setOption({
			series: [
				{
					id: 'a',
					data,
				},
			],
		})
		// myChart.current
	}

	// 此副作用用于初始化Echarts
	useEffect(() => {
		// 初始化Echarts
		myChart.current = echarts.init(container.current)
		option && myChart.current.setOption(option)
		addDraggingPoint()

		window.addEventListener('resize', () => {
			myChart.current.resize()
			removeGraphicPoint()
			addDraggingPoint()
		})

		return () => {
			// 卸载Echarts
			myChart.current.dispose()
		}
	}, [option])

	//次副作用用于绑定空白点击
	useEffect(() => {
		zr.current = myChart.current.getZr()
		addPoints()
	}, [])
	const clickCount = useRef<number>(0)
	const timer = useRef<NodeJS.Timeout>(null!)

	// 次副作用用于解决移动端双击无效，若还有其他移动端不兼容可一并写入
	useEffect(() => {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			)
		) {
			myChart.current.getZr().on('click', (params: any) => {
				clickCount.current++
				// 模拟双击
				if (clickCount.current === 2) {
					// console.log('db')
					let pointInPixel = [params.offsetX, params.offsetY]
					// 将像素坐标转为网格坐标
					let pointInGrid = myChart.current.convertFromPixel('grid', pointInPixel)
					// 此if下为点击空白时触发的逻辑，如果需要点击元素触发则写在else中
					if (!params.target) {
						data.push(pointInGrid)
						data.sort((a, b) => {
							return a[0] - b[0]
						})
						reRenderEcharts()
					} else {
						//console.log(2)
					}
					addDraggingPoint()
					clickCount.current = 0
				}
				// 单击补偿
				timer.current = setTimeout(() => {
					if (clickCount.current === 1) {
						clickCount.current = 0
					}
				}, 300)
			})
			return () => {
				clearTimeout(timer.current)
			}
		}
	}, [])

	// 此副作用用于处理事件对接
	useEffect(() => {
		// let binder=EditorEventMgr.Instance.addEventListener('OnRefreshCurveData',()=>{

		// })
		let binder1 = EditorEventMgr.Instance.addEventListener('ReRenderCurve', (data1) => {
			data1.forEach((item) => {
				data.push([item.x, item.y])
				data.sort((a, b) => {
					return a[0] - b[0]
				})
			})

			// removeGraphicPoint()
			reRenderEcharts()
			addDraggingPoint()
		})
		let binder2 = EditorEventMgr.Instance.addEventListener(
			'ResetMaxAndMin',
			(max: number, min: number) => {
				// removeGraphicPoint()
				myChart.current.setOption({
					xAxis: {
						max,
						min,
					},
				})
				reRenderEcharts()
				addDraggingPoint()
			},
		)

		return () => {
			binder1.removeListener()
			binder2.removeListener()
		}
	}, [])

	return <div ref={container} style={{ width: '100%', height: '100%' }}></div>
}
export default Curve
