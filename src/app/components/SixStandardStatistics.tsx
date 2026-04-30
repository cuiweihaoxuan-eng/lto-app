import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ArrowLeft, Loader2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';

// 浙江地市 Mock 数据
const cityData = [
  { name: '杭州市', adcode: '330100', rate: 87.5, oppCount: 68, completeCount: 52 },
  { name: '宁波市', adcode: '330200', rate: 82.3, oppCount: 52, completeCount: 41 },
  { name: '温州市', adcode: '330300', rate: 76.8, oppCount: 38, completeCount: 28 },
  { name: '嘉兴市', adcode: '330400', rate: 91.2, oppCount: 29, completeCount: 22 },
  { name: '湖州市', adcode: '330500', rate: 68.5, oppCount: 22, completeCount: 18 },
  { name: '绍兴市', adcode: '330600', rate: 79.4, oppCount: 18, completeCount: 15 },
  { name: '金华市', adcode: '330700', rate: 85.0, oppCount: 14, completeCount: 11 },
  { name: '衢州市', adcode: '330800', rate: 72.1, oppCount: 8, completeCount: 6 },
  { name: '舟山市', adcode: '330900', rate: 65.5, oppCount: 4, completeCount: 3 },
  { name: '台州市', adcode: '331000', rate: 78.9, oppCount: 2, completeCount: 1 },
  { name: '丽水市', adcode: '331100', rate: 58.3, oppCount: 1, completeCount: 1 },
];

// 各区县 Mock 数据
const districtData: Record<string, { name: string; rate: number }[]> = {
  '330100': [
    { name: '上城区', rate: 92.1 },
    { name: '下城区', rate: 88.5 },
    { name: '拱墅区', rate: 85.0 },
    { name: '西湖区', rate: 90.3 },
    { name: '滨江区', rate: 86.7 },
    { name: '萧山区', rate: 82.4 },
    { name: '余杭区', rate: 79.8 },
    { name: '临平区', rate: 75.2 },
    { name: '钱塘区', rate: 71.6 },
    { name: '富阳区', rate: 68.9 },
    { name: '临安区', rate: 65.3 },
    { name: '桐庐县', rate: 62.7 },
    { name: '淳安县', rate: 58.1 },
  ],
  '330200': [
    { name: '海曙区', rate: 88.2 },
    { name: '江北区', rate: 85.6 },
    { name: '北仑区', rate: 82.1 },
    { name: '镇海区', rate: 79.4 },
    { name: '鄞州区', rate: 91.3 },
    { name: '奉化区', rate: 72.8 },
    { name: '余姚市', rate: 68.5 },
    { name: '慈溪市', rate: 75.2 },
    { name: '象山县', rate: 65.7 },
    { name: '宁海县', rate: 62.3 },
  ],
  '330300': [
    { name: '鹿城区', rate: 82.1 },
    { name: '龙湾区', rate: 78.5 },
    { name: '瓯海区', rate: 76.2 },
    { name: '洞头区', rate: 70.8 },
    { name: '永嘉县', rate: 68.4 },
    { name: '平阳县', rate: 65.9 },
    { name: '苍南县', rate: 62.3 },
    { name: '文成县', rate: 58.7 },
    { name: '泰顺县', rate: 55.2 },
    { name: '瑞安市', rate: 72.6 },
    { name: '乐清市', rate: 69.8 },
  ],
  '330400': [
    { name: '南湖区', rate: 91.5 },
    { name: '秀洲区', rate: 88.2 },
    { name: '嘉善县', rate: 85.7 },
    { name: '海盐县', rate: 82.3 },
    { name: '海宁市', rate: 79.6 },
    { name: '平湖市', rate: 76.8 },
    { name: '桐乡市', rate: 73.4 },
  ],
  '330500': [
    { name: '吴兴区', rate: 72.1 },
    { name: '南浔区', rate: 68.5 },
    { name: '德清县', rate: 65.2 },
    { name: '长兴县', rate: 62.8 },
    { name: '安吉县', rate: 58.4 },
  ],
  '330600': [
    { name: '越城区', rate: 82.4 },
    { name: '柯桥区', rate: 79.7 },
    { name: '上虞区', rate: 76.2 },
    { name: '新昌县', rate: 72.5 },
    { name: '诸暨市', rate: 68.9 },
    { name: '嵊州市', rate: 65.3 },
  ],
  '330700': [
    { name: '婺城区', rate: 87.2 },
    { name: '金东区', rate: 84.5 },
    { name: '武义县', rate: 81.3 },
    { name: '浦江县', rate: 78.6 },
    { name: '磐安县', rate: 75.2 },
    { name: '兰溪市', rate: 72.8 },
    { name: '义乌市', rate: 79.4 },
    { name: '东阳市', rate: 76.1 },
    { name: '永康市', rate: 73.5 },
  ],
  '330800': [
    { name: '柯城区', rate: 75.3 },
    { name: '衢江区', rate: 72.1 },
    { name: '常山县', rate: 68.6 },
    { name: '开化县', rate: 65.2 },
    { name: '龙游县', rate: 61.8 },
    { name: '江山市', rate: 58.4 },
  ],
  '330900': [
    { name: '定海区', rate: 68.2 },
    { name: '普陀区', rate: 65.5 },
    { name: '岱山县', rate: 62.1 },
    { name: '嵊泗县', rate: 58.7 },
  ],
  '331000': [
    { name: '椒江区', rate: 82.5 },
    { name: '黄岩区', rate: 79.2 },
    { name: '路桥区', rate: 76.8 },
    { name: '三门县', rate: 73.4 },
    { name: '天台县', rate: 70.1 },
    { name: '仙居县', rate: 67.5 },
    { name: '温岭市', rate: 74.2 },
    { name: '临海市', rate: 71.8 },
    { name: '玉环市', rate: 68.5 },
  ],
  '331100': [
    { name: '莲都区', rate: 65.2 },
    { name: '青田县', rate: 62.8 },
    { name: '缙云县', rate: 59.4 },
    { name: '遂昌县', rate: 56.1 },
    { name: '松阳县', rate: 52.7 },
    { name: '云和县', rate: 49.3 },
    { name: '庆元县', rate: 45.8 },
    { name: '景宁畲族自治县', rate: 42.4 },
    { name: '龙泉市', rate: 48.6 },
  ],
};

// 获取颜色（根据完成率）
function getRateColor(rate: number): string {
  if (rate >= 90) return '#52c41a';
  if (rate >= 80) return '#73d13d';
  if (rate >= 70) return '#95de64';
  if (rate >= 60) return '#faad14';
  if (rate >= 50) return '#ffa940';
  return '#ff7875';
}

type ViewLevel = 'province' | 'city';

export function SixStandardStatistics() {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('province');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [districtGeoJson, setDistrictGeoJson] = useState<any>(null);

  // 获取省级 GeoJSON
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json', {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        echarts.registerMap('zhejiang', data);
        setGeoJson(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('加载浙江省地图失败', err);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  // 获取区县 GeoJSON
  const loadDistrictMap = useCallback((cityAdcode: string) => {
    if (districtData[cityAdcode]) {
      const controller = new AbortController();
      setLoading(true);
      fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${cityAdcode}_full.json`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          echarts.registerMap(`city_${cityAdcode}`, data);
          setDistrictGeoJson({ adcode: cityAdcode, data });
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('加载区县地图失败', err);
            setLoading(false);
          }
        });
      return () => controller.abort();
    }
  }, []);

  // 下钻到地市
  const handleCityClick = useCallback((params: any) => {
    const cityName = params.name?.replace(/市$/, '');
    const city = cityData.find((c) => c.name.replace(/市$/, '') === cityName);
    if (city) {
      setSelectedCity(city.adcode);
      setViewLevel('city');
      loadDistrictMap(city.adcode);
    }
  }, [loadDistrictMap]);

  // 返回省级视图
  const handleBack = useCallback(() => {
    setViewLevel('province');
    setSelectedCity(null);
  }, []);

  // 地图配置
  const getOption = (): EChartsOption => {
    const isProvince = viewLevel === 'province';

    if (isProvince) {
      // 省级地图
      const mapData = cityData.map((city) => ({
        name: city.name,
        value: city.rate,
      }));

      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: '#374151', fontSize: 13 },
          formatter: (params: any) => {
            const city = cityData.find((c) => c.name === params.name);
            if (!city) return params.name;
            return `<div style="font-weight:600;margin-bottom:4px">${params.name}</div>
              <div style="color:#666">商机数：<span style="color:#1890ff;font-weight:500">${city.oppCount}</span></div>
              <div style="color:#666">完成数：<span style="color:#52c41a;font-weight:500">${city.completeCount}</span></div>
              <div style="color:#666">完成率：<span style="color:${getRateColor(city.rate)};font-weight:600">${city.rate}%</span></div>`;
          },
        },
        visualMap: {
          type: 'continuous',
          min: 50,
          max: 100,
          left: 16,
          bottom: 16,
          text: ['高', '低'],
          textStyle: { color: '#666', fontSize: 11 },
          inRange: {
            color: ['#ff7875', '#ffa940', '#faad14', '#95de64', '#73d13d', '#52c41a'],
          },
          calculable: false,
          itemWidth: 10,
          itemHeight: 60,
        },
        series: [
          {
            type: 'map',
            map: 'zhejiang',
            roam: true,
            zoom: 1.2,
            scaleLimit: { min: 1, max: 3 },
            emphasis: {
              itemStyle: { areaColor: '#1890ff', shadowBlur: 10, shadowColor: 'rgba(24,144,255,0.4)' },
              label: { show: true, color: '#fff', fontSize: 11, fontWeight: 500 },
            },
            select: { disabled: true },
            itemStyle: {
              areaColor: '#e8e8e8',
              borderColor: '#fff',
              borderWidth: 1.5,
            },
            data: mapData,
          },
        ],
      };
    } else {
      // 区县地图
      const cityAdcode = selectedCity!;
      const city = cityData.find((c) => c.adcode === cityAdcode);
      const districts = districtData[cityAdcode] || [];

      const mapData = districts.map((d) => ({
        name: d.name,
        value: d.rate,
      }));

      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: '#374151', fontSize: 13 },
          formatter: (params: any) => {
            const district = districts.find((d) => d.name === params.name);
            if (!district) return params.name;
            return `<div style="font-weight:600;margin-bottom:4px">${params.name}</div>
              <div style="color:#666">六到位完成率：<span style="color:${getRateColor(district.rate)};font-weight:600">${district.rate}%</span></div>`;
          },
        },
        visualMap: {
          type: 'continuous',
          min: 40,
          max: 100,
          left: 16,
          bottom: 16,
          text: ['高', '低'],
          textStyle: { color: '#666', fontSize: 11 },
          inRange: {
            color: ['#ff7875', '#ffa940', '#faad14', '#95de64', '#73d13d', '#52c41a'],
          },
          calculable: false,
          itemWidth: 10,
          itemHeight: 60,
        },
        series: [
          {
            type: 'map',
            map: `city_${cityAdcode}`,
            roam: true,
            zoom: 1.5,
            scaleLimit: { min: 1, max: 4 },
            emphasis: {
              itemStyle: { areaColor: '#1890ff', shadowBlur: 10, shadowColor: 'rgba(24,144,255,0.4)' },
              label: { show: true, color: '#fff', fontSize: 11, fontWeight: 500 },
            },
            select: { disabled: true },
            itemStyle: {
              areaColor: '#e8e8e8',
              borderColor: '#fff',
              borderWidth: 1,
            },
            data: mapData,
          },
        ],
      };
    }
  };

  // 统计卡片
  const totalOpp = cityData.reduce((sum, c) => sum + c.oppCount, 0);
  const totalComplete = cityData.reduce((sum, c) => sum + c.completeCount, 0);
  const avgRate = totalOpp > 0 ? ((totalComplete / totalOpp) * 100).toFixed(1) : '0.0';

  const statsCards = [
    { label: '商机总数', value: totalOpp, color: 'text-blue-600', bg: 'from-blue-50 to-blue-100' },
    { label: '完成数', value: totalComplete, color: 'text-green-600', bg: 'from-green-50 to-green-100' },
    { label: '全省完成率', value: `${avgRate}%`, color: 'text-orange-600', bg: 'from-orange-50 to-orange-100' },
    { label: '地市数量', value: cityData.length, color: 'text-purple-600', bg: 'from-purple-50 to-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
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
            {viewLevel === 'city' ? `${selectedCity ? cityData.find((c) => c.adcode === selectedCity)?.name.replace('市', '') + '市区县数据' : ''}` : '六到位统计'}
          </h1>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white mx-3 mt-3 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-500 text-sm">地图加载中...</span>
          </div>
        ) : viewLevel === 'province' && geoJson ? (
          <ReactECharts
            option={getOption()}
            style={{ height: 360, width: '100%' }}
            onEvents={{ click: handleCityClick }}
            opts={{ renderer: 'canvas' }}
          />
        ) : viewLevel === 'city' && districtGeoJson ? (
          <ReactECharts
            option={getOption()}
            style={{ height: 360, width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <span className="text-gray-400 text-sm">地图加载失败</span>
          </div>
        )}
        <div className="px-4 py-2 text-xs text-gray-400 text-center border-t">
          点击地市可查看区县完成率 · 拖拽可缩放
        </div>
      </div>

      {/* Province view: city list */}
      {viewLevel === 'province' && (
        <>
          {/* Stats Cards */}
          <div className="px-3 grid grid-cols-2 gap-2 mt-3">
            {statsCards.map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.bg} rounded-xl p-3`}>
                <div className="text-xs text-gray-600 mb-1">{card.label}</div>
                <div className={`text-xl font-semibold ${card.color}`}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* City ranking */}
          <div className="px-3 mt-3 space-y-2">
            <div className="text-sm font-medium text-gray-800 px-1">各地市完成率排名</div>
            {[...cityData].sort((a, b) => b.rate - a.rate).map((city, i) => (
              <div
                key={city.adcode}
                className="bg-white rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                onClick={() => {
                  setSelectedCity(city.adcode);
                  setViewLevel('city');
                  loadDistrictMap(city.adcode);
                }}
              >
                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900' :
                  i === 1 ? 'bg-gray-300 text-gray-700' :
                  i === 2 ? 'bg-orange-300 text-orange-900' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{city.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    商机 {city.oppCount} · 完成 {city.completeCount}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-semibold" style={{ color: getRateColor(city.rate) }}>
                    {city.rate}%
                  </div>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${city.rate}%`, backgroundColor: getRateColor(city.rate) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* City view: district list */}
      {viewLevel === 'city' && selectedCity && (
        <div className="px-3 mt-3 space-y-2">
          {districtData[selectedCity] ? (
            <>
              <div className="text-sm font-medium text-gray-800 px-1">
                {cityData.find((c) => c.adcode === selectedCity)?.name.replace('市', '')} — 区县完成率
              </div>
              {[...districtData[selectedCity]].sort((a, b) => b.rate - a.rate).map((district, i) => (
                <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-400 text-yellow-900' :
                    i === 1 ? 'bg-gray-300 text-gray-700' :
                    i === 2 ? 'bg-orange-300 text-orange-900' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{district.name}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-semibold" style={{ color: getRateColor(district.rate) }}>
                      {district.rate}%
                    </div>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${district.rate}%`, backgroundColor: getRateColor(district.rate) }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center text-gray-400 text-sm">
              暂无该地市区县数据
            </div>
          )}
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
