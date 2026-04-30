import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ArrowLeft, Loader2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';

// ===== Mock 数据 =====

const citySixData = [
  { name: '杭州市', adcode: '330100', oppCount: 68, convertedCount: 52, 客情掌握: { count: 48, rate: 70.59 }, 方案总控: { count: 45, rate: 66.18 }, 谈判应标自主: { count: 42, rate: 61.76 }, 采购自主: { count: 38, rate: 55.88 }, 项目强管控: { count: 35, rate: 51.47 }, 运维自主: { count: 28, rate: 41.18 } },
  { name: '宁波市', adcode: '330200', oppCount: 52, convertedCount: 41, 客情掌握: { count: 39, rate: 75.00 }, 方案总控: { count: 38, rate: 73.08 }, 谈判应标自主: { count: 36, rate: 69.23 }, 采购自主: { count: 32, rate: 61.54 }, 项目强管控: { count: 29, rate: 55.77 }, 运维自主: { count: 22, rate: 42.31 } },
  { name: '温州市', adcode: '330300', oppCount: 38, convertedCount: 28, 客情掌握: { count: 26, rate: 68.42 }, 方案总控: { count: 24, rate: 63.16 }, 谈判应标自主: { count: 23, rate: 60.53 }, 采购自主: { count: 20, rate: 52.63 }, 项目强管控: { count: 18, rate: 47.37 }, 运维自主: { count: 14, rate: 36.84 } },
  { name: '嘉兴市', adcode: '330400', oppCount: 29, convertedCount: 22, 客情掌握: { count: 21, rate: 72.41 }, 方案总控: { count: 19, rate: 65.52 }, 谈判应标自主: { count: 18, rate: 62.07 }, 采购自主: { count: 16, rate: 55.17 }, 项目强管控: { count: 14, rate: 48.28 }, 运维自主: { count: 11, rate: 37.93 } },
  { name: '湖州市', adcode: '330500', oppCount: 22, convertedCount: 18, 客情掌握: { count: 16, rate: 72.73 }, 方案总控: { count: 15, rate: 68.18 }, 谈判应标自主: { count: 14, rate: 63.64 }, 采购自主: { count: 12, rate: 54.55 }, 项目强管控: { count: 10, rate: 45.45 }, 运维自主: { count: 8, rate: 36.36 } },
  { name: '绍兴市', adcode: '330600', oppCount: 18, convertedCount: 15, 客情掌握: { count: 14, rate: 77.78 }, 方案总控: { count: 13, rate: 72.22 }, 谈判应标自主: { count: 12, rate: 66.67 }, 采购自主: { count: 10, rate: 55.56 }, 项目强管控: { count: 9, rate: 50.00 }, 运维自主: { count: 6, rate: 33.33 } },
  { name: '金华市', adcode: '330700', oppCount: 14, convertedCount: 11, 客情掌握: { count: 10, rate: 71.43 }, 方案总控: { count: 9, rate: 64.29 }, 谈判应标自主: { count: 9, rate: 64.29 }, 采购自主: { count: 8, rate: 57.14 }, 项目强管控: { count: 7, rate: 50.00 }, 运维自主: { count: 5, rate: 35.71 } },
  { name: '衢州市', adcode: '330800', oppCount: 8, convertedCount: 6, 客情掌握: { count: 5, rate: 62.50 }, 方案总控: { count: 5, rate: 62.50 }, 谈判应标自主: { count: 5, rate: 62.50 }, 采购自主: { count: 4, rate: 50.00 }, 项目强管控: { count: 4, rate: 50.00 }, 运维自主: { count: 3, rate: 37.50 } },
  { name: '舟山市', adcode: '330900', oppCount: 4, convertedCount: 3, 客情掌握: { count: 2, rate: 50.00 }, 方案总控: { count: 2, rate: 50.00 }, 谈判应标自主: { count: 2, rate: 50.00 }, 采购自主: { count: 2, rate: 50.00 }, 项目强管控: { count: 2, rate: 50.00 }, 运维自主: { count: 1, rate: 25.00 } },
  { name: '台州市', adcode: '331000', oppCount: 2, convertedCount: 1, 客情掌握: { count: 1, rate: 50.00 }, 方案总控: { count: 1, rate: 50.00 }, 谈判应标自主: { count: 1, rate: 50.00 }, 采购自主: { count: 1, rate: 50.00 }, 项目强管控: { count: 1, rate: 50.00 }, 运维自主: { count: 0, rate: 0.00 } },
  { name: '丽水市', adcode: '331100', oppCount: 1, convertedCount: 1, 客情掌握: { count: 1, rate: 100.00 }, 方案总控: { count: 1, rate: 100.00 }, 谈判应标自主: { count: 1, rate: 100.00 }, 采购自主: { count: 1, rate: 100.00 }, 项目强管控: { count: 1, rate: 100.00 }, 运维自主: { count: 0, rate: 0.00 } },
];

const sixCategories = [
  { key: '客情掌握', color: '#3B82F6', bg: '#EFF6FF', text: '客情' },
  { key: '方案总控', color: '#22C55E', bg: '#F0FDF4', text: '方案' },
  { key: '谈判应标自主', color: '#A855F7', bg: '#FAF5FF', text: '谈判' },
  { key: '采购自主', color: '#F97316', bg: '#FFF7ED', text: '采购' },
  { key: '项目强管控', color: '#EF4444', bg: '#FEF2F2', text: '项目' },
  { key: '运维自主', color: '#06B6D4', bg: '#ECFEFF', text: '运维' },
];

// 各区县 Mock 数据
const districtData: Record<string, { name: string; rate: number }[]> = {
  '330100': [{ name: '上城区', rate: 92.1 }, { name: '下城区', rate: 88.5 }, { name: '拱墅区', rate: 85.0 }, { name: '西湖区', rate: 90.3 }, { name: '滨江区', rate: 86.7 }, { name: '萧山区', rate: 82.4 }, { name: '余杭区', rate: 79.8 }, { name: '临平区', rate: 75.2 }, { name: '钱塘区', rate: 71.6 }, { name: '富阳区', rate: 68.9 }, { name: '临安区', rate: 65.3 }, { name: '桐庐县', rate: 62.7 }, { name: '淳安县', rate: 58.1 }],
  '330200': [{ name: '海曙区', rate: 88.2 }, { name: '江北区', rate: 85.6 }, { name: '北仑区', rate: 82.1 }, { name: '镇海区', rate: 79.4 }, { name: '鄞州区', rate: 91.3 }, { name: '奉化区', rate: 72.8 }, { name: '余姚市', rate: 68.5 }, { name: '慈溪市', rate: 75.2 }, { name: '象山县', rate: 65.7 }, { name: '宁海县', rate: 62.3 }],
  '330300': [{ name: '鹿城区', rate: 82.1 }, { name: '龙湾区', rate: 78.5 }, { name: '瓯海区', rate: 76.2 }, { name: '洞头区', rate: 70.8 }, { name: '永嘉县', rate: 68.4 }, { name: '平阳县', rate: 65.9 }, { name: '苍南县', rate: 62.3 }, { name: '文成县', rate: 58.7 }, { name: '泰顺县', rate: 55.2 }, { name: '瑞安市', rate: 72.6 }, { name: '乐清市', rate: 69.8 }],
  '330400': [{ name: '南湖区', rate: 91.5 }, { name: '秀洲区', rate: 88.2 }, { name: '嘉善县', rate: 85.7 }, { name: '海盐县', rate: 82.3 }, { name: '海宁市', rate: 79.6 }, { name: '平湖市', rate: 76.8 }, { name: '桐乡市', rate: 73.4 }],
  '330500': [{ name: '吴兴区', rate: 72.1 }, { name: '南浔区', rate: 68.5 }, { name: '德清县', rate: 65.2 }, { name: '长兴县', rate: 62.8 }, { name: '安吉县', rate: 58.4 }],
  '330600': [{ name: '越城区', rate: 82.4 }, { name: '柯桥区', rate: 79.7 }, { name: '上虞区', rate: 76.2 }, { name: '新昌县', rate: 72.5 }, { name: '诸暨市', rate: 68.9 }, { name: '嵊州市', rate: 65.3 }],
  '330700': [{ name: '婺城区', rate: 87.2 }, { name: '金东区', rate: 84.5 }, { name: '武义县', rate: 81.3 }, { name: '浦江县', rate: 78.6 }, { name: '磐安县', rate: 75.2 }, { name: '兰溪市', rate: 72.8 }, { name: '义乌市', rate: 79.4 }, { name: '东阳市', rate: 76.1 }, { name: '永康市', rate: 73.5 }],
  '330800': [{ name: '柯城区', rate: 75.3 }, { name: '衢江区', rate: 72.1 }, { name: '常山县', rate: 68.6 }, { name: '开化县', rate: 65.2 }, { name: '龙游县', rate: 61.8 }, { name: '江山市', rate: 58.4 }],
  '330900': [{ name: '定海区', rate: 68.2 }, { name: '普陀区', rate: 65.5 }, { name: '岱山县', rate: 62.1 }, { name: '嵊泗县', rate: 58.7 }],
  '331000': [{ name: '椒江区', rate: 82.5 }, { name: '黄岩区', rate: 79.2 }, { name: '路桥区', rate: 76.8 }, { name: '三门县', rate: 73.4 }, { name: '天台县', rate: 70.1 }, { name: '仙居县', rate: 67.5 }, { name: '温岭市', rate: 74.2 }, { name: '临海市', rate: 71.8 }, { name: '玉环市', rate: 68.5 }],
  '331100': [{ name: '莲都区', rate: 65.2 }, { name: '青田县', rate: 62.8 }, { name: '缙云县', rate: 59.4 }, { name: '遂昌县', rate: 56.1 }, { name: '松阳县', rate: 52.7 }, { name: '云和县', rate: 49.3 }, { name: '庆元县', rate: 45.8 }, { name: '景宁畲族自治县', rate: 42.4 }, { name: '龙泉市', rate: 48.6 }],
};

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

function calcCityRate(city: typeof citySixData[0]): number {
  const rates = sixCategories.map((c) => (city[c.key as keyof typeof city] as { count: number; rate: number }).rate);
  return rates.reduce((s, v) => s + v, 0) / sixCategories.length;
}

// ===== 环形进度组件 =====
interface RingProps {
  rate: number;
  color: string;
  bg: string;
  label: string;
  size?: number;
}

function RingChart({ rate, color, bg, label, size = 40 }: RingProps) {
  const r = 16;
  const cx = 20;
  const cy = 20;
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - rate / 100);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} viewBox="0 0 40 40">
        {/* 背景圆环 */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={bg} strokeWidth="4" />
        {/* 进度圆环 */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* 中心百分比 */}
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="700" fill={color}>
          {rate.toFixed(0)}%
        </text>
      </svg>
      <span className="text-[9px] text-gray-500 leading-tight text-center">{label}</span>
    </div>
  );
}

type ViewLevel = 'province' | 'city';

export function SixStandardStatistics() {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('province');
  const [selectedCity, setSelectedCity] = useState<typeof citySixData[0] | null>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [districtGeoJson, setDistrictGeoJson] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => { echarts.registerMap('zhejiang', data); setGeoJson(data); setLoading(false); })
      .catch((err) => { if (err.name !== 'AbortError') setLoading(false); });
    return () => controller.abort();
  }, []);

  const loadDistrictMap = useCallback((cityAdcode: string) => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${cityAdcode}_full.json`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => { echarts.registerMap(`city_${cityAdcode}`, data); setDistrictGeoJson({ adcode: cityAdcode, data }); setLoading(false); })
      .catch((err) => { if (err.name !== 'AbortError') setLoading(false); });
    return () => controller.abort();
  }, []);

  const handleCityClick = useCallback((params: any) => {
    const cityName = params.name?.replace(/市$/, '');
    const city = citySixData.find((c) => c.name.replace(/市$/, '') === cityName);
    if (city) { setSelectedCity(city); setViewLevel('city'); loadDistrictMap(city.adcode); }
  }, [loadDistrictMap]);

  const handleBack = useCallback(() => { setViewLevel('province'); setSelectedCity(null); }, []);

  const getOption = (): EChartsOption => {
    if (viewLevel === 'province' && geoJson) {
      const mapData = citySixData.map((city) => ({ name: city.name, value: calcCityRate(city) }));
      return {
        tooltip: { show: false },
        visualMap: {
          type: 'continuous', min: 30, max: 90, show: false,
          inRange: { color: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0'] },
        },
        series: [{
          type: 'map', map: 'zhejiang', roam: true, zoom: 1.1, scaleLimit: { min: 0.8, max: 5 },
          emphasis: { itemStyle: { areaColor: '#0D47A1', shadowBlur: 15, shadowColor: 'rgba(13,71,161,0.5)' }, label: { show: false } },
          select: { disabled: true },
          itemStyle: { areaColor: '#E3F2FD', borderColor: 'rgba(255,255,255,0.6)', borderWidth: 2 },
          label: {
            show: true, color: '#fff', fontSize: 11, fontWeight: 600,
            formatter: (params: any) => {
              const city = citySixData.find((c) => c.name === params.name);
              if (!city) return `{name|${params.name}}`;
              const rate = calcCityRate(city);
              return `{name|${params.name.replace('市', '')}}\n{rate|${rate.toFixed(0)}%}`;
            },
            rich: {
              name: { fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 18 },
              rate: { fontSize: 11, fontWeight: 600, color: '#E3F2FD', lineHeight: 16 },
            },
          },
          data: mapData,
        }],
      };
    } else if (viewLevel === 'city' && districtGeoJson) {
      const districts = districtData[districtGeoJson.adcode] || [];
      const mapData = districts.map((d) => ({ name: d.name, value: d.rate }));
      return {
        tooltip: { show: false },
        visualMap: {
          type: 'continuous', min: 30, max: 95, show: false,
          inRange: { color: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0'] },
        },
        series: [{
          type: 'map', map: `city_${districtGeoJson.adcode}`, roam: true, zoom: 1.2, scaleLimit: { min: 0.8, max: 6 },
          emphasis: { itemStyle: { areaColor: '#0D47A1', shadowBlur: 15, shadowColor: 'rgba(13,71,161,0.5)' }, label: { show: false } },
          select: { disabled: true },
          itemStyle: { areaColor: '#E3F2FD', borderColor: 'rgba(255,255,255,0.6)', borderWidth: 1.5 },
          label: {
            show: true, color: '#1565C0', fontSize: 10, fontWeight: 600,
            formatter: (params: any) => {
              const d = districts.find((x) => x.name === params.name);
              if (!d) return `{name|${params.name}}`;
              return `{name|${params.name}}\n{rate|${d.rate.toFixed(0)}%}`;
            },
            rich: {
              name: { fontSize: 11, fontWeight: 700, color: '#1565C0', lineHeight: 16 },
              rate: { fontSize: 10, fontWeight: 600, color: '#1976D2', lineHeight: 14 },
            },
          },
          data: mapData,
        }],
      };
    }
    return {};
  };

  const provinceAvg = citySixData.reduce((s, c) => s + calcCityRate(c), 0) / citySixData.length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EFF4FC]">
      {/* ===== 全屏地图 ===== */}
      <div className="absolute inset-0 z-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <span className="ml-3 text-gray-400 text-sm">地图加载中...</span>
          </div>
        ) : (
          <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }}
            onEvents={{ click: handleCityClick }} opts={{ renderer: 'canvas' }} />
        )}
      </div>

      {/* ===== 顶部 Header ===== */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/six-standard-list')} className="text-gray-600 hover:text-blue-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1">六到位</h1>
        </div>
        {/* Tabs */}
        <div className="flex border-t">
          <button
            onClick={() => navigate('/six-standard-list')}
            className="flex-1 py-2.5 text-sm font-medium transition-colors text-gray-500"
          >
            六到位清单
          </button>
          <button className="flex-1 py-2.5 text-sm font-medium transition-colors text-blue-600 border-b-2 border-blue-600">
            六到位统计
          </button>
        </div>
      </div>

      {/* ===== 全省完成率悬浮徽章 ===== */}
      <div className="absolute top-[80px] right-4 z-20 bg-blue-600 text-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
        <span className="text-xs opacity-90">全省</span>
        <span className="text-base font-bold leading-none">{provinceAvg.toFixed(1)}%</span>
      </div>

      {/* ===== 区县视图返回提示 ===== */}
      {viewLevel === 'city' && (
        <div className="absolute top-[80px] left-4 z-20 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm border border-gray-200">
          <button onClick={handleBack} className="text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-700">{selectedCity?.name.replace('市', '')} — 六到位统计</span>
        </div>
      )}

      {/* ===== 地市列表 ===== */}
      {viewLevel === 'province' && (
        <div
          className="absolute left-0 right-0 z-10 top-[48vh] bottom-0 max-h-[52vh] overflow-y-auto bg-white/80 backdrop-blur-lg rounded-t-2xl shadow-[0_-2px_16px_rgba(0,0,0,0.06)]"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 15%, white 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 15%, white 100%)' }}
        >
          <div className="px-3 pb-4 pt-1 space-y-2">
            {[...citySixData].sort((a, b) => calcCityRate(b) - calcCityRate(a)).map((city, i) => {
              const rate = calcCityRate(city);
              return (
                <div
                  key={city.adcode}
                  className="bg-white rounded-xl px-3 py-3 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md active:scale-[0.99] transition-all"
                  onClick={() => { setSelectedCity(city); setViewLevel('city'); loadDistrictMap(city.adcode); }}
                >
                  {/* 顶部：排名 + 地市名 + 整体完成率 */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-blue-50 text-blue-500'
                    }`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{city.name}</div>
                      <div className="text-[11px] text-gray-400">商机 {city.oppCount} · 已转化 {city.convertedCount}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold" style={{ color: getBlueColor(rate) }}>{rate.toFixed(1)}%</div>
                      <div className="text-[10px] text-gray-400">整体完成率</div>
                    </div>
                  </div>

                  {/* 六个到位环形图 */}
                  <div className="flex items-center justify-between gap-1 overflow-hidden">
                    {sixCategories.map((cat) => {
                      const data = city[cat.key as keyof typeof city] as { count: number; rate: number };
                      return (
                        <RingChart
                          key={cat.key}
                          rate={data.rate}
                          color={cat.color}
                          bg={cat.bg}
                          label={cat.text}
                          size={36}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== 区县视图 ===== */}
      {viewLevel === 'city' && selectedCity && (
        <div
          className="absolute left-0 right-0 z-10 top-[48vh] bottom-0 max-h-[52vh] overflow-y-auto bg-white/80 backdrop-blur-lg rounded-t-2xl"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 15%, white 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 15%, white 100%)' }}
        >
          <div className="px-3 pb-4 pt-1 space-y-2">
            {[...districtData[selectedCity.adcode] || []].sort((a, b) => b.rate - a.rate).map((district, i) => (
              <div key={i} className="bg-white rounded-xl px-3 py-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-400 text-yellow-900' :
                    i === 1 ? 'bg-gray-300 text-gray-700' :
                    i === 2 ? 'bg-orange-300 text-orange-900' :
                    'bg-blue-50 text-blue-500'
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{district.name}</div>
                    <div className="text-[11px] text-gray-400">商机 {selectedCity.oppCount} · 已转化 {selectedCity.convertedCount}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold" style={{ color: getBlueColor(district.rate) }}>{district.rate}%</div>
                    <div className="text-[10px] text-gray-400">完成率</div>
                  </div>
                </div>
                {/* 六个到位环形图 */}
                <div className="flex items-center justify-between gap-1 overflow-hidden">
                  {sixCategories.map((cat) => {
                    const data = selectedCity[cat.key as keyof typeof selectedCity] as { count: number; rate: number };
                    return (
                      <RingChart
                        key={cat.key}
                        rate={data.rate}
                        color={cat.color}
                        bg={cat.bg}
                        label={cat.text}
                        size={36}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
