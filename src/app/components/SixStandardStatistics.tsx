import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ArrowLeft, Loader2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';

// ===== Mock 数据 =====

// 各地市六到位统计数据（参考 PC端格式）
const citySixData = [
  {
    name: '杭州市', adcode: '330100',
    oppCount: 68, convertedCount: 52,
    客情掌握: { count: 48, rate: 70.59 },
    方案总控: { count: 45, rate: 66.18 },
    谈判应标自主: { count: 42, rate: 61.76 },
    采购自主: { count: 38, rate: 55.88 },
    项目强管控: { count: 35, rate: 51.47 },
    运维自主: { count: 28, rate: 41.18 },
  },
  {
    name: '宁波市', adcode: '330200',
    oppCount: 52, convertedCount: 41,
    客情掌握: { count: 39, rate: 75.00 },
    方案总控: { count: 38, rate: 73.08 },
    谈判应标自主: { count: 36, rate: 69.23 },
    采购自主: { count: 32, rate: 61.54 },
    项目强管控: { count: 29, rate: 55.77 },
    运维自主: { count: 22, rate: 42.31 },
  },
  {
    name: '温州市', adcode: '330300',
    oppCount: 38, convertedCount: 28,
    客情掌握: { count: 26, rate: 68.42 },
    方案总控: { count: 24, rate: 63.16 },
    谈判应标自主: { count: 23, rate: 60.53 },
    采购自主: { count: 20, rate: 52.63 },
    项目强管控: { count: 18, rate: 47.37 },
    运维自主: { count: 14, rate: 36.84 },
  },
  {
    name: '嘉兴市', adcode: '330400',
    oppCount: 29, convertedCount: 22,
    客情掌握: { count: 21, rate: 72.41 },
    方案总控: { count: 19, rate: 65.52 },
    谈判应标自主: { count: 18, rate: 62.07 },
    采购自主: { count: 16, rate: 55.17 },
    项目强管控: { count: 14, rate: 48.28 },
    运维自主: { count: 11, rate: 37.93 },
  },
  {
    name: '湖州市', adcode: '330500',
    oppCount: 22, convertedCount: 18,
    客情掌握: { count: 16, rate: 72.73 },
    方案总控: { count: 15, rate: 68.18 },
    谈判应标自主: { count: 14, rate: 63.64 },
    采购自主: { count: 12, rate: 54.55 },
    项目强管控: { count: 10, rate: 45.45 },
    运维自主: { count: 8, rate: 36.36 },
  },
  {
    name: '绍兴市', adcode: '330600',
    oppCount: 18, convertedCount: 15,
    客情掌握: { count: 14, rate: 77.78 },
    方案总控: { count: 13, rate: 72.22 },
    谈判应标自主: { count: 12, rate: 66.67 },
    采购自主: { count: 10, rate: 55.56 },
    项目强管控: { count: 9, rate: 50.00 },
    运维自主: { count: 6, rate: 33.33 },
  },
  {
    name: '金华市', adcode: '330700',
    oppCount: 14, convertedCount: 11,
    客情掌握: { count: 10, rate: 71.43 },
    方案总控: { count: 9, rate: 64.29 },
    谈判应标自主: { count: 9, rate: 64.29 },
    采购自主: { count: 8, rate: 57.14 },
    项目强管控: { count: 7, rate: 50.00 },
    运维自主: { count: 5, rate: 35.71 },
  },
  {
    name: '衢州市', adcode: '330800',
    oppCount: 8, convertedCount: 6,
    客情掌握: { count: 5, rate: 62.50 },
    方案总控: { count: 5, rate: 62.50 },
    谈判应标自主: { count: 5, rate: 62.50 },
    采购自主: { count: 4, rate: 50.00 },
    项目强管控: { count: 4, rate: 50.00 },
    运维自主: { count: 3, rate: 37.50 },
  },
  {
    name: '舟山市', adcode: '330900',
    oppCount: 4, convertedCount: 3,
    客情掌握: { count: 2, rate: 50.00 },
    方案总控: { count: 2, rate: 50.00 },
    谈判应标自主: { count: 2, rate: 50.00 },
    采购自主: { count: 2, rate: 50.00 },
    项目强管控: { count: 2, rate: 50.00 },
    运维自主: { count: 1, rate: 25.00 },
  },
  {
    name: '台州市', adcode: '331000',
    oppCount: 2, convertedCount: 1,
    客情掌握: { count: 1, rate: 50.00 },
    方案总控: { count: 1, rate: 50.00 },
    谈判应标自主: { count: 1, rate: 50.00 },
    采购自主: { count: 1, rate: 50.00 },
    项目强管控: { count: 1, rate: 50.00 },
    运维自主: { count: 0, rate: 0.00 },
  },
  {
    name: '丽水市', adcode: '331100',
    oppCount: 1, convertedCount: 1,
    客情掌握: { count: 1, rate: 100.00 },
    方案总控: { count: 1, rate: 100.00 },
    谈判应标自主: { count: 1, rate: 100.00 },
    采购自主: { count: 1, rate: 100.00 },
    项目强管控: { count: 1, rate: 100.00 },
    运维自主: { count: 0, rate: 0.00 },
  },
];

// 六个到位配置
const sixCategories = [
  { key: '客情掌握', bgClass: 'bg-blue-50', borderClass: 'border-blue-200', textClass: 'text-blue-600', barClass: 'bg-blue-500' },
  { key: '方案总控', bgClass: 'bg-green-50', borderClass: 'border-green-200', textClass: 'text-green-600', barClass: 'bg-green-500' },
  { key: '谈判应标自主', bgClass: 'bg-purple-50', borderClass: 'border-purple-200', textClass: 'text-purple-600', barClass: 'bg-purple-500' },
  { key: '采购自主', bgClass: 'bg-orange-50', borderClass: 'border-orange-200', textClass: 'text-orange-600', barClass: 'bg-orange-500' },
  { key: '项目强管控', bgClass: 'bg-red-50', borderClass: 'border-red-200', textClass: 'text-red-600', barClass: 'bg-red-500' },
  { key: '运维自主', bgClass: 'bg-cyan-50', borderClass: 'border-cyan-200', textClass: 'text-cyan-600', barClass: 'bg-cyan-500' },
];

// 整体汇总计算
function calcSummary(data: typeof citySixData) {
  const oppCount = data.reduce((s, d) => s + d.oppCount, 0);
  const convertedCount = data.reduce((s, d) => s + d.convertedCount, 0);
  const summary: Record<string, { count: number; rate: number }> = {};
  sixCategories.forEach((cat) => {
    const totalCount = data.reduce((s, d) => s + d[cat.key as keyof typeof d].count, 0);
    summary[cat.key] = {
      count: totalCount,
      rate: oppCount > 0 ? (totalCount / oppCount) * 100 : 0,
    };
  });
  return { oppCount, convertedCount, summary };
}

// 各地市汇总
function calcCitySummary(cityData: typeof citySixData[0]) {
  const oppCount = cityData.oppCount;
  const summary: Record<string, { count: number; rate: number }> = {};
  sixCategories.forEach((cat) => {
    summary[cat.key] = cityData[cat.key as keyof typeof cityData] as { count: number; rate: number };
  });
  return { oppCount, summary };
}

// 蓝色系配色（根据完成率深浅）
function getBlueColor(rate: number): string {
  if (rate >= 90) return '#1565C0';
  if (rate >= 80) return '#1976D2';
  if (rate >= 70) return '#1E88E5';
  if (rate >= 60) return '#2196F3';
  if (rate >= 50) return '#42A5F5';
  if (rate >= 40) return '#64B5F6';
  if (rate >= 30) return '#90CAF9';
  return '#BBDEFB';
}

// 各区县 Mock 数据（整体完成率）
const districtData: Record<string, { name: string; rate: number }[]> = {
  '330100': [
    { name: '上城区', rate: 92.1 }, { name: '下城区', rate: 88.5 }, { name: '拱墅区', rate: 85.0 },
    { name: '西湖区', rate: 90.3 }, { name: '滨江区', rate: 86.7 }, { name: '萧山区', rate: 82.4 },
    { name: '余杭区', rate: 79.8 }, { name: '临平区', rate: 75.2 }, { name: '钱塘区', rate: 71.6 },
    { name: '富阳区', rate: 68.9 }, { name: '临安区', rate: 65.3 }, { name: '桐庐县', rate: 62.7 },
    { name: '淳安县', rate: 58.1 },
  ],
  '330200': [
    { name: '海曙区', rate: 88.2 }, { name: '江北区', rate: 85.6 }, { name: '北仑区', rate: 82.1 },
    { name: '镇海区', rate: 79.4 }, { name: '鄞州区', rate: 91.3 }, { name: '奉化区', rate: 72.8 },
    { name: '余姚市', rate: 68.5 }, { name: '慈溪市', rate: 75.2 }, { name: '象山县', rate: 65.7 },
    { name: '宁海县', rate: 62.3 },
  ],
  '330300': [
    { name: '鹿城区', rate: 82.1 }, { name: '龙湾区', rate: 78.5 }, { name: '瓯海区', rate: 76.2 },
    { name: '洞头区', rate: 70.8 }, { name: '永嘉县', rate: 68.4 }, { name: '平阳县', rate: 65.9 },
    { name: '苍南县', rate: 62.3 }, { name: '文成县', rate: 58.7 }, { name: '泰顺县', rate: 55.2 },
    { name: '瑞安市', rate: 72.6 }, { name: '乐清市', rate: 69.8 },
  ],
  '330400': [
    { name: '南湖区', rate: 91.5 }, { name: '秀洲区', rate: 88.2 }, { name: '嘉善县', rate: 85.7 },
    { name: '海盐县', rate: 82.3 }, { name: '海宁市', rate: 79.6 }, { name: '平湖市', rate: 76.8 },
    { name: '桐乡市', rate: 73.4 },
  ],
  '330500': [
    { name: '吴兴区', rate: 72.1 }, { name: '南浔区', rate: 68.5 }, { name: '德清县', rate: 65.2 },
    { name: '长兴县', rate: 62.8 }, { name: '安吉县', rate: 58.4 },
  ],
  '330600': [
    { name: '越城区', rate: 82.4 }, { name: '柯桥区', rate: 79.7 }, { name: '上虞区', rate: 76.2 },
    { name: '新昌县', rate: 72.5 }, { name: '诸暨市', rate: 68.9 }, { name: '嵊州市', rate: 65.3 },
  ],
  '330700': [
    { name: '婺城区', rate: 87.2 }, { name: '金东区', rate: 84.5 }, { name: '武义县', rate: 81.3 },
    { name: '浦江县', rate: 78.6 }, { name: '磐安县', rate: 75.2 }, { name: '兰溪市', rate: 72.8 },
    { name: '义乌市', rate: 79.4 }, { name: '东阳市', rate: 76.1 }, { name: '永康市', rate: 73.5 },
  ],
  '330800': [
    { name: '柯城区', rate: 75.3 }, { name: '衢江区', rate: 72.1 }, { name: '常山县', rate: 68.6 },
    { name: '开化县', rate: 65.2 }, { name: '龙游县', rate: 61.8 }, { name: '江山市', rate: 58.4 },
  ],
  '330900': [
    { name: '定海区', rate: 68.2 }, { name: '普陀区', rate: 65.5 }, { name: '岱山县', rate: 62.1 },
    { name: '嵊泗县', rate: 58.7 },
  ],
  '331000': [
    { name: '椒江区', rate: 82.5 }, { name: '黄岩区', rate: 79.2 }, { name: '路桥区', rate: 76.8 },
    { name: '三门县', rate: 73.4 }, { name: '天台县', rate: 70.1 }, { name: '仙居县', rate: 67.5 },
    { name: '温岭市', rate: 74.2 }, { name: '临海市', rate: 71.8 }, { name: '玉环市', rate: 68.5 },
  ],
  '331100': [
    { name: '莲都区', rate: 65.2 }, { name: '青田县', rate: 62.8 }, { name: '缙云县', rate: 59.4 },
    { name: '遂昌县', rate: 56.1 }, { name: '松阳县', rate: 52.7 }, { name: '云和县', rate: 49.3 },
    { name: '庆元县', rate: 45.8 }, { name: '景宁畲族自治县', rate: 42.4 }, { name: '龙泉市', rate: 48.6 },
  ],
};

type ViewLevel = 'province' | 'city';

// 计算各地市整体完成率（用于地图着色）
function calcCityOverallRate(city: typeof citySixData[0]): number {
  const { summary } = calcCitySummary(city);
  const totalRate = Object.values(summary).reduce((s, v) => s + v.rate, 0);
  return totalRate / sixCategories.length;
}

export function SixStandardStatistics() {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('province');
  const [selectedCity, setSelectedCity] = useState<typeof citySixData[0] | null>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [districtGeoJson, setDistrictGeoJson] = useState<any>(null);

  const provinceSummary = calcSummary(citySixData);

  // 获取省级 GeoJSON
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        echarts.registerMap('zhejiang', data);
        setGeoJson(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') { setLoading(false); }
      });
    return () => controller.abort();
  }, []);

  // 获取区县 GeoJSON
  const loadDistrictMap = useCallback((cityAdcode: string) => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${cityAdcode}_full.json`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        echarts.registerMap(`city_${cityAdcode}`, data);
        setDistrictGeoJson({ adcode: cityAdcode, data });
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') { setLoading(false); }
      });
    return () => controller.abort();
  }, []);

  const handleCityClick = useCallback((params: any) => {
    const cityName = params.name?.replace(/市$/, '');
    const city = citySixData.find((c) => c.name.replace(/市$/, '') === cityName);
    if (city) {
      setSelectedCity(city);
      setViewLevel('city');
      loadDistrictMap(city.adcode);
    }
  }, [loadDistrictMap]);

  const handleBack = useCallback(() => {
    setViewLevel('province');
    setSelectedCity(null);
  }, []);

  // 地图 ECharts 配置
  const getOption = (): EChartsOption => {
    if (viewLevel === 'province' && geoJson) {
      const mapData = citySixData.map((city) => ({
        name: city.name,
        value: calcCityOverallRate(city),
      }));

      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.97)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: '#333', fontSize: 13 },
          formatter: (params: any) => {
            const city = citySixData.find((c) => c.name === params.name);
            if (!city) return params.name;
            const { summary } = calcCitySummary(city);
            const rows = sixCategories.map((cat) =>
              `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0">
                <span style="color:#666">${cat.key}：</span>
                <span style="color:#1976D2;font-weight:600">${summary[cat.key].count}个 / ${summary[cat.key].rate.toFixed(1)}%</span>
              </div>`
            ).join('');
            return `<div style="font-weight:600;margin-bottom:6px">${params.name}</div>
              <div style="margin-bottom:4px;color:#666">商机总数：<b style="color:#1976D2">${city.oppCount}</b>　已转化：<b style="color:#1976D2">${city.convertedCount}</b></div>
              ${rows}`;
          },
        },
        visualMap: {
          type: 'continuous',
          min: 30,
          max: 90,
          left: 12,
          bottom: 12,
          text: ['90%', '30%'],
          textStyle: { color: '#999', fontSize: 10 },
          inRange: {
            color: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0'],
          },
          calculable: false,
          itemWidth: 8,
          itemHeight: 50,
        },
        series: [
          {
            type: 'map',
            map: 'zhejiang',
            roam: true,
            zoom: 1.2,
            scaleLimit: { min: 1, max: 3 },
            emphasis: {
              itemStyle: { areaColor: '#0D47A1', shadowBlur: 12, shadowColor: 'rgba(13,71,161,0.4)' },
              label: { show: true, color: '#fff', fontSize: 11, fontWeight: 600 },
            },
            select: { disabled: true },
            itemStyle: { areaColor: '#E3F2FD', borderColor: '#fff', borderWidth: 1.5 },
            data: mapData,
          },
        ],
      };
    } else if (viewLevel === 'city' && districtGeoJson) {
      const districts = districtData[districtGeoJson.adcode] || [];
      const mapData = districts.map((d) => ({ name: d.name, value: d.rate }));

      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.97)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: '#333', fontSize: 13 },
          formatter: (params: any) => {
            const district = districts.find((d) => d.name === params.name);
            if (!district) return params.name;
            return `<div style="font-weight:600">${params.name}</div>
              <div style="color:#666;margin-top:4px">六到位完成率：<b style="color:${getBlueColor(district.rate)};font-size:15px">${district.rate}%</b></div>`;
          },
        },
        visualMap: {
          type: 'continuous',
          min: 30,
          max: 95,
          left: 12,
          bottom: 12,
          text: ['95%', '30%'],
          textStyle: { color: '#999', fontSize: 10 },
          inRange: {
            color: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0'],
          },
          calculable: false,
          itemWidth: 8,
          itemHeight: 50,
        },
        series: [
          {
            type: 'map',
            map: `city_${districtGeoJson.adcode}`,
            roam: true,
            zoom: 1.5,
            scaleLimit: { min: 1, max: 4 },
            emphasis: {
              itemStyle: { areaColor: '#0D47A1', shadowBlur: 12, shadowColor: 'rgba(13,71,161,0.4)' },
              label: { show: true, color: '#fff', fontSize: 11, fontWeight: 600 },
            },
            select: { disabled: true },
            itemStyle: { areaColor: '#E3F2FD', borderColor: '#fff', borderWidth: 1 },
            data: mapData,
          },
        ],
      };
    }
    return {};
  };

  // 全省六到位汇总
  const { summary: ps, oppCount, convertedCount } = provinceSummary;

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          {viewLevel === 'city' ? (
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <button onClick={() => navigate('/six-standard-list')} className="text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-lg font-medium text-gray-900 flex-1">
            {viewLevel === 'city' ? `${selectedCity?.name.replace('市', '')}六到位统计` : '六到位统计'}
          </h1>
        </div>
      </div>

      {/* 地图区域 - 无背景框，直接铺在页面底色上 */}
      <div style={{ height: 340 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-2 text-gray-400 text-sm">地图加载中...</span>
          </div>
        ) : viewLevel === 'province' && geoJson ? (
          <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            onEvents={{ click: handleCityClick }}
            opts={{ renderer: 'canvas' }}
          />
        ) : viewLevel === 'city' && districtGeoJson ? (
          <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">地图加载失败</div>
        )}
      </div>

      {/* 地图下提示 */}
      <div className="px-4 py-2 text-xs text-gray-400 text-center bg-white border-b">
        点击地市查看区县完成率 · 拖拽或缩放
      </div>

      {/* 地市总览视图 */}
      {viewLevel === 'province' && (
        <>
          {/* 六到位整体完成率 */}
          <div className="px-4 pt-4 pb-2">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">六到位整体完成率</span>
                <span className="text-xs text-gray-400">商机 {oppCount} · 已转化 {convertedCount}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  {((Object.values(ps).reduce((s, v) => s + v.rate, 0) / sixCategories.length)).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400 mb-1">全省平均</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(Object.values(ps).reduce((s, v) => s + v.rate, 0) / sixCategories.length)}%`,
                    background: 'linear-gradient(90deg, #90CAF9, #1976D2)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 六个到位分项统计 */}
          <div className="px-4 pb-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <span className="text-sm font-medium text-gray-700">六个到位完成情况</span>
              </div>
              <div className="divide-y divide-gray-50">
                {sixCategories.map((cat) => {
                  const data = ps[cat.key];
                  return (
                    <div key={cat.key} className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-1.5 h-8 rounded-full ${cat.barClass} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800">{cat.key}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">完成 {data.count}</span>
                            <span className={`text-sm font-semibold ${cat.textClass}`}>{data.rate.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className={`w-full h-1.5 ${cat.bgClass} rounded-full overflow-hidden`}>
                          <div
                            className={`h-full rounded-full ${cat.barClass}`}
                            style={{ width: `${data.rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 各地市六到位完成率排名 */}
          <div className="px-4 pb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">各地市完成率排名</div>
            <div className="space-y-2">
              {[...citySixData].sort((a, b) => calcCityOverallRate(b) - calcCityOverallRate(a)).map((city, i) => {
                const rate = calcCityOverallRate(city);
                return (
                  <div
                    key={city.adcode}
                    className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer shadow-sm border border-gray-50 hover:border-blue-200 active:bg-blue-50 transition-colors"
                    onClick={() => {
                      setSelectedCity(city);
                      setViewLevel('city');
                      loadDistrictMap(city.adcode);
                    }}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{city.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        商机 {city.oppCount} · 已转化 {city.convertedCount}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold" style={{ color: getBlueColor(rate) }}>
                        {rate.toFixed(1)}%
                      </div>
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${rate}%`, backgroundColor: getBlueColor(rate) }}
                        />
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 地市详情视图 */}
      {viewLevel === 'city' && selectedCity && (
        <div className="px-4 pt-4">
          {/* 地市六到位完成率 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{selectedCity.name}六到位整体完成率</span>
              <span className="text-xs text-gray-400">商机 {selectedCity.oppCount} · 已转化 {selectedCity.convertedCount}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {calcCityOverallRate(selectedCity).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400 mb-1">平均完成率</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${calcCityOverallRate(selectedCity)}%`,
                  background: 'linear-gradient(90deg, #90CAF9, #1976D2)',
                }}
              />
            </div>
          </div>

          {/* 六个到位分项 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3">
            <div className="px-4 py-3 border-b">
              <span className="text-sm font-medium text-gray-700">六个到位完成情况</span>
            </div>
            <div className="divide-y divide-gray-50">
              {sixCategories.map((cat) => {
                const data = selectedCity[cat.key as keyof typeof selectedCity] as { count: number; rate: number };
                return (
                  <div key={cat.key} className="px-4 py-3 flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${cat.barClass} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">{cat.key}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">完成 {data.count}</span>
                          <span className={`text-sm font-semibold ${cat.textClass}`}>{data.rate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className={`w-full h-1.5 ${cat.bgClass} rounded-full overflow-hidden`}>
                        <div className={`h-full rounded-full ${cat.barClass}`} style={{ width: `${data.rate}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 区县列表 */}
          <div className="pb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {selectedCity.name.replace('市', '')} — 区县完成率
            </div>
            {districtData[selectedCity.adcode] ? (
              <div className="space-y-2">
                {[...districtData[selectedCity.adcode]].sort((a, b) => b.rate - a.rate).map((district, i) => (
                  <div key={i} className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-50">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{district.name}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold" style={{ color: getBlueColor(district.rate) }}>
                        {district.rate}%
                      </div>
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${district.rate}%`, backgroundColor: getBlueColor(district.rate) }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-400 text-sm shadow-sm">
                暂无该地市区县数据
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}
